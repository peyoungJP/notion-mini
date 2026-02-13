"use client";

// Based on digital-go-jp/design-system-example-components-html
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";
import { LogoutButton } from "@/src/features/auth/ui/logout-button";
import { listNotes } from "@/src/features/notes/data/list-notes";
import type { NoteListItem } from "@/src/features/notes/model/note";

export function NotesShell() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setEmail(data.session.user.email ?? null);
      const { data: noteRows, error } = await listNotes(supabase);
      if (error) {
        setLoadError(error.message);
      } else {
        setNotes(noteRows ?? []);
      }
      setCheckingSession(false);
    })();
  }, [router]);

  function formatUpdatedAt(value: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("ja-JP");
  }

  if (checkingSession) {
    return (
      <main className="dads-notes-page" aria-live="polite">
        <section className="dads-notes-card">
          <h1 className="dads-heading">Notes</h1>
          <p className="dads-subheading">Loading your account...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dads-notes-page">
      <section className="dads-notes-card">
        <header className="dads-notes-header">
          <div>
            <h1 className="dads-heading">Notes</h1>
            <p className="dads-subheading">{email ?? "Signed in user"}</p>
          </div>
          <LogoutButton />
        </header>

        {loadError ? (
          <div className="dads-notification-banner" data-style="standard" data-type="error" role="alert">
            <h2 className="dads-notification-banner__heading">Failed to load notes</h2>
            <p className="dads-notification-banner__body">{loadError}</p>
          </div>
        ) : null}

        {!loadError && notes.length === 0 ? (
          <p className="dads-notes-placeholder">No notes yet.</p>
        ) : (
          <ul className="dads-notes-list" aria-label="Your notes">
            {notes.map((note) => (
              <li key={note.id} className="dads-notes-item">
                <p className="dads-notes-item__title">{note.title || "(Untitled)"}</p>
                <p className="dads-notes-item__meta">
                  Updated: {formatUpdatedAt(note.updated_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
