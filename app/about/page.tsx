import type { Metadata } from "next";
import { About } from "@/components/sections/about";

export const metadata: Metadata = { title: "About — Denta Bramasta", description: "Learn about Denta Bramasta's background, education, interests, and approach to building digital products." };

export default function AboutPage() { return <main className="route-page"><About /></main>; }
