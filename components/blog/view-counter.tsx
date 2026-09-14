"use client";

import { useEffect, useRef, useState } from "react";
import { registerBlogViewAction } from "@/app/blog/actions";
import { formatCompactCount } from "@/lib/blog/presentation";
import { EyeIcon } from "./blog-icons";

type ViewCounterProps = {
  blogPageId: string;
  slug: string;
  initialCount: number;
  track?: boolean;
};

export function ViewCounter({ blogPageId, slug, initialCount, track = false }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);
  const registered = useRef(false);

  useEffect(() => {
    if (!track || registered.current) return;
    registered.current = true;
    void registerBlogViewAction(blogPageId, slug)
      .then((result) => setCount(result.count))
      .catch(() => { registered.current = false; });
  }, [blogPageId, slug, track]);

  return <span className="blog-view-count" aria-label={`${count.toLocaleString("en")} views`} title={`${count.toLocaleString("en")} views`}>
    <EyeIcon />
    <span>{formatCompactCount(count)}</span>
  </span>;
}
