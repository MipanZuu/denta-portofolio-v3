import type { Metadata } from "next";
import { ArrowRight, BookOpen, Cable, Database, Radar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import docs from "@/statics/docs-microservices.json";
import { createPageMetadata, createWebPageJsonLd, seo } from "@/statics/seo";

export const metadata: Metadata = { ...createPageMetadata(docs.meta.title, docs.meta.description, "/docs/microservices"), keywords: docs.meta.keywords };
const steps = [
  { icon: BookOpen, label: "Model", copy: "Understand the trade-off and locate durable business boundaries.", id: "mental-model" },
  { icon: Cable, label: "Connect", copy: "Choose synchronous and asynchronous contracts deliberately.", id: "communication" },
  { icon: Database, label: "Own data", copy: "Design authority, consistency, workflows, and migrations.", id: "data-consistency" },
  { icon: ShieldCheck, label: "Survive", copy: "Contain failures with deadlines, isolation, and recovery.", id: "reliability" },
  { icon: Radar, label: "Operate", copy: "Observe, secure, deploy, and own production services.", id: "operations" }
];

export default function MicroservicesGuidePage() {
  return <><JsonLd data={createWebPageJsonLd(docs.meta.title, docs.meta.description, "/docs/microservices", "TechArticle")} /><article className="docs-guide-intro">
    <header className="docs-route-hero"><span>{docs.hero.eyebrow}</span><h1>{docs.hero.title}</h1><p>{docs.hero.description}</p><div><small>{docs.hero.updated}</small><small>{docs.hero.readingTime}</small></div></header>
    <section className="docs-intro-callout"><strong>What you will be able to decide</strong><p>Whether services are justified, where their boundaries belong, which communication pattern fits a workflow, how data becomes consistent, and what production safeguards each service needs.</p></section>
    <section className="docs-learning-path"><span>Learning path</span><h2>From boundary to production.</h2>{steps.map((step, index) => { const Icon = step.icon; return <div className="docs-learning-step" key={step.id}><b>{String(index + 1).padStart(2, "0")}</b><Icon /><div><h3>{step.label}</h3><p>{step.copy}</p></div><Link href={`/docs/microservices/${step.id}`} aria-label={`Start ${step.label}`}><ArrowRight /></Link></div>; })}</section>
    <section className="docs-start-here"><span>Recommended start</span><h2>Begin with the architecture’s real cost.</h2><p>Learn why service independence—not service count—is the goal, and why a modular monolith remains a strong default.</p><Link href="/docs/microservices/mental-model">Start chapter one <ArrowRight /></Link></section>
    <footer className="docs-sources"><span>Resources</span><h2>Primary references</h2><div>{docs.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}</a>)}</div><small>Built from established distributed-systems guidance and practical production patterns. · {seo.siteName}</small></footer>
  </article></>;
}
