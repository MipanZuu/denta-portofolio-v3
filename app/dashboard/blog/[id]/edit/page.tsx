import { notFound } from "next/navigation";
import { updateBlogPageAction } from "@/app/dashboard/actions";
import { BlogCommentManager } from "@/components/dashboard/blog-comment-manager";
import { BlogEditor } from "@/components/dashboard/blog-editor";
import { getBlogPage, getDashboardBlogComments } from "@/lib/blog/queries";

function parseCommentPage(value: string | string[] | undefined) {
  const parsed = Number.parseInt(Array.isArray(value) ? value[0] : value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function EditBlogPage({ params, searchParams }: PageProps<"/dashboard/blog/[id]/edit">) {
  const { id } = await params;
  const query = await searchParams;
  const [page, commentPage] = await Promise.all([
    getBlogPage(id),
    getDashboardBlogComments(id, parseCommentPage(query.commentPage)),
  ]);
  if (!page) notFound();
  return (
    <>
      <BlogEditor page={page} action={updateBlogPageAction.bind(null, id)} saved={typeof query.saved === "string"} />
      <BlogCommentManager blogPageId={id} {...commentPage} />
    </>
  );
}
