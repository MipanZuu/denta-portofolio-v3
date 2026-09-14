import type { Metadata } from "next";
import { Toolkit } from "@/components/sections/toolkit";

export const metadata: Metadata = { title: "Technologies — Denta Bramasta", description: "Languages, frameworks, platforms, and tools used by Denta Bramasta." };

export default function TechnologiesPage() { return <main className="route-page"><Toolkit /></main>; }
