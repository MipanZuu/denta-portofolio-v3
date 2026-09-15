import type { Metadata } from "next";
import { getSpotifyConfig } from "@/lib/spotify/config";
import { startSpotifyAuthorizationAction } from "./actions";

export const metadata: Metadata = { title: "Connect Spotify" };

export default async function SpotifySetupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const { clientId, clientSecret, refreshToken, redirectUri } = getSpotifyConfig();
  const credentialsReady = Boolean(clientId && clientSecret && redirectUri);

  return (
    <section className="spotify-setup">
      <header className="dashboard-heading">
        <div>
          <p className="eyebrow">Landing-page integration</p>
          <h1>Connect Spotify</h1>
          <p>Authorize your account once to power the Current mood card.</p>
        </div>
      </header>

      <div className="editor-card spotify-setup-card">
        <div className="editor-card-heading">
          <span>01</span>
          <div>
            <h2>Spotify application</h2>
            <p>Register this exact callback URL in your Spotify developer dashboard.</p>
          </div>
        </div>

        <div className="spotify-setup-details">
          <div>
            <span>Redirect URI</span>
            <code>{redirectUri || "Add SPOTIFY_REDIRECT_URI to your environment"}</code>
          </div>
          <ul>
            <li className={clientId ? "is-ready" : ""}>Client ID</li>
            <li className={clientSecret ? "is-ready" : ""}>Client secret</li>
            <li className={refreshToken ? "is-ready" : ""}>Refresh token</li>
          </ul>
          {query.error === "configuration" ? <p className="spotify-setup-error">Add the missing Spotify environment values, then restart the development server.</p> : null}
          <form action={startSpotifyAuthorizationAction}>
            <button className="button button-primary" type="submit" disabled={!credentialsReady}>Connect my Spotify</button>
          </form>
          <p className="field-note">After authorization, copy the generated refresh token into your local and Vercel environment settings.</p>
        </div>
      </div>
    </section>
  );
}
