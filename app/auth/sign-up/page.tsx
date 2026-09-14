import type { Metadata } from "next";
import { signUpAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/dashboard/auth-form";

export const metadata: Metadata = { title: "Create dashboard account", robots: { index: false, follow: false } };

export default function SignUpPage() {
  return <main className="dashboard-auth page-shell"><section><p className="eyebrow">One-time setup</p><h1>Create your admin account.</h1><p>Only the portfolio owner email is allowed to create and use this dashboard.</p><AuthForm action={signUpAction} mode="sign-up" /></section></main>;
}
