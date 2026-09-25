import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";
import { isAdminUser } from "@/lib/auth/policy";

const responseHeaders = {
  "Cache-Control": "no-store",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    if (body.type === "blob.generate-client-token") {
      const fetchSite = request.headers.get("sec-fetch-site");
      if (fetchSite && fetchSite !== "same-origin") {
        return NextResponse.json({ error: "Cross-origin access is not allowed." }, { status: 403, headers: responseHeaders });
      }

      const { data: session } = await getAuth().getSession();
      if (!session?.user) {
        return NextResponse.json({ error: "Authentication required." }, { status: 401, headers: responseHeaders });
      }
      if (!isAdminUser(session.user)) {
        return NextResponse.json({ error: "You are not allowed to upload blog images." }, { status: 403, headers: responseHeaders });
      }
    }

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const { data: session } = await getAuth().getSession();
        if (!session?.user || !isAdminUser(session.user)) {
          throw new Error("You are not allowed to upload blog images.");
        }
        if (!pathname.startsWith("portfolio-blog/")) throw new Error("Invalid upload destination.");

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
          maximumSizeInBytes: 15 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: session.user.id }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(response, { headers: responseHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400, headers: responseHeaders },
    );
  }
}
