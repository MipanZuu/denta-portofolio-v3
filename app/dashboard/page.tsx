import Link from "next/link";
import { BlogTable } from "@/components/dashboard/blog-table";
import { blogPageStatusValues } from "@/db/schema";
import { getBlogStats, listBlogPages } from "@/lib/blog/queries";

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "ALL";
  const [pages, stats] = await Promise.all([listBlogPages(search, status), getBlogStats()]);

  return <>
    <header className="dashboard-heading"><div><p className="eyebrow">Content overview</p><h1>Your writing.</h1><p>Draft ideas, refine the story, and control what appears on your portfolio.</p></div><Link className="button button-primary" href="/dashboard/blog/new">+ New post</Link></header>
    <section className="dashboard-stats" aria-label="Blog summary">
      <article><span>All posts</span><strong>{stats.total}</strong><small>Active records</small></article>
      <article><span>Published</span><strong>{stats.published}</strong><small>Live articles</small></article>
      <article><span>Drafts</span><strong>{stats.drafts}</strong><small>In progress</small></article>
      <article><span>Archived</span><strong>{stats.archived}</strong><small>Stored away</small></article>
    </section>
    <section className="dashboard-list-panel"><div className="dashboard-list-heading"><div><h2>Blog pages</h2><p>{pages.length} {pages.length === 1 ? "result" : "results"}</p></div><form className="dashboard-filters"><label className="sr-only" htmlFor="blog-search">Search posts</label><input id="blog-search" name="q" type="search" defaultValue={search} placeholder="Search title or slug…"/><label className="sr-only" htmlFor="status-filter">Filter by status</label><select id="status-filter" name="status" defaultValue={status}><option value="ALL">All statuses</option>{blogPageStatusValues.map((value) => <option key={value} value={value}>{value[0] + value.slice(1).toLowerCase()}</option>)}</select><button type="submit">Filter</button></form></div><BlogTable pages={pages} /></section>
  </>;
}
