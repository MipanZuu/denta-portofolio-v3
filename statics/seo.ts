import type { Metadata } from "next";
import { contact } from "@/statics/contact";
import { education } from "@/statics/education";
import { personal } from "@/statics/personal";
import { projects } from "@/statics/projects";
import { technologyGroups } from "@/statics/technologies";

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = (process.env.SITE_URL ?? (deploymentHost ? `https://${deploymentHost}` : "https://denta-bramasta-portfolio.dingus2129.chatgpt.site")).replace(/\/$/, "");

export const seo = {
  siteName: "Denta Bramasta — Portfolio",
  siteUrl,
  title: "Denta Bramasta — Software Engineer",
  description:
    "Portfolio of Denta Bramasta Hidayat, a Software Engineer at ParkMundo building scalable multilingual products with Next.js, React, TypeScript, GraphQL, and Express.",
  keywords: [
    "Denta Bramasta",
    "Denta Bramasta Hidayat",
    "Software Engineer Eindhoven",
    "Full-stack Developer Netherlands",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "ParkMundo Software Engineer",
    "Indonesian Software Engineer Netherlands",
    "Web Developer Portfolio",
  ],
} as const;

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  const socialTitle = `${title} — Denta Bramasta`;
  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: { canonical: path },
    openGraph: { title: socialTitle, description, url: path },
    twitter: { title: socialTitle, description },
  };
}

export function createWebPageJsonLd(name: string, description: string, path: string, type = "WebPage") {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${seo.siteUrl}${path}/#webpage`,
    url: `${seo.siteUrl}${path}`,
    name,
    description,
    isPartOf: { "@id": `${seo.siteUrl}/#website` },
    about: { "@id": `${seo.siteUrl}/#person` },
    inLanguage: "en",
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${seo.siteUrl}/#website`,
  url: seo.siteUrl,
  name: seo.siteName,
  description: seo.description,
  inLanguage: "en",
  author: { "@id": `${seo.siteUrl}/#person` },
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${seo.siteUrl}/#person`,
  name: personal.fullName,
  alternateName: personal.name,
  url: seo.siteUrl,
  image: `${seo.siteUrl}${personal.portrait}`,
  email: `mailto:${contact.email}`,
  jobTitle: "Software Engineer",
  description: personal.about,
  homeLocation: { "@type": "Place", name: "Eindhoven, Netherlands" },
  worksFor: {
    "@type": "Organization",
    name: personal.currentCompany.name,
    url: personal.currentCompany.url,
  },
  alumniOf: education.slice(0, 2).map((item) => ({
    "@type": "CollegeOrUniversity",
    name: item.school,
    address: item.location,
  })),
  knowsAbout: technologyGroups.flatMap((group) => group.items.map((item) => item.name)),
  sameAs: contact.socials.map((social) => social.href),
};

export const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Selected projects by Denta Bramasta",
  numberOfItems: projects.length,
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      ...(project.image ? { image: `${seo.siteUrl}${project.image}` } : {}),
      url: project.preview ?? project.source ?? `${seo.siteUrl}/projects`,
      creator: { "@id": `${seo.siteUrl}/#person` },
      keywords: project.stack.join(", "),
    },
  })),
};
