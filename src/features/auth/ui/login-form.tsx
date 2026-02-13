"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/notes");
        return;
      }
      setCheckingSession(false);
    })();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/notes");
  }

  if (checkingSession) {
    return <p className="text-sm text-zinc-600">Loading...</p>;
  }

  return (
    <section className="w-full rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="mb-5 text-2xl font-semibold text-zinc-900">Login</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-800">Email</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-0 focus:border-zinc-500"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-zinc-800">Password</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-0 focus:border-zinc-500"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
