import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogAuthor } from "@/components/blog/blog-author";
import { BlogMedia } from "@/components/blog/blog-media";
import { CommentForm } from "@/components/blog/comment-form";
import { CommentIcon } from "@/components/blog/blog-icons";
import { CommentList } from "@/components/blog/comment-list";
import { LikeButton } from "@/components/blog/like-button";
import { ShareButton } from "@/components/blog/share-button";
import { JsonLd } from "@/components/seo/json-ld";
import { getBlogComments, getBlogEngagement, getPublishedBlogPageBySlug } from "@/lib/blog/queries";
import { formatBlogDate, getBlogMedia, parseBlogTags } from "@/lib/blog/presentation";
import { readVisitorId } from "@/lib/blog/visitor";
import { personal } from "@/statics/personal";
import { seo } from "@/statics/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/blog/[blogSlug]">): Promise<Metadata> {
  const { blogSlug } = await params;
  const post = await getPublishedBlogPageBySlug(blogSlug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: false } };
  const path = `/blog/${post.slug}`;
  const image = post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.title }] : [];
  const tags = parseBlogTags(post.tags);
  return {
    title: post.seoMetaTitle,
    description: post.seoMetaDescription,
    keywords: tags,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title: post.seoMetaTitle, description: post.seoMetaDescription, publishedTime: post.publishedAt?.toISOString(), modifiedTime: post.updatedAt.toISOString(), authors: [personal.fullName], images: image },
    twitter: { card: "summary_large_image", title: post.seoMetaTitle, description: post.seoMetaDescription, images: image.map((item) => item.url) },
  };
}

function ContentBlock({ content }: { content: string }) {
  return <>{content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>;
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[blogSlug]">) {
  const { blogSlug } = await params;
  const post = await getPublishedBlogPageBySlug(blogSlug);
  if (!post) notFound();

  const visitorId = await readVisitorId();
  const [comments, engagement] = await Promise.all([getBlogComments(post.id), getBlogEngagement(post.id, visitorId)]);
  const gallery = getBlogMedia(post.coverImageUrl, post.images);
  const tags = parseBlogTags(post.tags);
  const media = gallery[0] ?? null;
  const articleUrl = `${seo.siteUrl}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoMetaDescription,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    image: media ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    keywords: tags,
    author: { "@id": `${seo.siteUrl}/#person`, "@type": "Person", name: personal.fullName },
  };

  return <main className="blog-detail-page page-shell">
    <JsonLd data={articleJsonLd} />
    <Link className="blog-back-link" href="/blog">← Back to field notes</Link>
    <article className="blog-detail-card">
      <header><BlogAuthor date={formatBlogDate(post.publishedAt)} /><span className="blog-card-more" aria-hidden="true">•••</span></header>
      <BlogMedia images={gallery} alt={post.title} priority />
      <div className="blog-detail-actions"><LikeButton blogPageId={post.id} slug={post.slug} initialCount={engagement.likeCount} initialLiked={engagement.liked} /><a className="blog-action" href="#comments" aria-label={`${engagement.commentCount} comments`}><CommentIcon /><span>{engagement.commentCount.toLocaleString()}</span></a><ShareButton path={`/blog/${post.slug}`} title={post.title} /></div>
      <div className="blog-detail-intro" id="article"><p className="eyebrow">{formatBlogDate(post.publishedAt)} · Field note</p><h1>{post.title}</h1><p>{post.excerpt}</p>{tags.length ? <div className="blog-tags" aria-label="Article tags">{tags.map((tag) => <span key={tag}>#{tag}</span>)}</div> : null}</div>
      <div className="blog-article-content"><ContentBlock content={post.content} />{post.secondaryContent ? <section><ContentBlock content={post.secondaryContent} /></section> : null}{post.thirdContent ? <section><ContentBlock content={post.thirdContent} /></section> : null}</div>
      <section className="blog-comments" id="comments"><div className="blog-comments-heading"><div><p className="eyebrow">Conversation</p><h2>{engagement.commentCount ? `${engagement.commentCount} ${engagement.commentCount === 1 ? "comment" : "comments"}` : "Join the conversation"}</h2></div><span>Login-free</span></div><CommentList comments={comments} /><CommentForm blogPageId={post.id} slug={post.slug} /></section>
    </article>
  </main>;
}
