import type { Metadata } from "next";
import { Toolkit } from "@/components/sections/toolkit";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Languages, frameworks, platforms, and engineering tools used by Software Engineer Denta Bramasta.";
export const metadata: Metadata = createPageMetadata("Technologies", description, "/technologies");

export default function TechnologiesPage() { return <main className="route-page"><JsonLd data={createWebPageJsonLd("Technology toolkit of Denta Bramasta", description, "/technologies", "CollectionPage")} /><Toolkit /></main>; }
