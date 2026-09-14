import Link from "next/link";
import { CommentIcon } from "./blog-icons";
import { BlogAuthor } from "./blog-author";
import { BlogMedia } from "./blog-media";
import { LikeButton } from "./like-button";
import { ShareButton } from "./share-button";
import { ViewCounter } from "./view-counter";
import { formatBlogDate, getBlogMedia, parseBlogTags } from "@/lib/blog/presentation";

type FeedPost = {
  id: string; title: string; slug: string; excerpt: string; coverImageUrl: string | null; images: string; tags: string; publishedAt: Date | null; likeCount: number; commentCount: number; viewCount: number;
};

export function BlogFeedCard({ post, liked, priority }: { post: FeedPost; liked: boolean; priority?: boolean }) {
  const media = getBlogMedia(post.coverImageUrl, post.images);
  const tags = parseBlogTags(post.tags);
  return <article className="blog-feed-card">
    <header><BlogAuthor date={formatBlogDate(post.publishedAt)} /><span className="blog-card-more" aria-hidden="true">•••</span></header>
    <BlogMedia images={media} alt={post.title} priority={priority} href={`/blog/${post.slug}`} />
    <div className="blog-card-body"><div className="blog-actions"><LikeButton blogPageId={post.id} slug={post.slug} initialCount={post.likeCount} initialLiked={liked} /><Link className="blog-action" href={`/blog/${post.slug}#comments`} aria-label={`${post.commentCount} comments`}><CommentIcon /><span>{post.commentCount.toLocaleString()}</span></Link><ShareButton path={`/blog/${post.slug}`} title={post.title} /><ViewCounter blogPageId={post.id} slug={post.slug} initialCount={post.viewCount} /></div>
    <Link className="blog-caption" href={`/blog/${post.slug}`}><strong>{post.title}</strong><span>{post.excerpt}</span></Link>{tags.length ? <div className="blog-tags" aria-label="Article tags">{tags.map((tag) => <span key={tag}>#{tag}</span>)}</div> : null}<Link className="blog-view-comments" href={`/blog/${post.slug}#comments`}>{post.commentCount ? `View ${post.commentCount} ${post.commentCount === 1 ? "comment" : "comments"}` : "Be the first to comment"}</Link></div>
  </article>;
}
