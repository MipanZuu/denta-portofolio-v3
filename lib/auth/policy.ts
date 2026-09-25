import "server-only";
import { contact } from "@/statics/contact";

type AuthUser = {
  id?: string | null;
  email?: string | null;
};

function envList(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Dashboard access is deliberately separate from authentication. A valid
 * session proves who someone is; this allow-list decides what they may do.
 * Prefer an immutable Neon Auth user ID in production. Email remains as a
 * migration fallback so an existing owner account is not locked out.
 */
export function isAdminUser(user: AuthUser | null | undefined) {
  if (!user) return false;

  const allowedIds = envList(process.env.PORTFOLIO_ADMIN_USER_IDS);
  const userId = user.id?.trim().toLowerCase();

  if (allowedIds.size > 0) return Boolean(userId && allowedIds.has(userId));

  const allowedEmails = envList(process.env.PORTFOLIO_ADMIN_EMAILS);
  if (allowedEmails.size === 0) allowedEmails.add(contact.email.toLowerCase());

  const email = user.email?.trim().toLowerCase();
  return Boolean(email && allowedEmails.has(email));
}

export function isAdminEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const allowedEmails = envList(process.env.PORTFOLIO_ADMIN_EMAILS);
  if (allowedEmails.size === 0) allowedEmails.add(contact.email.toLowerCase());
  return allowedEmails.has(normalizedEmail);
}

export function isAdminSignUpEnabled() {
  return process.env.AUTH_ALLOW_ADMIN_SIGN_UP === "true";
}
