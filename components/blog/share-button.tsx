"use client";

import { useEffect, useRef, useState } from "react";
import { SendIcon } from "./blog-icons";

export function ShareButton({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  async function copyPostLink() {
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1800);
  }

  return <button className="blog-action blog-send-action blog-share-action" type="button" onClick={copyPostLink} aria-label={`Copy link to ${title}`}>
    <SendIcon />
    <span className="blog-share-feedback" role="status" aria-live="polite">{copied ? "Link copied" : ""}</span>
  </button>;
}
