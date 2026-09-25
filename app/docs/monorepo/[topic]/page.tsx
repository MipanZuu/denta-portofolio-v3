import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsArticle } from "@/components/docs/docs-article";
import { JsonLd } from "@/components/seo/json-ld";
import docs from "@/statics/docs-monorepo.json";
import { createBreadcrumbJsonLd, createPageMetadata, seo } from "@/statics/seo";

export function generateStaticParams() { return docs.sections.map((section) => ({ topic: section.id })); }
type TopicPageProps = { params: Promise<{ topic: string }> };
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> { const { topic } = await params; const section = docs.sections.find((item) => item.id === topic); if (!section) return { title: "Documentation chapter not found", robots: { index: false, follow: false } }; return createPageMetadata(`${section.title} – Monorepo Guide`, section.summary, `/docs/monorepo/${section.id}`); }
export default async function MonorepoTopicPage({ params }: TopicPageProps) { const { topic } = await params; const index = docs.sections.findIndex((section) => section.id === topic); if (index < 0) notFound(); const section = docs.sections[index]; const indexes = docs.sourceMap[section.id as keyof typeof docs.sourceMap] ?? [0]; const sources = indexes.map((sourceIndex) => docs.sources[sourceIndex]).filter(Boolean); const path = `/docs/monorepo/${section.id}`; const jsonLd = { "@context": "https://schema.org", "@type": "TechArticle", headline: `${section.title} – Monorepo Guide`, description: section.summary, url: `${seo.siteUrl}${path}`, dateModified: "2026-09-25", author: { "@id": `${seo.siteUrl}/#person` }, proficiencyLevel: "Beginner to advanced", isPartOf: { "@id": `${seo.siteUrl}/docs/monorepo/#guide` }, inLanguage: "en" }; return <><JsonLd data={[jsonLd, createBreadcrumbJsonLd(section.title, path)]} /><DocsArticle section={section} sources={sources} previous={docs.sections[index - 1]} next={docs.sections[index + 1]} guideName="Monorepos" basePath="/docs/monorepo" /></>; }
