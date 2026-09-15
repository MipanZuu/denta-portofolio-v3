"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CurrentMood } from "@/components/spotify/current-mood";
import { ArrowUpRight, DownloadIcon } from "@/components/ui/icons";
import { personal } from "@/statics/personal";

const disciplines = ["PRODUCT THINKING", "FRONTEND CRAFT", "FULL-STACK SYSTEMS", "INTERACTIVE WEB"];

export function InteractiveHero() {
  const [discipline, setDiscipline] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setDiscipline((current) => (current + 1) % disciplines.length), 2100);
    return () => window.clearInterval(interval);
  }, []);

  return <section className="landing-hero page-shell">
    <div className="landing-copy">
      <p className="landing-name">{personal.fullName}</p>
      <p className="hero-eyebrow"><span className="availability-dot" />{personal.eyebrow}</p>
      <h1>Useful products.<br/><em>Memorable</em> experiences.</h1>
      <p className="landing-intro">{personal.intro}</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/projects">See selected work <ArrowUpRight /></Link>
        <button
          className="button button-ghost resume-disabled"
          type="button"
          disabled
          title="Résumé download is unavailable"
        >
          Résumé <DownloadIcon />
        </button>
      </div>
    </div>

    <div className="landing-aside">
      <div className="landing-signal" aria-label={`Currently exploring ${disciplines[discipline].toLowerCase()}`}>
        <div className="signal-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="signal-copy">
          <span>Currently exploring</span>
          <strong key={discipline}>{disciplines[discipline]}</strong>
        </div>
        <p>Engineering the details.<br/>Designing for people.</p>
      </div>
      <CurrentMood />
    </div>
  </section>;
}
