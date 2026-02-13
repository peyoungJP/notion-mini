import type { SupabaseClient } from "@supabase/supabase-js";

export async function deleteNote(client: SupabaseClient, id: string) {
  return client.from("notes").delete().eq("id", id);
}
