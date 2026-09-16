"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, BriefcaseBusiness, FlaskConical, type LucideIcon } from "lucide-react";

type ExplorerPath = { id: string; tab: string; eyebrow: string; title: string; description: string; icon: LucideIcon; links: Array<{ href: string; label: string; note: string }> };

const paths: ExplorerPath[] = [
  { id: "work", tab: "See the work", eyebrow: "For the curious builder", title: "Start with what I have shipped.", description: "See the products, decisions, and engineering tools behind my day-to-day work.", icon: BriefcaseBusiness, links: [
    { href: "/projects", label: "Selected projects", note: "Products and case studies" }, { href: "/experience", label: "Experience", note: "Roles and practical impact" }, { href: "/technologies", label: "Technology toolkit", note: "What I build with" },
  ] },
  { id: "story", tab: "Meet Denta", eyebrow: "For the human behind the tab", title: "There is a person behind the commits.", description: "Get the shorter, friendlier version of how I think, learn, and find ideas worth writing down.", icon: BookOpen, links: [
    { href: "/about", label: "About me", note: "Background and life outside work" }, { href: "/blog", label: "Field notes", note: "Things I learned the useful way" }, { href: "/docs", label: "Portfolio notes", note: "How this corner of the web works" },
  ] },
  { id: "play", tab: "Try something", eyebrow: "For five spare minutes", title: "Click first. Read the explanation later.", description: "Play a quick game, process an image locally, or wander around a black hole without leaving the browser.", icon: FlaskConical, links: [
    { href: "/playground", label: "Open Playground", note: "Small games and practical tools" }, { href: "/playground/preset-studio", label: "Preset Studio", note: "Try my photo presets" }, { href: "/space", label: "Enter Space", note: "An interactive WebGPU detour" },
  ] },
];

export function HomeExplorer() {
  const [activePath, setActivePath] = useState(paths[0].id);
  return <section className="home-explorer page-shell" aria-labelledby="home-explorer-title">
    <header className="home-explorer-heading"><p><span>01</span> Pick a direction</p><h2 id="home-explorer-title">What brought you here?</h2><p>No wrong door. They all lead somewhere useful or slightly strange.</p></header>
    <div className="home-explorer-tabs" role="tablist" aria-label="Choose what to explore">{paths.map((path) => { const Icon = path.icon; const selected = activePath === path.id; return <button id={`home-explorer-tab-${path.id}`} type="button" role="tab" aria-selected={selected} aria-controls={`home-explorer-panel-${path.id}`} className={selected ? "is-active" : ""} onClick={() => setActivePath(path.id)} key={path.id}><Icon aria-hidden="true" /><span>{path.tab}</span></button>; })}</div>
    <div className="home-explorer-panels">{paths.map((path) => { const selected = activePath === path.id; return <div id={`home-explorer-panel-${path.id}`} role="tabpanel" aria-labelledby={`home-explorer-tab-${path.id}`} className="home-explorer-panel" hidden={!selected} key={path.id}><div className="home-explorer-copy"><span>{path.eyebrow}</span><h3>{path.title}</h3><p>{path.description}</p></div><div className="home-explorer-links">{path.links.map((link) => <Link href={link.href} key={link.href}><span><strong>{link.label}</strong><small>{link.note}</small></span><span aria-hidden="true"><ArrowRight /></span></Link>)}</div></div>; })}</div>
  </section>;
}
