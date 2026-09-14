import { createBlogPageAction } from "@/app/dashboard/actions";
import { BlogEditor } from "@/components/dashboard/blog-editor";

export default function NewBlogPage() {
  return <BlogEditor action={createBlogPageAction} />;
}
