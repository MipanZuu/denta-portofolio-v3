import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { BlogFeedCard } from "@/components/blog/blog-feed-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getLikedBlogPageIds,
  listPublishedBlogPages,
} from "@/lib/blog/queries";
import { readVisitorId } from "@/lib/blog/visitor";
import { getBlogMedia } from "@/lib/blog/presentation";
import { personal } from "@/statics/personal";
import { createPageMetadata, createWebPageJsonLd, seo } from "@/statics/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata(
  "Blog",
  "Field notes by Denta Bramasta about software engineering, product thinking, and building thoughtful digital experiences.",
  "/blog",
);

export default async function BlogPage() {
  const [posts, visitorId] = await Promise.all([
    listPublishedBlogPages(),
    readVisitorId(),
  ]);
  const likedIds = await getLikedBlogPageIds(
    visitorId,
    posts.map((post) => post.id),
  );
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${seo.siteUrl}/blog/#blog`,
    url: `${seo.siteUrl}/blog`,
    name: "Denta Bramasta's blog",
    description: "Field notes about software engineering, product thinking, and digital experiences.",
    author: { "@id": `${seo.siteUrl}/#person`, "@type": "Person", name: personal.fullName },
    blogPost: posts.map((post) => {
      const image = getBlogMedia(post.coverImageUrl, post.images)[0];
      return {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: `${seo.siteUrl}/blog/${post.slug}`,
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.publishedAt?.toISOString(),
        ...(image ? { image: new URL(image, seo.siteUrl).toString() } : {}),
        author: { "@id": `${seo.siteUrl}/#person` },
      };
    }),
  };

  return (
    <main className="blog-page page-shell">
      <JsonLd
        data={[createWebPageJsonLd(
          "Denta Bramasta's blog",
          "Field notes about software engineering, product thinking, and digital experiences.",
          "/blog",
          "Blog",
        ), blogJsonLd]}
      />
      <header className="blog-page-heading">
        <p className="eyebrow">Field notes · by Denta Bramasta</p>
        <h1>
          Ideas from the <em>workbench.</em>
        </h1>
        <p>I got tired of my social media FYP, so I built my own. :D</p>
      </header>
      {posts.length ? (
        <section className="blog-feed" aria-label="Published articles">
          {posts.map((post, index) => (
            <BlogFeedCard
              key={post.id}
              post={post}
              liked={likedIds.has(post.id)}
              priority={index === 0}
            />
          ))}
        </section>
      ) : (
        <section className="blog-empty-state">
          <span>
            <Sparkles aria-hidden="true" />
          </span>
          <h2>The first story is taking shape.</h2>
          <p>Published notes will appear here soon.</p>
        </section>
      )}
    </main>
  );
}
