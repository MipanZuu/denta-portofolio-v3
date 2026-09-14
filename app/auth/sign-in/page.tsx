import type { Metadata } from "next";
import { signInAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/dashboard/auth-form";

export const metadata: Metadata = { title: "Dashboard sign in", robots: { index: false, follow: false } };

export default function SignInPage() {
  return <main className="dashboard-auth page-shell"><section><p className="eyebrow">Private workspace</p><h1>Welcome back.</h1><p>Sign in to write, review, and publish your portfolio articles.</p><AuthForm action={signInAction} mode="sign-in" /></section></main>;
}
