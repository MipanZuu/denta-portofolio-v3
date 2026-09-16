"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";

type SpotifyMood = {
  configured: boolean;
  isPlaying: boolean;
  track: {
    title: string;
    artist: string;
    albumImageUrl: string | null;
    spotifyUrl: string | null;
  } | null;
};

const fallbackMood: SpotifyMood = {
  configured: false,
  isPlaying: false,
  track: null,
};

export function CurrentMood() {
  const [mood, setMood] = useState<SpotifyMood>(fallbackMood);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMood() {
      try {
        const response = await fetch("/api/spotify/current", {
          signal: controller.signal,
        });
        if (response.ok) setMood((await response.json()) as SpotifyMood);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setMood(fallbackMood);
        }
      }
    }

    void loadMood();
    const interval = window.setInterval(loadMood, 30_000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const content = (
    <>
      <span className="current-mood-art" aria-hidden="true">
        {mood.track?.albumImageUrl ? (
          <Image src={mood.track.albumImageUrl} alt="" fill sizes="54px" />
        ) : (
          <b>
            <Music2 />
          </b>
        )}
      </span>
      <span className="current-mood-copy">
        <small>Current mood</small>
        <strong>{mood.track?.title ?? "Between tracks"}</strong>
        <span>
          {mood.track?.artist ??
            (mood.configured
              ? "Check back in a beat"
              : "Spotify coming online")}
        </span>
      </span>
      <span
        className={`current-mood-equalizer${mood.isPlaying ? " is-playing" : ""}`}
        aria-label={mood.isPlaying ? "Playing now" : "Not currently playing"}
      >
        <i />
        <i />
        <i />
      </span>
    </>
  );

  return mood.track?.spotifyUrl ? (
    <a
      className="current-mood"
      href={mood.track.spotifyUrl}
      target="_blank"
      rel="noreferrer"
      aria-live="polite"
    >
      {content}
    </a>
  ) : (
    <div className="current-mood" aria-live="polite">
      {content}
    </div>
  );
}
