import type { SupabaseClient } from "@supabase/supabase-js";
import type { NoteListItem } from "@/src/features/notes/model/note";

export async function listNotes(client: SupabaseClient) {
  return client
    .from("notes")
    .select("id,title,updated_at")
    .returns<NoteListItem[]>()
    .order("updated_at", { ascending: false });
}
