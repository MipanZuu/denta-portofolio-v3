import type { Metadata } from "next";
import { Projects } from "@/components/sections/projects";

export const metadata: Metadata = { title: "Projects — Denta Bramasta", description: "Selected full-stack, frontend, and university projects by Denta Bramasta." };

export default function ProjectsPage() { return <main className="route-page route-page-dark"><Projects /></main>; }
