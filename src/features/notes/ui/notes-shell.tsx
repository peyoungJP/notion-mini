"use client";

// Based on digital-go-jp/design-system-example-components-html
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";
import { LogoutButton } from "@/src/features/auth/ui/logout-button";
import { deleteNote } from "@/src/features/notes/data/delete-note";
import { listNotes } from "@/src/features/notes/data/list-notes";
import type { NoteListItem } from "@/src/features/notes/model/note";

export function NotesShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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

  async function handleDelete(id: string) {
    const shouldDelete = window.confirm("このノートを削除しますか？");
    if (!shouldDelete) return;

    setDeletingId(id);
    const { error } = await deleteNote(supabase, id);
    setDeletingId(null);

    if (error) {
      setLoadError(error.message);
      return;
    }

    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  const status = searchParams.get("status");
  const filteredNotes = notes.filter((note) =>
    (note.title ?? "").toLowerCase().includes(query.trim().toLowerCase()),
  );

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
            <p className="dads-subheading">
              {email ?? "Signed in user"} ・ {notes.length}件
            </p>
          </div>
          <div className="dads-notes-header-actions">
            <Link href="/notes/new" className="dads-button" data-size="sm" data-type="solid-fill">
              New note
            </Link>
            <LogoutButton />
          </div>
        </header>

        {status === "created" ? (
          <div className="dads-notification-banner dads-notification-banner--success" role="status">
            <h2 className="dads-notification-banner__heading">ノートを作成しました</h2>
          </div>
        ) : null}

        {status === "updated" ? (
          <div className="dads-notification-banner dads-notification-banner--success" role="status">
            <h2 className="dads-notification-banner__heading">ノートを更新しました</h2>
          </div>
        ) : null}

        <div className="dads-notes-toolbar">
          <label className="dads-notes-toolbar__search" htmlFor="notes-search">
            <span className="dads-notes-toolbar__label">タイトル検索</span>
            <input
              id="notes-search"
              className="dads-input-text__input"
              data-size="md"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例: meeting"
            />
          </label>
        </div>

        {loadError ? (
          <div className="dads-notification-banner" data-style="standard" data-type="error" role="alert">
            <h2 className="dads-notification-banner__heading">Failed to load notes</h2>
            <p className="dads-notification-banner__body">{loadError}</p>
          </div>
        ) : null}

        {!loadError && notes.length === 0 ? (
          <div className="dads-empty-state">
            <p className="dads-notes-placeholder">ノートがまだありません。</p>
            <Link href="/notes/new" className="dads-button" data-size="md" data-type="solid-fill">
              最初のノートを作成
            </Link>
          </div>
        ) : !loadError && filteredNotes.length === 0 ? (
          <p className="dads-notes-placeholder">検索条件に一致するノートがありません。</p>
        ) : (
          <ul className="dads-notes-list" aria-label="Your notes">
            {filteredNotes.map((note) => (
              <li key={note.id} className="dads-notes-item">
                <div className="dads-notes-item__header">
                  <p className="dads-notes-item__title">{note.title || "(Untitled)"}</p>
                  <div className="dads-notes-item__actions">
                    <Link
                      href={`/notes/${note.id}/edit`}
                      className="dads-button"
                      data-size="sm"
                      data-type="outline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="dads-button dads-button--danger"
                      data-size="sm"
                      data-type="outline"
                      disabled={deletingId === note.id}
                      onClick={() => handleDelete(note.id)}
                    >
                      {deletingId === note.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
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
