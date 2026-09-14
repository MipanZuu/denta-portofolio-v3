import "server-only";
import { redirect } from "next/navigation";
import { contact } from "@/statics/contact";
import { getAuth } from "./server";

export async function requireAdmin(returnTo = "/dashboard") {
  const { data: session } = await getAuth().getSession();

  if (!session?.user) {
    redirect(`/auth/sign-in?returnTo=${encodeURIComponent(returnTo)}`);
  }

  if (session.user.email.toLowerCase() !== contact.email.toLowerCase()) {
    redirect("/auth/not-authorized");
  }

  return session.user;
}
