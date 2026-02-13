import type { SupabaseClient } from "@supabase/supabase-js";

export async function updateNote(
  client: SupabaseClient,
  id: string,
  payload: { title: string; body: string },
) {
  return client
    .from("notes")
    .update({ title: payload.title, body: payload.body })
    .eq("id", id)
    .select("id")
    .single();
}
