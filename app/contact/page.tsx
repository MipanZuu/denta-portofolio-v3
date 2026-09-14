import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Contact Denta Bramasta about software engineering, full-stack development, and product collaborations.";
export const metadata: Metadata = createPageMetadata("Contact", description, "/contact");

export default function ContactPage() { return <main className="route-page"><JsonLd data={createWebPageJsonLd("Contact Denta Bramasta", description, "/contact", "ContactPage")} /><Contact /></main>; }
