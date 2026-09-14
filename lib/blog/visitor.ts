import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const VISITOR_COOKIE = "portfolio_blog_visitor";

export async function readVisitorId() {
  return (await cookies()).get(VISITOR_COOKIE)?.value;
}

export async function ensureVisitorId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;

  const visitorId = randomUUID();
  cookieStore.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return visitorId;
}
