"use client";

import { ChevronLeft, ChevronRight, Orbit, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const steps = [
  { selector: ".landing-copy", eyebrow: "Welcome aboard", title: "Meet the person behind the orbit.", copy: "Start with the work, principles, and kind of product craft Denta cares about." },
  { selector: ".landing-signal", eyebrow: "Navigation orbit", title: "Drag the wheel to choose a direction.", copy: "Every symbol is a route. Hover for its name, rotate the orbit, then select a destination." },
  { selector: ".home-snapshot", eyebrow: "A quick reading", title: "See the portfolio at a glance.", copy: "Projects, professional roles, and the working toolkit form the coordinates for the rest of the site." },
  { selector: ".home-playground", eyebrow: "Interactive laboratory", title: "Try the work, do not just read it.", copy: "The Playground contains small tools, experiments, and games built to be used in the browser." },
  { selector: ".home-next", eyebrow: "Choose your path", title: "Go deeper when you are ready.", copy: "Explore the story, experience, technical guides, or ask Mizu in the lower corner for directions." },
] as const;

export function FirstOrbitTour() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const replay = () => { setStep(0); setOpen(true); };
    window.addEventListener("portfolio-replay-tour", replay);
    if (pathname === "/" && window.sessionStorage.getItem("portfolio-launch-tour") === "true") {
      window.sessionStorage.removeItem("portfolio-launch-tour");
      const frame = window.requestAnimationFrame(replay);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("portfolio-replay-tour", replay);
      };
    }
    return () => window.removeEventListener("portfolio-replay-tour", replay);
  }, [pathname]);

  useEffect(() => {
    if (!open || pathname !== "/") return;
    const target = document.querySelector<HTMLElement>(steps[step].selector);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    const update = () => setRect(target?.getBoundingClientRect() ?? null);
    const timer = window.setTimeout(update, 420);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [open, pathname, step]);

  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") setStep((current) => Math.min(steps.length - 1, current + 1));
      if (event.key === "ArrowLeft") setStep((current) => Math.max(0, current - 1));
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [close, open]);

  if (!open || pathname !== "/") return null;
  const current = steps[step];

  return <div className="first-orbit" role="dialog" aria-modal="true" aria-label="First orbit website tour">
    <div className="first-orbit-shade" />
    {rect && <div className="first-orbit-focus" style={{ top: rect.top - 12, left: rect.left - 12, width: rect.width + 24, height: rect.height + 24 }} />}
    <section className="first-orbit-card">
      <header><span><Orbit /> First orbit</span><button type="button" onClick={close} aria-label="Close tour"><X /></button></header>
      <div className="first-orbit-count"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      <p>{current.eyebrow}</p><h2>{current.title}</h2><div>{current.copy}</div>
      <footer>
        <button type="button" onClick={close}>Skip tour</button>
        <span>{String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
        <div>
          <button type="button" onClick={() => setStep((value) => value - 1)} disabled={step === 0} aria-label="Previous stop"><ChevronLeft /></button>
          <button type="button" onClick={() => step === steps.length - 1 ? close() : setStep((value) => value + 1)}>{step === steps.length - 1 ? "Finish" : "Next"}<ChevronRight /></button>
        </div>
      </footer>
    </section>
  </div>;
}
