"use client";

// Based on digital-go-jp/design-system-example-components-html
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";
import { LogoutButton } from "@/src/features/auth/ui/logout-button";

export function NotesShell() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setEmail(data.session.user.email ?? null);
      setCheckingSession(false);
    })();
  }, [router]);

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

        <p className="dads-notes-placeholder">
          Your authenticated workspace is ready. Notes CRUD UI can be implemented in this area.
        </p>
      </section>
    </main>
  );
}
