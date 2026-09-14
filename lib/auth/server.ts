import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  const baseUrl = process.env.DB_NEON_AUTH_BASE_URL ?? process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl || !secret) {
    throw new Error("Neon Auth is not configured. Add NEON_AUTH_COOKIE_SECRET and a Neon Auth base URL.");
  }

  authInstance ??= createNeonAuth({
    baseUrl,
    cookies: { secret, sessionDataTtl: 300 },
  });

  return authInstance;
}
