import { notFound } from "next/navigation";
import { updateBlogPageAction } from "@/app/dashboard/actions";
import { BlogEditor } from "@/components/dashboard/blog-editor";
import { getBlogPage } from "@/lib/blog/queries";

export default async function EditBlogPage({ params, searchParams }: PageProps<"/dashboard/blog/[id]/edit">) {
  const { id } = await params;
  const query = await searchParams;
  const page = await getBlogPage(id);
  if (!page) notFound();
  return <BlogEditor page={page} action={updateBlogPageAction.bind(null, id)} saved={typeof query.saved === "string"} />;
}
