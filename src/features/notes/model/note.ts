export type NoteListItem = {
  id: string;
  title: string | null;
  updated_at: string | null;
};

export type NoteDetail = NoteListItem & {
  body: string | null;
};
