import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  const baseUrl = process.env.DB_NEON_AUTH_BASE_URL ?? process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl) throw new Error("AUTH_CONFIG: Missing NEON_AUTH_BASE_URL (or DB_NEON_AUTH_BASE_URL) in this deployment.");
  if (!secret) throw new Error("AUTH_CONFIG: Missing NEON_AUTH_COOKIE_SECRET in this deployment.");
  if (secret.length < 32) throw new Error("AUTH_CONFIG: NEON_AUTH_COOKIE_SECRET must contain at least 32 characters.");

  authInstance ??= createNeonAuth({
    baseUrl,
    cookies: { secret, sessionDataTtl: 300 },
  });

  return authInstance;
}
