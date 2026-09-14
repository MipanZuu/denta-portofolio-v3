import type { MetadataRoute } from "next";
import { seo } from "@/statics/seo";

export const dynamic = "force-static";

const routes = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/experience", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/technologies", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `${seo.siteUrl}${route.path}`, lastModified: new Date("2026-09-14"), changeFrequency: route.changeFrequency, priority: route.priority }));
}
