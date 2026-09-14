import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = { title: "Contact — Denta Bramasta", description: "Contact Denta Bramasta about full-stack development, frontend work, and product collaborations." };

export default function ContactPage() { return <main className="route-page"><Contact /></main>; }
