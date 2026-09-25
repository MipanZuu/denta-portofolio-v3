import { getAuth } from "@/lib/auth/server";
import { isAdminSignUpEnabled } from "@/lib/auth/policy";

type AuthRouteContext = { params: Promise<{ path: string[] }> };

const protectedHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

async function guard(
  request: Request,
  context: AuthRouteContext,
  handler: (request: Request, context: AuthRouteContext) => Promise<Response>,
) {
  const { path } = await context.params;

  // Keep self-service registration closed after the one-time owner setup.
  if (path.some((segment) => segment.toLowerCase().includes("sign-up")) && !isAdminSignUpEnabled()) {
    return Response.json(
      { error: "Admin account creation is disabled." },
      { status: 403, headers: protectedHeaders },
    );
  }

  // Reject cross-origin state changes before they reach the auth provider.
  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return Response.json(
        { error: "Cross-origin authentication request rejected." },
        { status: 403, headers: protectedHeaders },
      );
    }
  }

  const response = await handler(request, context);
  for (const [key, value] of Object.entries(protectedHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export function GET(request: Request, context: AuthRouteContext) {
  return guard(request, context, getAuth().handler().GET);
}

export function POST(request: Request, context: AuthRouteContext) {
  return guard(request, context, getAuth().handler().POST);
}

export function PUT(request: Request, context: AuthRouteContext) {
  return guard(request, context, getAuth().handler().PUT);
}

export function PATCH(request: Request, context: AuthRouteContext) {
  return guard(request, context, getAuth().handler().PATCH);
}

export function DELETE(request: Request, context: AuthRouteContext) {
  return guard(request, context, getAuth().handler().DELETE);
}
