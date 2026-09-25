"use server";

import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/server";
import { isAdminEmail, isAdminSignUpEnabled } from "@/lib/auth/policy";
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
  return fallback;
}

export async function signInAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = credentials(formData);
  if (!email || !password) return { error: "Enter your email and password." };
  if (!isAdminEmail(email))
    return { error: "The email or password is incorrect." };

  try {
    const result = await getAuth().signIn.email({ email, password });
    if (result.error)
      return { error: result.error.message ?? "Unable to sign in." };
  } catch (error) {
    return {
      error: authFailure(
        error,
        "Unable to sign in right now. Please try again later.",
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
  if (!isAdminSignUpEnabled())
    return { error: "Admin account creation is currently disabled." };
  if (!isAdminEmail(email))
    return {
      error: "Use the portfolio owner email to create the admin account.",
    };
  if (password.length < 12)
    return { error: "Use at least 12 characters for your password." };

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
        "Unable to create the account right now. Please try again later.",
      ),
    };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  await getAuth().signOut();
  redirect("/auth/sign-in");
}
