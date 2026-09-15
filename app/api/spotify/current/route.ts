import { getSpotifyConfig } from "@/lib/spotify/config";

type SpotifyImage = { url?: string };

type SpotifyCurrentlyPlaying = {
  is_playing?: boolean;
  item?: {
    name?: string;
    external_urls?: { spotify?: string };
    artists?: Array<{ name?: string }>;
    album?: { images?: SpotifyImage[] };
  } | null;
};

const responseHeaders = {
  "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40",
};

function emptyResponse(configured: boolean) {
  return Response.json(
    { configured, isPlaying: false, track: null },
    { headers: responseHeaders },
  );
}

export async function GET() {
  const { clientId, clientSecret, refreshToken } = getSpotifyConfig();

  if (!clientId || !clientSecret || !refreshToken) return emptyResponse(false);

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) return emptyResponse(true);
    const token = (await tokenResponse.json()) as { access_token?: string };
    if (!token.access_token) return emptyResponse(true);

    const playingResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
        cache: "no-store",
      },
    );

    if (playingResponse.status === 204 || !playingResponse.ok) return emptyResponse(true);

    const playing = (await playingResponse.json()) as SpotifyCurrentlyPlaying;
    const item = playing.item;
    if (!item?.name) return emptyResponse(true);

    return Response.json(
      {
        configured: true,
        isPlaying: Boolean(playing.is_playing),
        track: {
          title: item.name,
          artist: item.artists?.map((artist) => artist.name).filter(Boolean).join(", ") || "Spotify",
          albumImageUrl: item.album?.images?.[0]?.url ?? null,
          spotifyUrl: item.external_urls?.spotify ?? null,
        },
      },
      { headers: responseHeaders },
    );
  } catch {
    return emptyResponse(true);
  }
}
