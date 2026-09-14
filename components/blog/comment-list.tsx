import type { BlogComment } from "@/db/schema";
import { formatBlogDate, initials } from "@/lib/blog/presentation";

export function CommentList({ comments }: { comments: BlogComment[] }) {
  if (!comments.length) return <p className="blog-no-comments">No comments yet. Start the conversation.</p>;
  return <div className="blog-comments-list">{comments.map((comment) => <article key={comment.id}><span className="comment-avatar">{initials(comment.authorName)}</span><div><p><strong>{comment.authorName}</strong> {comment.content}</p><time dateTime={comment.createdAt.toISOString()}>{formatBlogDate(comment.createdAt)}</time></div></article>)}</div>;
}
