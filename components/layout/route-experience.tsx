"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const routeNames: Record<string, string> = {
  about: "About",
  projects: "Projects",
  experience: "Experience",
  technologies: "Technologies",
  contact: "Contact",
  blog: "Field notes",
};

const revealSelector = [
  ".section-heading",
  ".about-lead",
  ".about-details > div",
  ".education-grid article",
  ".timeline-row",
  ".project-row",
  ".toolkit-group",
  ".tech-item",
  ".contact-inner",
  ".blog-page-heading",
  ".blog-feed-card",
  ".blog-back-link",
  ".blog-detail-card",
].join(",");

const tiltSelector = [
  ".about-lead",
  ".about-details > div",
  ".education-grid article",
  ".timeline-row",
  ".project-row",
  ".toolkit-group",
  ".tech-item",
  ".blog-feed-card",
].join(",");

export function RouteExperience() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const route = pathname.split("/")[1];
  const enabled = Boolean(routeNames[route]);

  useEffect(() => {
    if (!enabled) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );
    const tiltElements = Array.from(
      document.querySelectorAll<HTMLElement>(tiltSelector),
    );

    let observer: IntersectionObserver | null = null;
    if (!reducedMotion && "IntersectionObserver" in window) {
      revealElements.forEach((element, index) => {
        element.classList.add("route-reveal");
        element.style.setProperty("--route-reveal-delay", `${(index % 5) * 55}ms`);
      });
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8%", threshold: 0.08 },
      );
      revealElements.forEach((element) => observer?.observe(element));
    } else {
      revealElements.forEach((element) => element.classList.add("is-revealed"));
    }

    const removeTiltListeners = tiltElements.map((element) => {
      element.classList.add("route-tilt-card");
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || reducedMotion) return;
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.setProperty("--route-tilt-x", `${y * -3.2}deg`);
        element.style.setProperty("--route-tilt-y", `${x * 3.2}deg`);
        element.style.setProperty("--route-glow-x", `${(x + 0.5) * 100}%`);
        element.style.setProperty("--route-glow-y", `${(y + 0.5) * 100}%`);
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
        element.classList.remove("route-tilt-card", "route-reveal", "is-revealed");
        element.style.removeProperty("--route-tilt-x");
        element.style.removeProperty("--route-tilt-y");
        element.style.removeProperty("--route-glow-x");
        element.style.removeProperty("--route-glow-y");
        element.style.removeProperty("--route-reveal-delay");
      };
    });

    const updateProgress = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? window.scrollY / documentHeight : 1;
      const clamped = Math.max(0, Math.min(1, progress));
      progressRef.current?.style.setProperty("transform", `scaleY(${clamped})`);
      progressTrackRef.current?.setAttribute(
        "aria-valuenow",
        String(Math.round(clamped * 100)),
      );
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    queueMicrotask(updateProgress);

    return () => {
      observer?.disconnect();
      revealElements.forEach((element) => {
        element.classList.remove("route-reveal", "is-revealed");
        element.style.removeProperty("--route-reveal-delay");
      });
      removeTiltListeners.forEach((removeListeners) => removeListeners());
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <aside className="route-reading-progress" aria-label={`${routeNames[route]} page progress`}>
        <span>{routeNames[route]}</span>
        <div
          className="route-progress-track"
          ref={progressTrackRef}
          role="progressbar"
          aria-label="Reading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        >
          <span ref={progressRef} />
        </div>
        <small>Scroll</small>
    </aside>
  );
}
