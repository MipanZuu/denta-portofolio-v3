import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import docsContent from "@/statics/docs.json";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

export const metadata: Metadata = createPageMetadata(
  docsContent.meta.title,
  docsContent.meta.description,
  docsContent.meta.path,
);

export default function DocsPage() {
  return (
    <main className="route-page docs-page">
      <JsonLd
        data={createWebPageJsonLd(
          "Denta Bramasta portfolio documentation",
          docsContent.meta.description,
          docsContent.meta.path,
          "CollectionPage",
        )}
      />
      <section className="section docs-section">
        <div className="page-shell">
          <SectionHeading {...docsContent.heading} />

          <div className="docs-layout">
            <aside className="docs-intro">
              <span>{docsContent.intro.version}</span>
              <strong>{docsContent.intro.title}</strong>
              {docsContent.intro.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <nav className="docs-toc" aria-label="Documentation contents">
                <span>{docsContent.intro.contentsLabel}</span>
                {docsContent.sections.map((section) => (
                  <a href={`#${section.id}`} key={section.id}>
                    <small>{section.number}</small>
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="docs-groups">
              {docsContent.sections.map((section) => (
                <article className="docs-panel" id={section.id} key={section.id}>
                  <header>
                    <span>{section.number}</span>
                    <div>
                      <small>{section.eyebrow}</small>
                      <h2>{section.title}</h2>
                      <p>{section.summary}</p>
                    </div>
                  </header>

                  <div className="docs-panel-body">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  <aside className="docs-callout">
                    <span>{section.callout.label}</span>
                    <p>{section.callout.text}</p>
                  </aside>

                  <div className="docs-link-list">
                    {section.links.map((link) => (
                      <Link className="docs-link" href={link.href} key={link.href}>
                        <span>
                          <strong>{link.label}</strong>
                          <small>{link.note}</small>
                        </span>
                        <b aria-hidden="true"><ArrowUpRight /></b>
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
