import type { Metadata } from "next";
import { BlogFeedCard } from "@/components/blog/blog-feed-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getLikedBlogPageIds, listPublishedBlogPages } from "@/lib/blog/queries";
import { readVisitorId } from "@/lib/blog/visitor";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata("Blog", "Field notes by Denta Bramasta about software engineering, product thinking, and building thoughtful digital experiences.", "/blog");

export default async function BlogPage() {
  const [posts, visitorId] = await Promise.all([listPublishedBlogPages(), readVisitorId()]);
  const likedIds = await getLikedBlogPageIds(visitorId, posts.map((post) => post.id));

  return <main className="blog-page page-shell">
    <JsonLd data={createWebPageJsonLd("Denta Bramasta's blog", "Field notes about software engineering, product thinking, and digital experiences.", "/blog", "Blog")} />
    <header className="blog-page-heading"><p className="eyebrow">Field notes · by Denta Bramasta</p><h1>Ideas from the <em>workbench.</em></h1><p>What I learn while designing, building, and refining digital products.</p></header>
    {posts.length ? <section className="blog-feed" aria-label="Published articles">{posts.map((post, index) => <BlogFeedCard key={post.id} post={post} liked={likedIds.has(post.id)} priority={index === 0} />)}</section> : <section className="blog-empty-state"><span>✦</span><h2>The first story is taking shape.</h2><p>Published notes will appear here soon.</p></section>}
  </main>;
}
