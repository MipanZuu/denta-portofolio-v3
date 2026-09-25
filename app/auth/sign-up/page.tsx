import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { signUpAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/dashboard/auth-form";
import { isAdminSignUpEnabled } from "@/lib/auth/policy";

export const metadata: Metadata = { title: "Create dashboard account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function SignUpPage() {
  if (!isAdminSignUpEnabled()) notFound();

  return <main className="dashboard-auth page-shell"><section><p className="eyebrow">One-time setup</p><h1>Create your admin account.</h1><p>Only the portfolio owner email is allowed to create and use this dashboard.</p><AuthForm action={signUpAction} mode="sign-up" /></section></main>;
}
