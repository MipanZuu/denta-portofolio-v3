import type { Metadata } from "next";
import { ArrowRight, BookOpen, Database, Layers3, Rocket, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import docs from "@/statics/docs-next.json";
import { createPageMetadata, createWebPageJsonLd, seo } from "@/statics/seo";

export const metadata: Metadata = { ...createPageMetadata(docs.meta.title, docs.meta.description, "/docs/nextjs"), keywords: docs.meta.keywords };
const learningSteps = [
  { icon: BookOpen, label: "Foundation", copy: "Understand the request lifecycle and route tree.", ids: ["fundamentals", "routing"] },
  { icon: Layers3, label: "Architecture", copy: "Separate server work, browser interaction, and streamed data.", ids: ["server-component", "data-fetching"] },
  { icon: Database, label: "State and data", copy: "Control freshness, mutations, APIs, and recovery.", ids: ["cache", "server-actions", "route-handlers", "error-handling"] },
  { icon: ShieldCheck, label: "Trust", copy: "Protect data and describe public pages correctly.", ids: ["authentication", "metadata-seo"] },
  { icon: Rocket, label: "Product essentials", copy: "Build forms, configuration, accessibility, and locale support into the product.", ids: ["forms-validation", "environment-config", "accessibility", "internationalization"] },
  { icon: Rocket, label: "Ship", copy: "Test behaviour and operate the production build.", ids: ["testing", "deployment", "mistakes", "production"] }
];

export default function NextjsGuidePage() {
  return <>
    <JsonLd data={createWebPageJsonLd(docs.meta.title, docs.meta.description, "/docs/nextjs", "TechArticle")} />
    <article className="docs-guide-intro">
      <header className="docs-route-hero"><span>{docs.hero.eyebrow}</span><h1>{docs.hero.title}</h1><p>{docs.hero.description}</p><div><small>{docs.hero.updated}</small><small>{docs.hero.readingTime}</small></div></header>
      <section className="docs-intro-callout"><strong>What you will be able to decide</strong><p>By the end, you should be able to explain where code runs, choose a rendering and caching strategy, protect a mutation, design resilient routes, and ship pages that both people and search engines can understand.</p></section>
      <section className="docs-learning-path"><span>Learning path</span><h2>From request to production.</h2>{learningSteps.map((step, index) => { const Icon = step.icon; const first = docs.sections.find((section) => section.id === step.ids[0]); return <div className="docs-learning-step" key={step.label}><b>{String(index + 1).padStart(2, "0")}</b><Icon /><div><h3>{step.label}</h3><p>{step.copy}</p><small>{step.ids.length} chapters</small></div>{first && <Link href={`/docs/nextjs/${first.id}`} aria-label={`Start ${step.label}`}><ArrowRight /></Link>}</div>; })}</section>
      <section className="docs-start-here"><span>Recommended start</span><h2>Begin with the mental model.</h2><p>The first chapter gives every later API a place to fit. If you already build with the App Router, jump to caching or security and use the sidebar as your map.</p><Link href="/docs/nextjs/fundamentals">Start chapter one <ArrowRight /></Link></section>
      <footer className="docs-sources"><span>Resources</span><h2>Primary references</h2><div>{docs.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}</a>)}</div><small>Technical examples are based on the official Next.js documentation. This guide adds the reasoning and learning sequence around them. · {seo.siteName}</small></footer>
    </article>
  </>;
}
