import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Boxes } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Technical documentation and practical learning guides by Denta Bramasta, beginning with a structured Next.js App Router course.";
export const metadata: Metadata = createPageMetadata("Developer Documentation", description, "/docs");

export default function DocsPage() {
  return <main className="route-page docs-library-page">
    <JsonLd data={createWebPageJsonLd("Developer Documentation", description, "/docs", "CollectionPage")} />
    <section className="docs-library">
      <header><span>07 / Documentation</span><h1>Learn the system,<br />not the spell.</h1><p>Practical guides that move from first principles to production decisions. Pick a subject and follow the chapters in order, or jump directly to what you need.</p></header>
      <div className="docs-library-grid">
        <Link className="docs-library-card is-featured" href="/docs/nextjs">
          <div className="docs-library-icon"><BookOpen /></div>
          <span>Web framework / 12 chapters</span>
          <h2>Next.js App Router</h2>
          <p>Routing, rendering, data, caching, security, SEO, testing, and production architecture from beginner to advanced.</p>
          <strong>Open guide <ArrowUpRight /></strong>
        </Link>
        <article className="docs-library-card is-planned">
          <div className="docs-library-icon"><Boxes /></div>
          <span>More guides / In orbit</span>
          <h2>The library will grow.</h2>
          <p>The structure is ready for React, TypeScript, system design, and the engineering notes that deserve more than a short blog post.</p>
          <strong>Planned collection</strong>
        </article>
      </div>
    </section>
  </main>;
}
