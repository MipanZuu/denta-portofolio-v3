"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const tiltSelector = [
  ".about-lead",
  ".about-details > div",
  ".education-grid article",
  ".timeline-row",
  ".project-row",
  ".toolkit-group",
  ".tech-item",
  ".blog-feed-card",
  ".docs-panel",
].join(",");

export function RouteExperience() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tiltElements = Array.from(
      document.querySelectorAll<HTMLElement>(tiltSelector),
    );

    const removeTiltListeners = tiltElements.map((element) => {
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || reducedMotion) return;
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.setProperty("--route-tilt-x", `${y * -3.2}deg`);
        element.style.setProperty("--route-tilt-y", `${x * 3.2}deg`);
      };
      const reset = () => {
        element.style.setProperty("--route-tilt-x", "0deg");
        element.style.setProperty("--route-tilt-y", "0deg");
      };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", reset);
      return () => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", reset);
        element.style.removeProperty("--route-tilt-x");
        element.style.removeProperty("--route-tilt-y");
      };
    });

    return () => {
      removeTiltListeners.forEach((removeListeners) => removeListeners());
    };
  }, [pathname]);

  return null;
}
