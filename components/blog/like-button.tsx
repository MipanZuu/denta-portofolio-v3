"use client";

import { useState, useTransition } from "react";
import { toggleBlogLikeAction } from "@/app/blog/actions";
import { HeartIcon } from "./blog-icons";

export function LikeButton({ blogPageId, slug, initialCount, initialLiked }: { blogPageId: string; slug: string; initialCount: number; initialLiked: boolean }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const toggle = () => startTransition(async () => {
    const result = await toggleBlogLikeAction(blogPageId, slug);
    setLiked(result.liked);
    setCount(result.count);
  });

  return <button className={`blog-action ${liked ? "is-liked" : ""}`} type="button" onClick={toggle} disabled={pending} aria-pressed={liked} aria-label={liked ? "Unlike this article" : "Like this article"}><HeartIcon filled={liked} /><span>{count.toLocaleString()}</span></button>;
}
