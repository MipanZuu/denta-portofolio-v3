import "server-only";
import { redirect } from "next/navigation";
import { getAuth } from "./server";
import { isAdminUser } from "./policy";

export async function requireAdmin(returnTo = "/dashboard") {
  const { data: session } = await getAuth().getSession();

  if (!session?.user) {
    redirect(`/auth/sign-in?returnTo=${encodeURIComponent(returnTo)}`);
  }

  if (!isAdminUser(session.user)) {
    redirect("/auth/not-authorized");
  }

  return session.user;
}
