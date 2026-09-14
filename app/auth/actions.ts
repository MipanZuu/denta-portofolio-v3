"use server";

import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/server";
import { contact } from "@/statics/contact";
import { personal } from "@/statics/personal";

export type AuthFormState = { error?: string };

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

function authFailure(error: unknown, fallback: string) {
  console.error("Portfolio dashboard authentication failed:", error);
  if (error instanceof Error && error.message.startsWith("AUTH_CONFIG:")) {
    return error.message.replace(
      "AUTH_CONFIG: ",
      "Authentication configuration error: ",
    );
  }
  return fallback;
}

export async function signInAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = credentials(formData);
  if (!email || !password) return { error: "Enter your email and password." };
  if (email !== contact.email.toLowerCase())
    return { error: "This account cannot access the portfolio dashboard." };

  try {
    const result = await getAuth().signIn.email({ email, password });
    if (result.error)
      return { error: result.error.message ?? "Unable to sign in." };
  } catch (error) {
    return {
      error: authFailure(
        error,
        "Unable to sign in. Check the Vercel function logs for the Neon Auth error.",
      ),
    };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = credentials(formData);
  if (email !== contact.email.toLowerCase())
    return {
      error: "Use the portfolio owner email to create the admin account.",
    };
  if (password.length < 8)
    return { error: "Use at least 8 characters for your password." };

  try {
    const result = await getAuth().signUp.email({
      email,
      password,
      name: personal.fullName,
    });
    if (result.error)
      return { error: result.error.message ?? "Unable to create the account." };
  } catch (error) {
    return {
      error: authFailure(
        error,
        "Unable to create the account. Check the Vercel function logs for the Neon Auth error.",
      ),
    };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  await getAuth().signOut();
  redirect("/auth/sign-in");
}
