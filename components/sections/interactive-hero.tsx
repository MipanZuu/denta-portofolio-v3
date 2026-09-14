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

  return <section className="landing-stage">
    <div className="landing-orb landing-orb-one" aria-hidden="true" />
    <div className="landing-orb landing-orb-two" aria-hidden="true" />
    <div className="landing-stage-inner page-shell">
      <div className="landing-topline">
        <p><span className="availability-dot" />Hello, I&apos;m Denta.</p>
        <p>Eindhoven, NL <span>↗</span> Worldwide</p>
      </div>

      <div className="landing-title" aria-label="Denta Bramasta, software engineer who builds">
        <span className="landing-title-name">Denta Bramasta</span>
        <h1>Software engineer<br/><em>who builds.</em></h1>
      </div>

      <div className="interactive-portrait" ref={visualRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div className="portrait-light" />
        <div className="portrait-card">
          <Image src={personal.portrait} alt="Portrait of Denta Bramasta" fill priority sizes="(max-width: 800px) 52vw, 24vw" />
          <div className="portrait-shade" />
        </div>
        <div className="floating-note note-one">Engineer <span>+</span> designer</div>
        <div className="floating-note note-two"><span className="status-pulse" /> At ParkMundo</div>
      </div>

      <div className="landing-bottomline">
        <p>{personal.intro}</p>
        <div className="landing-discipline"><span>Currently exploring</span><strong key={discipline}>{disciplines[discipline]}</strong></div>
        <div className="landing-actions">
          <Link href="/projects">Explore my work <ArrowUpRight /></Link>
          <a href={personal.resume} target="_blank" rel="noreferrer">Résumé <DownloadIcon /></a>
        </div>
      </div>
    </div>
    <a className="landing-scroll" href="#selected-work"><span>Scroll to explore</span><b>↓</b></a>
  </section>;
}
