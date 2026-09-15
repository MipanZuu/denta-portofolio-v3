import "server-only";

export function getSpotifyConfig() {
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN ?? "",
    redirectUri: process.env.SPOTIFY_REDIRECT_URI ?? "",
  };
}
