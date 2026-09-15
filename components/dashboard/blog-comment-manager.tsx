import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import { deleteBlogCommentAction } from "@/app/dashboard/actions";
import type { BlogComment } from "@/db/schema";
import { formatBlogDate, initials } from "@/lib/blog/presentation";

type BlogCommentManagerProps = {
  blogPageId: string;
  comments: BlogComment[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function BlogCommentManager({ blogPageId, comments, count, page, pageSize, totalPages }: BlogCommentManagerProps) {
  const firstComment = count ? (page - 1) * pageSize + 1 : 0;
  const lastComment = Math.min(page * pageSize, count);
  const pageHref = (targetPage: number) => `/dashboard/blog/${blogPageId}/edit?commentPage=${targetPage}#dashboard-comments`;

  return (
    <section className="editor-card dashboard-comment-manager" id="dashboard-comments" aria-labelledby="dashboard-comments-title">
      <div className="editor-card-heading dashboard-comment-heading">
        <span>05</span>
        <div>
          <h2 id="dashboard-comments-title">Comments</h2>
          <p>Review the conversation and remove comments that should not remain public.</p>
        </div>
        <strong>{count}</strong>
      </div>

      {comments.length ? (
        <div className="dashboard-comment-list">
          {comments.map((comment) => (
            <article className="dashboard-comment" key={comment.id}>
              <span className="comment-avatar" aria-hidden="true">{initials(comment.authorName)}</span>
              <div className="dashboard-comment-copy">
                <div>
                  <strong>{comment.authorName}</strong>
                  <time dateTime={comment.createdAt.toISOString()}>{formatBlogDate(comment.createdAt)}</time>
                </div>
                <p>{comment.content}</p>
              </div>
              <form action={deleteBlogCommentAction.bind(null, blogPageId, comment.id)}>
                <button className="dashboard-comment-delete" type="submit" aria-label={`Delete comment from ${comment.authorName}`}>
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <div className="dashboard-comments-empty">
          <span><CircleCheck aria-hidden="true" /></span>
          <div>
            <strong>No comments yet</strong>
            <p>New comments on this post will appear here.</p>
          </div>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="dashboard-comment-pagination" aria-label="Comment pages">
          {page > 1 ? <Link href={pageHref(page - 1)}><ArrowLeft aria-hidden="true" /> Previous</Link> : <span aria-disabled="true"><ArrowLeft aria-hidden="true" /> Previous</span>}
          <p>Showing {firstComment}–{lastComment} of {count} · Page {page} of {totalPages}</p>
          {page < totalPages ? <Link href={pageHref(page + 1)}>Next <ArrowRight aria-hidden="true" /></Link> : <span aria-disabled="true">Next <ArrowRight aria-hidden="true" /></span>}
        </nav>
      ) : null}
    </section>
  );
}
