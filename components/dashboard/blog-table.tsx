import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { BlogPage } from "@/db/schema";
import { archiveBlogPageAction, deleteBlogPageAction } from "@/app/dashboard/actions";

const dateFormatter = new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" });

export function BlogTable({ pages }: { pages: BlogPage[] }) {
  if (!pages.length) return <div className="dashboard-empty"><span><Sparkles aria-hidden="true" /></span><h2>No posts found</h2><p>Create your first article or adjust the current filters.</p><Link className="button button-primary" href="/dashboard/blog/new">Create a post</Link></div>;

  return <div className="blog-table-wrap"><table className="blog-table"><thead><tr><th>Article</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{pages.map((page) => <tr key={page.id}>
    <td><strong>{page.title}</strong><span>/{page.slug}</span></td>
    <td><span className={`status-chip status-${page.status.toLowerCase()}`}>{page.status.toLowerCase()}</span></td>
    <td>{dateFormatter.format(page.updatedAt)}</td>
    <td><div className="row-actions"><Link href={`/dashboard/blog/${page.id}/edit`}>Edit</Link>{page.status !== "ARCHIVED" ? <form action={archiveBlogPageAction.bind(null, page.id)}><button type="submit">Archive</button></form> : null}<form action={deleteBlogPageAction.bind(null, page.id)}><button className="danger" type="submit">Delete</button></form></div></td>
  </tr>)}</tbody></table></div>;
}
