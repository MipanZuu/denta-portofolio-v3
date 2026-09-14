import type { Metadata } from "next";
import { Experience } from "@/components/sections/experience";

export const metadata: Metadata = { title: "Experience — Denta Bramasta", description: "Professional experience and education of full-stack developer Denta Bramasta." };

export default function ExperiencePage() { return <main className="route-page"><Experience /></main>; }
