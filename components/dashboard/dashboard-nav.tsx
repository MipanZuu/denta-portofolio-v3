"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { signOutAction } from "@/app/auth/actions";

export function DashboardNav({ email }: { email: string }) {
  const pathname = usePathname();
  const creating = pathname === "/dashboard/blog/new";
  const viewingSpotify = pathname === "/dashboard/spotify";
  const viewingPosts = pathname === "/dashboard" || (pathname.startsWith("/dashboard/blog/") && !creating);

  return <aside className="dashboard-nav">
    <div><span className="dashboard-mark">DB</span><div><strong>Blog studio</strong><small>{email}</small></div></div>
    <nav aria-label="Dashboard navigation"><Link className={viewingPosts ? "is-active" : ""} href="/dashboard">All posts</Link><Link className={creating ? "is-active" : ""} href="/dashboard/blog/new">New post</Link><Link className={viewingSpotify ? "is-active" : ""} href="/dashboard/spotify">Spotify</Link><Link href="/" target="_blank">View portfolio <ArrowUpRight aria-hidden="true" /></Link></nav>
    <form action={signOutAction}><button className="dashboard-signout" type="submit">Sign out</button></form>
  </aside>;
}
