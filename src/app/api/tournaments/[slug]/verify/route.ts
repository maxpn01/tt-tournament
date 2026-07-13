import { apiError, getEditKey } from "@/lib/api";
import { editKeyMatches } from "@/lib/edit-key";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return apiError("Cloud storage is not configured", 503);
  const editKey = getEditKey(request);
  if (!editKey) return apiError("The tournament edit key is required", 401);

  const { slug } = await context.params;
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!tournament) return apiError("Tournament not found", 404);

  const { data: secret } = await supabase
    .from("tournament_edit_secrets")
    .select("edit_key_hash")
    .eq("tournament_id", tournament.id)
    .maybeSingle();
  if (!secret || !editKeyMatches(editKey, secret.edit_key_hash)) {
    return apiError("Incorrect tournament edit key", 403);
  }
  return Response.json({ ok: true });
}
