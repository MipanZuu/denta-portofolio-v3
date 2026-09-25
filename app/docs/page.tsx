import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Boxes, Network } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Detailed technical learning guides about Next.js, microservices architecture, monorepos, and production engineering by Denta Bramasta.";
export const metadata: Metadata = createPageMetadata("Developer Documentation", description, "/docs");

export default function DocsPage() {
  return <main className="route-page docs-library-page">
    <JsonLd data={createWebPageJsonLd("Developer Documentation", description, "/docs", "CollectionPage")} />
    <section className="docs-library">
      <header><span>07 / Documentation</span><h1>Learn the system,<br />not the spell.</h1><p>Practical guides that move from first principles to production decisions. Pick a subject and follow the chapters in order, or jump directly to what you need.</p></header>
      <div className="docs-library-grid">
        <Link className="docs-library-card is-featured" href="/docs/nextjs">
          <div className="docs-library-icon"><BookOpen /></div>
          <span>Web framework / 29 chapters</span>
          <h2>Next.js App Router</h2>
          <p>Routing, rendering, data, caching, security, SEO, testing, and production architecture from beginner to advanced.</p>
          <strong>Open guide <ArrowUpRight /></strong>
        </Link>
        <Link className="docs-library-card" href="/docs/microservices">
          <div className="docs-library-icon"><Network /></div>
          <span>Architecture / 6 chapters</span>
          <h2>Microservices</h2>
          <p>Boundaries, communication, data ownership, reliability, observability, security, and production operations.</p>
          <strong>Open guide <ArrowUpRight /></strong>
        </Link>
        <Link className="docs-library-card" href="/docs/monorepo">
          <div className="docs-library-icon"><Boxes /></div>
          <span>Repository systems / 6 chapters</span>
          <h2>Monorepos</h2>
          <p>Workspace design, dependency graphs, caching, CI, testing, versioning, ownership, and migrations.</p>
          <strong>Open guide <ArrowUpRight /></strong>
        </Link>
      </div>
    </section>
  </main>;
}
