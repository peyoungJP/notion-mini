import type { SupabaseClient } from "@supabase/supabase-js";
import type { NoteDetail } from "@/src/features/notes/model/note";

export async function getNote(client: SupabaseClient, id: string) {
  return client
    .from("notes")
    .select("id,title,body,updated_at")
    .returns<NoteDetail>()
    .eq("id", id)
    .single();
}
