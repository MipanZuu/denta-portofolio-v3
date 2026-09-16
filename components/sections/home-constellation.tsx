"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, BookOpen, BriefcaseBusiness, FlaskConical, Orbit } from "lucide-react";

const signals = [
  { id: "work", label: "Work", eyebrow: "Built with purpose", title: "Products that solve a real problem.", copy: "A closer look at selected systems, interfaces, and the decisions that held them together.", href: "/projects", action: "Explore projects", icon: BriefcaseBusiness },
  { id: "thinking", label: "Notes", eyebrow: "Thinking in public", title: "Lessons worth keeping around.", copy: "Field notes from building, debugging, learning, and occasionally changing my mind.", href: "/blog", action: "Read field notes", icon: BookOpen },
  { id: "play", label: "Lab", eyebrow: "Made for curiosity", title: "Small experiments with working buttons.", copy: "Games, image tools, and browser ideas that are more useful than another static portfolio card.", href: "/playground", action: "Open the playground", icon: FlaskConical },
  { id: "space", label: "Space", eyebrow: "Take the scenic route", title: "A black hole, because why not?", copy: "An interactive WebGPU detour with celestial scenes you can orbit, zoom, and get briefly lost inside.", href: "/space", action: "Enter orbit", icon: Orbit },
] as const;

export function HomeConstellation() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const selected = signals[active];

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    stage.style.setProperty("--constellation-x", `${y * -5}deg`);
    stage.style.setProperty("--constellation-y", `${x * 7}deg`);
  };

  const resetPerspective = () => {
    stageRef.current?.style.setProperty("--constellation-x", "0deg");
    stageRef.current?.style.setProperty("--constellation-y", "0deg");
  };

  return <section className="home-constellation page-shell" aria-labelledby="constellation-title">
    <header className="home-section-heading"><p><span>03</span>Signal map</p><h2 id="constellation-title">A portfolio with<br />more than one orbit.</h2><p>Choose a signal and the center shifts with you.</p></header>
    <div className="constellation-layout">
      <div className="constellation-copy" aria-live="polite"><span>{selected.eyebrow}</span><h3>{selected.title}</h3><p>{selected.copy}</p><Link href={selected.href}>{selected.action}<ArrowRight aria-hidden="true" /></Link></div>
      <div className="constellation-stage-shell">
        <div className="constellation-stage" ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={resetPerspective}>
          <span className="constellation-glow" aria-hidden="true" />
          <span className="constellation-ring constellation-ring-one" aria-hidden="true" />
          <span className="constellation-ring constellation-ring-two" aria-hidden="true" />
          <div className="constellation-core"><small>Selected signal</small><strong>{selected.label}</strong><i /></div>
          {signals.map((signal, index) => { const Icon = signal.icon; return <button className={`constellation-node constellation-node-${index + 1} ${active === index ? "is-active" : ""}`} type="button" aria-pressed={active === index} onClick={() => setActive(index)} key={signal.id}><span><Icon aria-hidden="true" /></span><small>{signal.label}</small></button>; })}
        </div>
      </div>
    </div>
  </section>;
}
