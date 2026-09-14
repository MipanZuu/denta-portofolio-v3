"use client";

import Image from "next/image";
import Link from "next/link";
import { PointerEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, DownloadIcon } from "@/components/ui/icons";
import { personal } from "@/statics/personal";

const disciplines = ["PRODUCT THINKING", "FRONTEND CRAFT", "FULL-STACK SYSTEMS", "INTERACTIVE WEB"];

export function InteractiveHero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const [discipline, setDiscipline] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setDiscipline((current) => (current + 1) % disciplines.length), 2100);
    return () => window.clearInterval(interval);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const visual = visualRef.current;
    if (!visual) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    visual.style.setProperty("--hero-x", `${x * 100}%`);
    visual.style.setProperty("--hero-y", `${y * 100}%`);
    visual.style.setProperty("--hero-rotate-x", `${(0.5 - y) * 8}deg`);
    visual.style.setProperty("--hero-rotate-y", `${(x - 0.5) * 8}deg`);
  };

  const resetPointer = () => {
    const visual = visualRef.current;
    if (!visual) return;
    visual.style.setProperty("--hero-x", "50%");
    visual.style.setProperty("--hero-y", "50%");
    visual.style.setProperty("--hero-rotate-x", "0deg");
    visual.style.setProperty("--hero-rotate-y", "0deg");
  };

  return <section className="landing-hero page-shell">
    <div className="landing-copy">
      <p className="hero-eyebrow"><span className="availability-dot" />{personal.eyebrow}</p>
      <h1>Useful products.<br/><em>Memorable</em> experiences.</h1>
      <p className="landing-intro">{personal.intro}</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/projects">See selected work <ArrowUpRight /></Link>
        <a className="button button-ghost" href={personal.resume} target="_blank">Résumé <DownloadIcon /></a>
      </div>
    </div>

    <div className="interactive-portrait" ref={visualRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <div className="portrait-light" />
      <div className="portrait-card">
        <Image src={personal.portrait} alt="Denta Bramasta" fill priority sizes="(max-width: 800px) 90vw, 42vw" />
        <div className="portrait-shade" />
        <div className="portrait-status"><span>Currently exploring</span><strong key={discipline}>{disciplines[discipline]}</strong></div>
      </div>
      <div className="floating-note note-one"><span>01</span> Engineer the details</div>
      <div className="floating-note note-two"><span>02</span> Design for people</div>
      <div className="cursor-hint">Move your cursor</div>
    </div>
  </section>;
}
