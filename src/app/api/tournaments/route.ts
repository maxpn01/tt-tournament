import { hashEditKey } from "@/lib/edit-key";
import { apiError, stateIsReasonableSize } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createCloudTournamentSchema } from "@/lib/tournament-schema";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return apiError("Cloud storage is not configured", 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }
  if (!stateIsReasonableSize(body)) return apiError("Tournament data is too large", 413);

  const parsed = createCloudTournamentSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid tournament data", 400, parsed.error.flatten());
  }
  const { slug, editKey, data } = parsed.data;

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .insert({ slug, name: data.name, data })
    .select("id, slug, revision, updated_at")
    .single();

  if (error) {
    if (error.code === "23505") return apiError("That public link is already taken", 409);
    console.error("Tournament insert failed", error);
    return apiError("Could not create the shared tournament", 500);
  }

  const { error: secretError } = await supabase.from("tournament_edit_secrets").insert({
    tournament_id: tournament.id,
    edit_key_hash: hashEditKey(editKey),
  });

  if (secretError) {
    await supabase.from("tournaments").delete().eq("id", tournament.id);
    console.error("Tournament secret insert failed", secretError);
    return apiError("Could not secure the shared tournament", 500);
  }

  return Response.json(
    {
      slug: tournament.slug,
      revision: tournament.revision,
      updatedAt: tournament.updated_at,
    },
    { status: 201 },
  );
}
