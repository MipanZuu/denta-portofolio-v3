import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Learn about Denta Bramasta's background, education, interests, and approach to building digital products.";
export const metadata: Metadata = createPageMetadata("About", description, "/about");

export default function AboutPage() { return <main className="route-page"><JsonLd data={createWebPageJsonLd("About Denta Bramasta", description, "/about", "ProfilePage")} /><About /></main>; }
