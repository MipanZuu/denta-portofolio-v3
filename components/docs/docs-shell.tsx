"use client";

import { BookOpen, ChevronRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Group = { label: string; items: Array<{ id: string; title: string }> };

export function DocsShell({ groups, children }: { groups: Group[]; children: ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return groups;
    return groups.map((group) => ({ ...group, items: group.items.filter((item) => item.title.toLowerCase().includes(value)) })).filter((group) => group.items.length);
  }, [groups, query]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => {
    return () => document.body.classList.remove("docs-reading-mode");
  }, []);

  function toggleReadingMode() {
    const next = !readingMode;
    setReadingMode(next);
    setOpen(false);
    document.body.classList.toggle("docs-reading-mode", next);
  }

  return (
    <div className="docs-route-shell">
      <button className="docs-reading-toggle" type="button" onClick={toggleReadingMode} aria-pressed={readingMode}>
        {readingMode ? <X /> : <BookOpen />}
        <span>{readingMode ? "Exit reading mode" : "Reading mode"}</span>
      </button>
      <button className="docs-mobile-trigger" type="button" onClick={() => setOpen(true)}><Menu /> Browse guide</button>
      <aside className={`docs-route-sidebar ${open ? "is-open" : ""}`}>
        <div className="docs-sidebar-heading">
          <Link href="/docs"><span>MZ / DOCS</span><strong>Documentation home</strong></Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close documentation navigation"><X /></button>
        </div>
        <Link className={pathname === "/docs/nextjs" ? "docs-guide-home is-active" : "docs-guide-home"} href="/docs/nextjs" onClick={() => setOpen(false)}>
          <BookOpen /><span><strong>Next.js guide</strong><small>Beginner to advanced</small></span><ChevronRight />
        </Link>
        <label className="docs-search"><Search /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chapters" /><kbd>⌘K</kbd></label>
        <nav aria-label="Next.js guide chapters">
          {filtered.map((group) => (
            <div className="docs-nav-group" key={group.label}>
              <span>{group.label}</span>
              {group.items.map((item) => {
                const href = `/docs/nextjs/${item.id}`;
                return <Link className={pathname === href ? "is-active" : ""} href={href} key={item.id} onClick={() => setOpen(false)}>{item.title}<ChevronRight /></Link>;
              })}
            </div>
          ))}
          {!filtered.length && <p className="docs-no-results">No chapter found.</p>}
        </nav>
      </aside>
      {open && <button className="docs-nav-scrim" onClick={() => setOpen(false)} aria-label="Close documentation navigation" />}
      <div className="docs-route-content">{children}</div>
    </div>
  );
}
