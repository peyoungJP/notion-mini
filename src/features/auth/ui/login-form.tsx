"use client";

// Based on digital-go-jp/design-system-example-components-html
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";

type AuthMode = "signIn" | "signUp";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const modeLabel = useMemo(
    () => (mode === "signIn" ? "Sign in" : "Sign up"),
    [mode],
  );

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

    if (mode === "signIn") {
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
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setSubmitting(false);
      setError(signUpError.message);
      return;
    }

    if (!signUpData.session) {
      const { error: signInAfterSignUpError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInAfterSignUpError) {
        setSubmitting(false);
        setError(signInAfterSignUpError.message);
        return;
      }
    }

    setSubmitting(false);
    router.replace("/notes");
  }

  if (checkingSession) {
    return (
      <section className="dads-auth-card" aria-live="polite">
        <h1 className="dads-heading">Authentication</h1>
        <p className="dads-subheading">Loading session...</p>
      </section>
    );
  }

  const errorId = "auth-error-message";
  const emailSupportId = "auth-email-support";
  const passwordSupportId = "auth-password-support";

  return (
    <section className="dads-auth-card" aria-labelledby="auth-page-title">
      <h1 id="auth-page-title" className="dads-heading">
        Authentication
      </h1>
      <p className="dads-subheading">Sign in or create a new account with email/password.</p>

      <div className="dads-auth-actions" role="tablist" aria-label="Authentication mode">
        <button
          className="dads-button"
          data-size="md"
          data-type={mode === "signIn" ? "solid-fill" : "outline"}
          type="button"
          role="tab"
          aria-selected={mode === "signIn"}
          onClick={() => setMode("signIn")}
        >
          Sign in
        </button>
        <button
          className="dads-button"
          data-size="md"
          data-type={mode === "signUp" ? "solid-fill" : "outline"}
          type="button"
          role="tab"
          aria-selected={mode === "signUp"}
          onClick={() => setMode("signUp")}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="dads-form-control-label" data-size="md">
          <label className="dads-form-control-label__label" htmlFor="auth-email-input">
            Email
            <span className="dads-form-control-label__requirement" data-required="true">
              required
            </span>
          </label>
          <p id={emailSupportId} className="dads-form-control-label__support-text">
            Use the email address registered in Supabase Auth.
          </p>
          <div>
            <span className="dads-input-text">
              <input
                id="auth-email-input"
                className="dads-input-text__input"
                data-size="md"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${errorId} ${emailSupportId}` : emailSupportId}
              />
            </span>
          </div>
        </div>

        <div className="dads-form-control-label dads-auth-field" data-size="md">
          <label className="dads-form-control-label__label" htmlFor="auth-password-input">
            Password
            <span className="dads-form-control-label__requirement" data-required="true">
              required
            </span>
          </label>
          <p id={passwordSupportId} className="dads-form-control-label__support-text">
            Minimum 6 characters.
          </p>
          <div>
            <span className="dads-input-text">
              <input
                id="auth-password-input"
                className="dads-input-text__input"
                data-size="md"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                required
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${errorId} ${passwordSupportId}` : passwordSupportId}
              />
            </span>
          </div>
        </div>

        <button
          className="dads-button dads-auth-submit"
          data-size="md"
          data-type="solid-fill"
          type="submit"
          disabled={submitting}
        >
          {submitting ? `${modeLabel}...` : modeLabel}
        </button>
      </form>

      {error ? (
        <div className="dads-notification-banner" data-style="standard" data-type="error" role="alert">
          <h2 className="dads-notification-banner__heading">Authentication failed</h2>
          <p id={errorId} className="dads-notification-banner__body">
            {error}
          </p>
        </div>
      ) : null}
    </section>
  );
}
