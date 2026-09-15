import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth/admin";
import { getSpotifyConfig } from "@/lib/spotify/config";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resultPage(title: string, message: string, refreshToken?: string) {
  const tokenField = refreshToken
    ? `<label>Refresh token<textarea readonly spellcheck="false">${escapeHtml(refreshToken)}</textarea></label>
       <ol><li>Copy the token above.</li><li>Save it as <code>SPOTIFY_REFRESH_TOKEN</code> in <code>.env.local</code>.</li><li>Add the same environment variable in Vercel and redeploy.</li></ol>`
    : "";

  return `<!doctype html>
  <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)}</title>
  <style>html{font-family:ui-sans-serif,system-ui,sans-serif;color:#11150f;background:radial-gradient(circle at 20% 10%,#edf4ff,transparent 34rem),#f5f3ec}body{min-height:100svh;margin:0;display:grid;place-items:center;padding:24px;box-sizing:border-box}.card{width:min(680px,100%);padding:clamp(28px,6vw,54px);box-sizing:border-box;border:1px solid rgba(255,255,255,.8);border-radius:44px 27px 44px 34px;background:rgba(255,255,255,.62);box-shadow:0 24px 60px rgba(44,57,47,.13),inset 0 1px 0 #fff;backdrop-filter:blur(22px)}small,code,label{font-family:ui-monospace,monospace}small{letter-spacing:.1em;text-transform:uppercase;color:#687067}h1{font-size:clamp(42px,8vw,70px);line-height:.94;letter-spacing:-.06em;margin:16px 0}p,li{color:#5e665e;line-height:1.65}label{display:grid;gap:9px;margin-top:28px;font-size:12px;text-transform:uppercase}textarea{min-height:130px;padding:14px;border:1px solid rgba(64,74,65,.18);border-radius:16px;background:rgba(255,255,255,.72);font:12px/1.5 ui-monospace,monospace;resize:vertical}a{display:inline-flex;margin-top:20px;padding:13px 18px;border-radius:999px;color:#fff;background:#121612;text-decoration:none;font:11px ui-monospace,monospace;text-transform:uppercase}</style></head>
  <body><main class="card"><small>Spotify connection</small><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>${tokenField}<a href="/dashboard/spotify">Back to setup</a></main></body></html>`;
}

function htmlResponse(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export async function GET(request: Request) {
  await requireAdmin("/dashboard/spotify");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const spotifyError = url.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("spotify_oauth_state")?.value;
  cookieStore.delete("spotify_oauth_state");

  if (spotifyError) {
    return htmlResponse(resultPage("Connection cancelled", "Spotify did not authorize the connection. You can return to the setup page and try again."), 400);
  }

  if (!code || !returnedState || !expectedState || returnedState !== expectedState) {
    return htmlResponse(resultPage("Connection expired", "The Spotify authorization could not be verified. Start the connection again from your dashboard."), 400);
  }

  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();
  if (!clientId || !clientSecret || !redirectUri) {
    return htmlResponse(resultPage("Configuration missing", "The Spotify client ID, secret, or redirect URI is missing from the server environment."), 500);
  }

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });
    const token = (await tokenResponse.json()) as { refresh_token?: string };

    if (!tokenResponse.ok || !token.refresh_token) {
      return htmlResponse(resultPage("Spotify declined the request", "Confirm that the callback URL exactly matches the one registered in Spotify, then try again."), 400);
    }

    return htmlResponse(resultPage("Spotify is connected", "Your refresh token is ready. Treat it like a password and do not commit it to Git.", token.refresh_token));
  } catch {
    return htmlResponse(resultPage("Spotify is unavailable", "The connection could not be completed right now. Please try again in a moment."), 502);
  }
}
