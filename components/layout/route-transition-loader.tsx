"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { PlanetaryLoader } from "./planetary-loader";

const MINIMUM_VISIBLE_MS = 1750;
const SAFETY_TIMEOUT_MS = 10_000;

export function RouteTransitionLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const startedAt = useRef<number | null>(null);
  const previousPathname = useRef(pathname);
  const finishTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);

  useEffect(() => {
    // Warm the shared 3D chunk before the first navigation so the loader can
    // start moving immediately instead of waiting for a lazy import.
    void import("three");
  }, []);

  const clearTimers = useCallback(() => {
    if (finishTimer.current) window.clearTimeout(finishTimer.current);
    if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    finishTimer.current = null;
    safetyTimer.current = null;
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    startedAt.current = null;
    document.documentElement.removeAttribute("aria-busy");
    setVisible(false);
  }, [clearTimers]);

  const begin = useCallback(() => {
    clearTimers();
    startedAt.current = performance.now();
    document.documentElement.setAttribute("aria-busy", "true");
    flushSync(() => setVisible(true));
    safetyTimer.current = window.setTimeout(finish, SAFETY_TIMEOUT_MS);
  }, [clearTimers, finish]);

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.dataset.noRouteLoader !== undefined
      )
        return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;

      begin();
    };

    const handleHistoryNavigation = () => {
      if (window.location.pathname !== pathname) begin();
    };

    document.addEventListener("click", handleLinkClick, true);
    window.addEventListener("popstate", handleHistoryNavigation);
    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("popstate", handleHistoryNavigation);
    };
  }, [begin, pathname]);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (startedAt.current === null) return;

    const elapsed = performance.now() - startedAt.current;
    finishTimer.current = window.setTimeout(
      finish,
      Math.max(0, MINIMUM_VISIBLE_MS - elapsed),
    );
  }, [finish, pathname]);

  useEffect(
    () => () => {
      clearTimers();
      document.documentElement.removeAttribute("aria-busy");
    },
    [clearTimers],
  );

  return visible ? <PlanetaryLoader /> : null;
}
