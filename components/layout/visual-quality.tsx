"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type VisualQualityPreference = "auto" | "high" | "balanced" | "low";
export type VisualQuality = Exclude<VisualQualityPreference, "auto">;

type VisualQualityContextValue = {
  preference: VisualQualityPreference;
  quality: VisualQuality;
  setPreference: (preference: VisualQualityPreference) => void;
};

const VisualQualityContext = createContext<VisualQualityContextValue>({
  preference: "auto",
  quality: "balanced",
  setPreference: () => {},
});

function detectQuality(): VisualQuality {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "low";
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if ((memory && memory <= 4) || (cores && cores <= 4)) return "low";
  if (
    window.matchMedia("(max-width: 800px)").matches ||
    (memory && memory <= 8)
  )
    return "balanced";
  return "high";
}

export function VisualQualityProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] =
    useState<VisualQualityPreference>("auto");
  const [automaticQuality, setAutomaticQuality] =
    useState<VisualQuality>("balanced");
  const quality = preference === "auto" ? automaticQuality : preference;

  useEffect(() => {
    const update = () => setAutomaticQuality(detectQuality());
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.matchMedia("(max-width: 800px)");
    const initialFrame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("portfolio-visual-quality");
      if (
        saved === "auto" ||
        saved === "high" ||
        saved === "balanced" ||
        saved === "low"
      )
        setPreferenceState(saved);
      update();
    });
    motion.addEventListener("change", update);
    viewport.addEventListener("change", update);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      motion.removeEventListener("change", update);
      viewport.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.visualQuality = quality;
    window.dispatchEvent(
      new CustomEvent("portfolio-quality-change", { detail: { quality } }),
    );
  }, [quality]);

  const value = useMemo<VisualQualityContextValue>(
    () => ({
      preference,
      quality,
      setPreference(next) {
        setPreferenceState(next);
        window.localStorage.setItem("portfolio-visual-quality", next);
      },
    }),
    [preference, quality],
  );

  return (
    <VisualQualityContext.Provider value={value}>
      {children}
    </VisualQualityContext.Provider>
  );
}

export function useVisualQuality() {
  return useContext(VisualQualityContext);
}
