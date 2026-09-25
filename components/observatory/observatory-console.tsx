"use client";

import { useEffect, useState } from "react";
import { Activity, Boxes, Database, Globe2, MonitorCog, RadioTower } from "lucide-react";

const architectureNodes = [
  { id: "visitor", label: "Visitor", detail: "The browser receives mostly pre-rendered pages, then hydrates only the interactive islands it needs.", icon: Globe2, x: 9, y: 49 },
  { id: "next", label: "Next.js", detail: "App Router composes server-rendered content, metadata, route handlers, and client interactions.", icon: Boxes, x: 34, y: 25 },
  { id: "content", label: "Content", detail: "Typed static collections power projects, technologies, journeys, playground tools, and documentation paths.", icon: Database, x: 66, y: 23 },
  { id: "runtime", label: "Runtime", detail: "Dynamic blog, authentication, uploads, and integrations run behind narrowly scoped server boundaries.", icon: MonitorCog, x: 61, y: 70 },
  { id: "signals", label: "Signals", detail: "Analytics, Web Vitals, structured data, and the sitemap make the system observable to people and crawlers.", icon: RadioTower, x: 88, y: 49 },
];

type RuntimeMetrics = {
  response: number | null;
  domReady: number | null;
  transfer: number | null;
};

export function ObservatoryConsole() {
  const [activeNode, setActiveNode] = useState(architectureNodes[1]);
  const [metrics, setMetrics] = useState<RuntimeMetrics>({ response: null, domReady: null, transfer: null });

  useEffect(() => {
    const measure = () => {
      const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (!entry) return;
      setMetrics({
        response: Math.round(entry.responseEnd),
        domReady: Math.round(entry.domContentLoadedEventEnd),
        transfer: entry.transferSize ? Math.round(entry.transferSize / 1024) : null,
      });
    };
    if (document.readyState === "complete") measure();
    else window.addEventListener("load", measure, { once: true });
    return () => window.removeEventListener("load", measure);
  }, []);

  return <>
    <section className="observatory-panel observatory-performance" aria-labelledby="performance-title">
      <header><span><Activity aria-hidden="true" /> Live from this browser</span><b>Local signal</b></header>
      <div>
        <article><strong>{metrics.response === null ? "—" : `${metrics.response}ms`}</strong><span>Document response</span></article>
        <article><strong>{metrics.domReady === null ? "—" : `${metrics.domReady}ms`}</strong><span>DOM ready</span></article>
        <article><strong>{metrics.transfer === null ? "cached" : `${metrics.transfer}KB`}</strong><span>HTML transferred</span></article>
      </div>
      <p id="performance-title">These numbers come from your current navigation—not a manufactured Lighthouse score. Cached visits and development mode can change them.</p>
    </section>

    <section className="observatory-panel observatory-architecture" aria-labelledby="architecture-title">
      <header>
        <div><p className="eyebrow">Interactive architecture map</p><h2 id="architecture-title">Follow a signal through the system.</h2></div>
        <span>Choose a node</span>
      </header>
      <div className="observatory-map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M9 49 C20 48 23 31 34 25 S54 22 66 23 S78 40 88 49" />
          <path d="M34 25 C39 47 46 65 61 70 S78 58 88 49" />
        </svg>
        {architectureNodes.map((node) => {
          const Icon = node.icon;
          return <button
            type="button"
            className={`observatory-map-node ${activeNode.id === node.id ? "is-active" : ""}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => setActiveNode(node)}
            aria-pressed={activeNode.id === node.id}
            key={node.id}
          ><Icon aria-hidden="true" /><span>{node.label}</span></button>;
        })}
        <div className="observatory-map-core" aria-live="polite">
          <span>{activeNode.label}</span>
          <p>{activeNode.detail}</p>
        </div>
      </div>
    </section>
  </>;
}
