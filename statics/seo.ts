import type { Metadata } from "next";
import { contact } from "@/statics/contact";
import { education } from "@/statics/education";
import { personal } from "@/statics/personal";
import { projects } from "@/statics/projects";
import { technologyGroups } from "@/statics/technologies";

const siteUrl = "https://www.dentabramasta.com";

export const seo = {
  siteName: "Denta Bramasta",
  siteUrl,
  title: "Denta Bramasta Hidayat — Software Engineer",
  description:
    "Personal website of Denta Bramasta Hidayat, a software engineer building thoughtful digital products, web applications, and tools. Explore projects, engineering notes, and experiments.",
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
  const socialImage = image ?? seo.defaultOgImage;

  return {
    title: { absolute: title },
    description,

    alternates: {
      canonical: path,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: seo.siteName,
      images: [
        {
          url: socialImage,
          width: 800,
          height: 1200,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
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
  const profileMainEntity = {
    "@type": "Person",
    "@id": `${seo.siteUrl}/#person`,
    name: personal.fullName,
    alternateName: personal.name,
    url: seo.siteUrl,
    image: `${seo.siteUrl}${personal.portrait}`,
    jobTitle: "Software Engineer",
    sameAs: contact.socials.map((social) => social.href),
  };
  const page: Record<string, unknown> = {
    "@type": type,
    "@id": `${seo.siteUrl}${path}/#webpage`,
    url: `${seo.siteUrl}${path}`,
    name,
    description,
    isPartOf: { "@id": `${seo.siteUrl}/#website` },
    about: { "@id": `${seo.siteUrl}/#person` },
    inLanguage: "en",
  };
  if (type === "ProfilePage") {
    page.mainEntity = profileMainEntity;
  }
  if (!path) return { "@context": "https://schema.org", ...page };
  return {
    "@context": "https://schema.org",
    "@graph": [page, createBreadcrumbJsonLd(name, path, false)],
  };
}

function readablePathSegment(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function createBreadcrumbJsonLd(
  name: string,
  path: string,
  includeContext = true,
) {
  const segments = path.split("/").filter(Boolean);
  return {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: seo.siteUrl },
      ...segments.map((segment, index) => {
        const itemPath = `/${segments.slice(0, index + 1).join("/")}`;
        return {
          "@type": "ListItem",
          position: index + 2,
          name:
            index === segments.length - 1 ? name : readablePathSegment(segment),
          item: `${seo.siteUrl}${itemPath}`,
        };
      }),
    ],
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

const { "@context": websiteContext, ...websiteGraphNode } = websiteJsonLd;
const { "@context": personContext, ...personGraphNode } = personJsonLd;

export const rootJsonLd = {
  "@context": websiteContext ?? personContext,
  "@graph": [websiteGraphNode, personGraphNode],
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
