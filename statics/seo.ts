import type { Metadata } from "next";
import { contact } from "@/statics/contact";
import { education } from "@/statics/education";
import { personal } from "@/statics/personal";
import { projects } from "@/statics/projects";
import { technologyGroups } from "@/statics/technologies";

const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = (
  process.env.SITE_URL ??
  (deploymentHost
    ? `https://${deploymentHost}`
    : "https://www.dentabramasta.com")
).replace(/\/$/, "");

export const seo = {
  siteName: "Denta Bramasta — Portfolio",
  siteUrl,
  title: "Denta Bramasta Hidayat | Portfolio",
  description:
    "Portfolio of Denta Bramasta Hidayat, a software engineer building thoughtful digital products, web applications, and tools. Explore my projects, experience, writing, and experiments.",
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
    "Software Engineer",
    "Full-stack Developer",
    "Software Engineer Netherlands",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Software Engineer Portfolio",
  ],
  logo: "/images/logo.png",
  defaultOgImage: "/og/default.jpg",
} as const;

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
  image?: string,
): Metadata {
  const socialTitle = `${title} — Denta | Portfolio`;
  const socialImage = image ?? seo.defaultOgImage;

  return {
    title,
    description,

    alternates: {
      canonical: path,
    },

    openGraph: {
      type: "website",
      title: socialTitle,
      description,
      url: path,
      siteName: seo.siteName,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: socialTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export function createWebPageJsonLd(
  name: string,
  description: string,
  path: string,
  type = "WebPage",
) {
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
  knowsAbout: technologyGroups.flatMap((group) =>
    group.items.map((item) => item.name),
  ),
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
