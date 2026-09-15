"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { playgroundGames, playgroundTools } from "@/statics/playground";

function LinkGroup({ title, items }: { title: string; items: typeof playgroundGames }) {
  const pathname = usePathname();
  return (
    <div className="playground-sidebar-group">
      <h2>{title}</h2>
      <div>
        {items.map((item) => (
          <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href}>
            <span>{item.title}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PlaygroundSidebar() {
  const pathname = usePathname();
  return (
    <aside className="playground-sidebar" aria-label="Playground directory">
      <Link className={`playground-sidebar-home ${pathname === "/playground" ? "is-active" : ""}`} href="/playground">
        <span>Playground home</span><span aria-hidden="true">⌂</span>
      </Link>
      <LinkGroup title="Games" items={playgroundGames} />
      <LinkGroup title="Tools" items={playgroundTools} />
    </aside>
  );
}
