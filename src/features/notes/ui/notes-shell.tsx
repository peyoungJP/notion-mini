"use client";

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
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6">
        <p className="text-sm text-zinc-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Notes</h1>
          {email ? <p className="text-sm text-zinc-600">{email}</p> : null}
        </div>
        <LogoutButton />
      </header>

      <section className="rounded-lg border border-dashed border-zinc-300 p-6">
        <p className="text-zinc-700">Notes feature is ready for CRUD implementation.</p>
      </section>
    </main>
  );
}
