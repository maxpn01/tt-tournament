import { apiError, getEditKey, stateIsReasonableSize } from "@/lib/api";
import { editKeyMatches } from "@/lib/edit-key";
import { getSupabaseAdmin, getTournamentRow } from "@/lib/supabase/server";
import { parseTournament, updateCloudTournamentSchema } from "@/lib/tournament-schema";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { data: row, error } = await getTournamentRow(slug);
  if (error) return apiError("Cloud storage is not configured", 503);
  if (!row) return apiError("Tournament not found", 404);
  const parsed = parseTournament(row.data);
  if (!parsed.success) return apiError("Stored tournament data is invalid", 500);

  return Response.json(
    {
      slug: row.slug,
      revision: row.revision,
      updatedAt: row.updated_at,
      data: parsed.data,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(request: Request, context: RouteContext) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return apiError("Cloud storage is not configured", 503);
  const editKey = getEditKey(request);
  if (!editKey) return apiError("The tournament edit key is required", 401);

  const { slug } = await context.params;
  const { data: row } = await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!row) return apiError("Tournament not found", 404);

  const { data: secret } = await supabase
    .from("tournament_edit_secrets")
    .select("edit_key_hash")
    .eq("tournament_id", row.id)
    .maybeSingle();
  if (!secret || !editKeyMatches(editKey, secret.edit_key_hash)) {
    return apiError("Incorrect tournament edit key", 403);
  }

  // The edit-secret row is removed automatically via ON DELETE CASCADE.
  const { error } = await supabase.from("tournaments").delete().eq("id", row.id);
  if (error) {
    console.error("Tournament delete failed", error);
    return apiError("Could not delete the tournament", 500);
  }

  return Response.json({ ok: true });
}

export async function PATCH(request: Request, context: RouteContext) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return apiError("Cloud storage is not configured", 503);
  const editKey = getEditKey(request);
  if (!editKey) return apiError("The tournament edit key is required", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }
  if (!stateIsReasonableSize(body)) return apiError("Tournament data is too large", 413);
  const parsed = updateCloudTournamentSchema.safeParse(body);
  if (!parsed.success) return apiError("Invalid tournament update", 400, parsed.error.flatten());

  const { slug } = await context.params;
  const { data: row } = await supabase
    .from("tournaments")
    .select("id, slug, revision, updated_at, data")
    .eq("slug", slug)
    .maybeSingle();
  if (!row) return apiError("Tournament not found", 404);

  const { data: secret } = await supabase
    .from("tournament_edit_secrets")
    .select("edit_key_hash")
    .eq("tournament_id", row.id)
    .maybeSingle();
  if (!secret || !editKeyMatches(editKey, secret.edit_key_hash)) {
    return apiError("Incorrect tournament edit key", 403);
  }

  if (row.revision !== parsed.data.expectedRevision) {
    return Response.json(
      {
        error: "Tournament changed elsewhere",
        current: {
          slug: row.slug,
          revision: row.revision,
          updatedAt: row.updated_at,
          data: row.data,
        },
      },
      { status: 409 },
    );
  }

  const nextRevision = row.revision + 1;
  const { data: updated, error: updateError } = await supabase
    .from("tournaments")
    .update({
      name: parsed.data.data.name,
      data: parsed.data.data,
      revision: nextRevision,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .eq("revision", row.revision)
    .select("slug, revision, updated_at, data")
    .maybeSingle();

  if (updateError) {
    console.error("Tournament update failed", updateError);
    return apiError("Could not save the tournament", 500);
  }
  if (!updated) {
    const latest = await getTournamentRow(slug);
    return Response.json(
      {
        error: "Tournament changed elsewhere",
        current: latest.data
          ? {
              slug: latest.data.slug,
              revision: latest.data.revision,
              updatedAt: latest.data.updated_at,
              data: latest.data.data,
            }
          : null,
      },
      { status: 409 },
    );
  }

  return Response.json({
    slug: updated.slug,
    revision: updated.revision,
    updatedAt: updated.updated_at,
    data: updated.data,
  });
}
