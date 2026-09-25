import type { MetadataRoute } from "next";
import { getBlogMedia } from "@/lib/blog/presentation";
import { listPublishedBlogPagesForSitemap } from "@/lib/blog/queries";
import { seo } from "@/statics/seo";
import { projects } from "@/statics/projects";
import { playgroundItems } from "@/statics/playground";
import docs from "@/statics/docs-next.json";
import microservicesDocs from "@/statics/docs-microservices.json";
import monorepoDocs from "@/statics/docs-monorepo.json";

export const dynamic = "force-dynamic";

const routes = [
  { path: "", priority: 1, changeFrequency: "monthly" as const, images: ["/images/profile.jpg"] },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/journey", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/experience", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" as const, images: projects.flatMap((project) => project.image ? [project.image] : []) },
  { path: "/technologies", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/docs", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-09-20" },
  { path: "/docs/nextjs", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-09-20" },
  ...docs.sections.map((section) => ({ path: `/docs/nextjs/${section.id}`, priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-09-20" })),
  { path: "/docs/microservices", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-09-25" },
  ...microservicesDocs.sections.map((section) => ({ path: `/docs/microservices/${section.id}`, priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-09-25" })),
  { path: "/docs/monorepo", priority: 0.8, changeFrequency: "monthly" as const, lastModified: "2026-09-25" },
  ...monorepoDocs.sections.map((section) => ({ path: `/docs/monorepo/${section.id}`, priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-09-25" })),
  { path: "/playground", priority: 0.7, changeFrequency: "monthly" as const },
  ...playgroundItems.map((item) => ({ path: item.href, priority: 0.6, changeFrequency: "monthly" as const })),
  { path: "/space", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof listPublishedBlogPagesForSitemap>> = [];
  try {
    posts = await listPublishedBlogPagesForSitemap();
  } catch (error) {
    console.error("Unable to add blog posts to sitemap", error);
  }
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${seo.siteUrl}${route.path}`,
    lastModified: new Date(("lastModified" in route && route.lastModified) || "2026-09-16"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    images: "images" in route
      ? route.images?.map((image) => new URL(image, seo.siteUrl).toString())
      : undefined,
  }));
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${seo.siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
    images: getBlogMedia(post.coverImageUrl, post.images),
  }));

  return [...staticPages, ...blogPosts];
}
