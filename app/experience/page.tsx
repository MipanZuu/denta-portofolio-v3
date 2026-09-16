import type { Metadata } from "next";
import { Experience } from "@/components/sections/experience";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Professional experience and education of software engineer and creative technologist Denta Bramasta.";
export const metadata: Metadata = createPageMetadata("Experience", description, "/experience");

export default function ExperiencePage() { return <main className="route-page theme-orbit-page theme-orbit-experience"><JsonLd data={createWebPageJsonLd("Experience of Denta Bramasta", description, "/experience", "ProfilePage")} /><Experience /></main>; }
