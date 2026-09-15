"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getSpotifyConfig } from "@/lib/spotify/config";

export async function startSpotifyAuthorizationAction() {
  await requireAdmin("/dashboard/spotify");

  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();
  if (!clientId || !clientSecret || !redirectUri) {
    redirect("/dashboard/spotify?error=configuration");
  }

  const state = randomBytes(24).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("spotify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/spotify/callback",
    maxAge: 10 * 60,
  });

  const authorizationUrl = new URL("https://accounts.spotify.com/authorize");
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "user-read-currently-playing user-read-playback-state",
    state,
    show_dialog: "true",
  }).toString();

  redirect(authorizationUrl.toString());
}
