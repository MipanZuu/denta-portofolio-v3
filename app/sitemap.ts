import type { MetadataRoute } from "next";
import { getBlogMedia } from "@/lib/blog/presentation";
import { listPublishedBlogPagesForSitemap } from "@/lib/blog/queries";
import { seo } from "@/statics/seo";

export const dynamic = "force-dynamic";

const routes = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/experience", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/technologies", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/space", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedBlogPagesForSitemap();
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${seo.siteUrl}${route.path}`,
    lastModified: new Date("2026-09-14"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
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
