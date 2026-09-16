import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd, projectsJsonLd } from "@/statics/seo";

const description = "Selected full-stack, frontend, and product engineering projects by Denta Bramasta.";
export const metadata: Metadata = createPageMetadata("Projects", description, "/projects");

export default function ProjectsPage() { return <main className="route-page theme-orbit-page theme-orbit-projects"><JsonLd data={[createWebPageJsonLd("Projects by Denta Bramasta", description, "/projects", "CollectionPage"), projectsJsonLd]} /><Projects /></main>; }
