"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, ChevronRight, House, Menu, X } from "lucide-react";
import { playgroundGames, playgroundTools } from "@/statics/playground";

function LinkGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: typeof playgroundGames;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="playground-sidebar-group">
      <h2>{title}</h2>
      <div>
        {items.map((item) => (
          <Link
            className={pathname === item.href ? "is-active" : ""}
            href={item.href}
            key={item.href}
            onClick={onNavigate}
          >
            <span>
              {item.title}
              {item.recommended ? (
                <small
                  className="playground-recommended"
                  title="Recommended"
                  aria-label="Recommended"
                >
                  <BadgeCheck />
                </small>
              ) : null}
            </span>
            <span className="playground-sidebar-arrow" aria-hidden="true"><ChevronRight /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PlaygroundSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className={`playground-sidebar-slot ${open ? "is-open" : ""}`}>
      <button
        className="playground-sidebar-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="playground-directory"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? <X /> : <Menu />}</span>
        <span className="sr-only">
          {open ? "Close Playground directory" : "Open Playground directory"}
        </span>
      </button>
      <aside
        id="playground-directory"
        className="playground-sidebar"
        aria-label="Playground directory"
      >
        <Link
          className={`playground-sidebar-home ${pathname === "/playground" ? "is-active" : ""}`}
          href="/playground"
          onClick={close}
        >
          <span>Playground home</span>
          <span aria-hidden="true"><House /></span>
        </Link>
        <LinkGroup title="Games" items={playgroundGames} onNavigate={close} />
        <LinkGroup title="Tools" items={playgroundTools} onNavigate={close} />
      </aside>
    </div>
  );
}
