import type { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth/server";

// Neon Auth validates the secure session cookie here and refreshes session
// data when needed. Authorization still runs in the dashboard layout/actions.
export default function proxy(request: NextRequest) {
  return getAuth().middleware({ loginUrl: "/auth/sign-in" })(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
