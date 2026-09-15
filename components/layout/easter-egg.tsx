"use client";

import { useEffect, useRef, useState } from "react";

const KONAMI_CODE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

export function EasterEgg() {
  const [open, setOpen] = useState(false);
  const keyPosition = useRef(0);
  const logoClicks = useRef<number[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reveal = () => {
      previousFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === "Escape") {
        setOpen(false);
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT"
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === KONAMI_CODE[keyPosition.current]) {
        keyPosition.current += 1;
        if (keyPosition.current === KONAMI_CODE.length) {
          keyPosition.current = 0;
          reveal();
        }
      } else {
        keyPosition.current = key === KONAMI_CODE[0] ? 1 : 0;
      }
    };

    const onLogoClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(".apple-brand")) return;

      const now = Date.now();
      logoClicks.current = [...logoClicks.current, now].filter(
        (time) => now - time < 2200,
      );
      if (logoClicks.current.length >= 5) {
        logoClicks.current = [];
        event.preventDefault();
        reveal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onLogoClick, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onLogoClick, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      previousFocus.current?.focus();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="easter-egg-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <section
        className="easter-egg-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="easter-egg-title"
        aria-describedby="easter-egg-description"
      >
        <div className="easter-egg-status" aria-hidden="true">
          <span />
          <span />
          <span />
          <small>secret-orbit :P</small>
        </div>

        <div className="easter-egg-copy">
          <span className="easter-egg-kicker">
            Achievement unlocked · 01/01
          </span>
          <h2 id="easter-egg-title">You found the tiny universe.</h2>
          <p id="easter-egg-description">
            Most people came for the projects. You inspected the edges. I like
            your style — curiosity is where the fun stuff usually starts.
          </p>
        </div>

        <div className="easter-egg-console" aria-hidden="true">
          <span>&gt; curiosity.check()</span>
          <strong>PASS — certified curious human :D</strong>
        </div>

        <button
          className="easter-egg-close"
          ref={closeButtonRef}
          type="button"
          onClick={() => setOpen(false)}
        >
          Back to Earth <span aria-hidden="true">↘</span>
        </button>
      </section>
    </div>
  );
}
