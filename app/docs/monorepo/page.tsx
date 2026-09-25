import type { Metadata } from "next";
import { ArrowRight, BookOpen, Boxes, GitBranch, PackageCheck, Workflow } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import docs from "@/statics/docs-monorepo.json";
import { createPageMetadata, createWebPageJsonLd, seo } from "@/statics/seo";

export const metadata: Metadata = { ...createPageMetadata(docs.meta.title, docs.meta.description, "/docs/monorepo"), keywords: docs.meta.keywords };
const steps = [
  { icon: BookOpen, label: "Model", copy: "Separate repository structure, package boundaries, and deployments.", id: "mental-model" },
  { icon: Boxes, label: "Organise", copy: "Design workspaces and contracts that remain understandable.", id: "workspace-design" },
  { icon: GitBranch, label: "Build", copy: "Use the dependency graph for ordering, caching, and affected work.", id: "dependency-graph" },
  { icon: Workflow, label: "Verify", copy: "Create fast CI without losing a complete source of truth.", id: "testing-ci" },
  { icon: PackageCheck, label: "Operate", copy: "Own, version, migrate, and measure the repository.", id: "versioning-ownership" }
];
export default function MonorepoGuidePage() { return <><JsonLd data={createWebPageJsonLd(docs.meta.title, docs.meta.description, "/docs/monorepo", "TechArticle")} /><article className="docs-guide-intro">
  <header className="docs-route-hero"><span>{docs.hero.eyebrow}</span><h1>{docs.hero.title}</h1><p>{docs.hero.description}</p><div><small>{docs.hero.updated}</small><small>{docs.hero.readingTime}</small></div></header>
  <section className="docs-intro-callout"><strong>What you will be able to decide</strong><p>Whether a monorepo fits, how packages should depend on each other, what makes tasks cacheable, how affected CI stays correct, and how teams own and release shared code.</p></section>
  <section className="docs-learning-path"><span>Learning path</span><h2>From workspace to dependable delivery.</h2>{steps.map((step, index) => { const Icon = step.icon; return <div className="docs-learning-step" key={step.id}><b>{String(index + 1).padStart(2, "0")}</b><Icon /><div><h3>{step.label}</h3><p>{step.copy}</p></div><Link href={`/docs/monorepo/${step.id}`} aria-label={`Start ${step.label}`}><ArrowRight /></Link></div>; })}</section>
  <section className="docs-start-here"><span>Recommended start</span><h2>Begin with the graph, not the folder tree.</h2><p>A monorepo succeeds when boundaries and tasks are explicit. The first chapter separates repository strategy from application architecture.</p><Link href="/docs/monorepo/mental-model">Start chapter one <ArrowRight /></Link></section>
  <footer className="docs-sources"><span>Resources</span><h2>Primary references</h2><div>{docs.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}</a>)}</div><small>Examples are tool-neutral, with official workspace and build-system references for implementation. · {seo.siteName}</small></footer>
</article></>; }
