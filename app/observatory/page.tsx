import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FlaskConical, Layers3, Orbit, Radio } from "lucide-react";
import { ObservatoryConsole } from "@/components/observatory/observatory-console";
import { JsonLd } from "@/components/seo/json-ld";
import { projects } from "@/statics/projects";
import { playgroundItems } from "@/statics/playground";
import { technologyGroups } from "@/statics/technologies";
import { siteChangelog } from "@/statics/changelog";
import nextDocs from "@/statics/docs-next.json";
import microservicesDocs from "@/statics/docs-microservices.json";
import monorepoDocs from "@/statics/docs-monorepo.json";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "A live observatory for Denta Bramasta's projects, experiments, documentation paths, technologies, site architecture, performance, and recent updates.";
export const metadata: Metadata = createPageMetadata("Observatory", description, "/observatory");

const readingPaths = [
  { title: "Next.js field guide", count: nextDocs.sections.length, href: "/docs/nextjs", note: "Rendering, data, architecture, performance, and production." },
  { title: "Microservices", count: microservicesDocs.sections.length, href: "/docs/microservices", note: "Boundaries, communication, reliability, data, and operations." },
  { title: "Monorepos", count: monorepoDocs.sections.length, href: "/docs/monorepo", note: "Workspaces, dependency graphs, task pipelines, and releases." },
];

export default function ObservatoryPage() {
  const technologyCount = technologyGroups.reduce((total, group) => total + group.items.length, 0);
  const featuredTechnologies = technologyGroups.reduce<Array<{ name: string; image: string }>>(
    (items, group) => [...items, ...group.items],
    [],
  ).slice(0, 16);

  return <main className="observatory-page">
    <JsonLd data={createWebPageJsonLd("Portfolio observatory", description, "/observatory", "CollectionPage")} />
    <section className="observatory-hero">
      <div>
        <p className="eyebrow"><Radio aria-hidden="true" /> MZ / Observatory</p>
        <h1>The portfolio,<br /><em>seen as a system.</em></h1>
        <p>Signals from the work, the learning library, and the machinery underneath this website—collected without pretending that every useful metric needs a giant dashboard.</p>
      </div>
      <div className="observatory-radar" aria-hidden="true"><i /><i /><i /><span><Orbit /></span></div>
    </section>

    <section className="observatory-stats" aria-label="Portfolio totals">
      <article><span>01</span><strong>{projects.length}</strong><p>Projects</p></article>
      <article><span>02</span><strong>{playgroundItems.length}</strong><p>Experiments</p></article>
      <article><span>03</span><strong>{readingPaths.reduce((sum, path) => sum + path.count, 0)}</strong><p>Doc chapters</p></article>
      <article><span>04</span><strong>{technologyCount}</strong><p>Technologies</p></article>
    </section>

    <ObservatoryConsole />

    <section className="observatory-grid">
      <article className="observatory-panel observatory-reading">
        <header><div><p className="eyebrow">Documentation paths</p><h2>Choose a learning orbit.</h2></div><BookOpen aria-hidden="true" /></header>
        <div>{readingPaths.map((path, index) => <Link href={path.href} key={path.href}><span>{String(index + 1).padStart(2, "0")} / {path.count} chapters</span><strong>{path.title}</strong><p>{path.note}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div>
      </article>

      <article className="observatory-panel observatory-tech">
        <header><div><p className="eyebrow">Current instruments</p><h2>Tools in active orbit.</h2></div><Layers3 aria-hidden="true" /></header>
        <div>{featuredTechnologies.map((technology) => <span key={technology.name}>{technology.name}</span>)}</div>
        <Link href="/technologies">View the complete toolkit <ArrowUpRight aria-hidden="true" /></Link>
      </article>
    </section>

    <section className="observatory-panel observatory-log">
      <header><div><p className="eyebrow">Site changelog</p><h2>Recent transmissions.</h2></div><FlaskConical aria-hidden="true" /></header>
      <ol>{siteChangelog.map((entry, index) => <li key={entry.title}><span>{String(index + 1).padStart(2, "0")}</span><time>{entry.date}</time><div><strong>{entry.title}</strong><p>{entry.detail}</p></div></li>)}</ol>
    </section>
  </main>;
}
