import type { SupabaseClient } from "@supabase/supabase-js";

export async function createNote(
  client: SupabaseClient,
  payload: { title: string; body: string },
) {
  return client
    .from("notes")
    .insert({ title: payload.title, body: payload.body })
    .select("id")
    .single();
}
