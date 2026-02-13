"use client";

// Based on digital-go-jp/design-system-example-components-html
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";
import { createNote } from "@/src/features/notes/data/create-note";
import { getNote } from "@/src/features/notes/data/get-note";
import { updateNote } from "@/src/features/notes/data/update-note";

type NoteEditorProps = {
  mode: "new" | "edit";
};

export function NoteEditor({ mode }: NoteEditorProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const noteId = mode === "edit" ? params?.id : undefined;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{ title?: string; body?: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const pageTitle = useMemo(
    () => (mode === "new" ? "Create note" : "Edit note"),
    [mode],
  );

  useEffect(() => {
    void (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      if (mode === "edit") {
        if (!noteId) {
          setError("Note id is missing.");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await getNote(supabase, noteId);
        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        setTitle(data?.title ?? "");
        setBody(data?.body ?? "");
      }

      setLoading(false);
    })();
  }, [mode, noteId, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldError({});

    const nextFieldError: { title?: string; body?: string } = {};
    if (!title.trim()) {
      nextFieldError.title = "タイトルは必須です。";
    }
    if (!body.trim()) {
      nextFieldError.body = "本文は必須です。";
    }
    if (nextFieldError.title || nextFieldError.body) {
      setFieldError(nextFieldError);
      setError("入力内容を確認してください。");
      return;
    }

    setSubmitting(true);

    if (mode === "new") {
      const { error: createError } = await createNote(supabase, {
        title: title.trim(),
        body: body.trim(),
      });

      setSubmitting(false);
      if (createError) {
        setError(createError.message);
        return;
      }

      router.replace("/notes?status=created");
      return;
    }

    if (!noteId) {
      setSubmitting(false);
      setError("Note id is missing.");
      return;
    }

    const { error: updateError } = await updateNote(supabase, noteId, {
      title: title.trim(),
      body: body.trim(),
    });

    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.replace("/notes?status=updated");
  }

  if (loading) {
    return (
      <main className="dads-notes-page" aria-live="polite">
        <section className="dads-notes-card">
          <h1 className="dads-heading">{pageTitle}</h1>
          <p className="dads-subheading">Loading...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dads-notes-page">
      <section className="dads-notes-card">
        <header className="dads-notes-header">
          <div>
            <h1 className="dads-heading">{pageTitle}</h1>
            <p className="dads-subheading">title と body を入力してください。</p>
          </div>
          <button
            type="button"
            className="dads-button"
            data-size="sm"
            data-type="outline"
            onClick={() => router.push("/notes")}
          >
            Back
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="dads-form-control-label" data-size="md">
            <label className="dads-form-control-label__label" htmlFor="note-title-input">
              Title
              <span className="dads-form-control-label__requirement" data-required="true">
                required
              </span>
            </label>
            <div>
              <span className="dads-input-text">
                <input
                  id="note-title-input"
                  className="dads-input-text__input"
                  data-size="md"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  aria-invalid={fieldError.title ? "true" : "false"}
                />
              </span>
              {fieldError.title ? <p className="dads-field-error">{fieldError.title}</p> : null}
            </div>
          </div>

          <div className="dads-form-control-label dads-auth-field" data-size="md">
            <label className="dads-form-control-label__label" htmlFor="note-body-input">
              Body
              <span className="dads-form-control-label__requirement" data-required="true">
                required
              </span>
            </label>
            <div>
              <textarea
                id="note-body-input"
                className="dads-textarea"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                required
                rows={8}
                aria-invalid={fieldError.body ? "true" : "false"}
              />
              {fieldError.body ? <p className="dads-field-error">{fieldError.body}</p> : null}
            </div>
          </div>

          <div className="dads-note-editor-actions">
            <button
              className="dads-button"
              data-size="md"
              data-type="outline"
              type="button"
              onClick={() => router.push("/notes")}
            >
              Cancel
            </button>
            <button
              className="dads-button"
              data-size="md"
              data-type="solid-fill"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        {error ? (
          <div
            className="dads-notification-banner"
            data-style="standard"
            data-type="error"
            role="alert"
          >
            <h2 className="dads-notification-banner__heading">Could not save note</h2>
            <p className="dads-notification-banner__body">{error}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
