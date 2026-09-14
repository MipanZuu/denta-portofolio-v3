"use client";

import { useActionState, useEffect, useRef } from "react";
import { createBlogCommentAction } from "@/app/blog/actions";
import { SendIcon } from "./blog-icons";

export function CommentForm({ blogPageId, slug }: { blogPageId: string; slug: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = createBlogCommentAction.bind(null, blogPageId, slug);
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success]);

  return <form ref={formRef} className="blog-comment-form" action={formAction}>
    <div className="comment-fields"><label><span>Your name</span><input name="authorName" minLength={2} maxLength={50} autoComplete="name" required placeholder="Name" /></label><label className="comment-message"><span>Comment</span><textarea name="content" maxLength={1000} rows={2} required placeholder="Add to the conversation…" /></label></div>
    <label className="comment-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button type="submit" disabled={pending}>{pending ? "Posting…" : <><SendIcon />Post</>}</button>
    {state.error ? <p className="comment-feedback is-error" role="alert">{state.error}</p> : null}
    {state.success ? <p className="comment-feedback" role="status">Your comment is live.</p> : null}
  </form>;
}
