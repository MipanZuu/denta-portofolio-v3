"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthFormState } from "@/app/auth/actions";

type AuthFormProps = {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ action, mode }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const signingUp = mode === "sign-up";

  return <form className="dashboard-auth-form" action={formAction}>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Password<input name="password" type="password" autoComplete={signingUp ? "new-password" : "current-password"} minLength={signingUp ? 8 : undefined} required /></label>
    {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Please wait…" : signingUp ? "Create admin account" : "Sign in"}</button>
    <p>{signingUp ? "Already set up?" : "First time here?"} <Link href={signingUp ? "/auth/sign-in" : "/auth/sign-up"}>{signingUp ? "Sign in" : "Create the admin account"}</Link></p>
  </form>;
}
