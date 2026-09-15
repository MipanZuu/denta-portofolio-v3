import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BlogPage } from "@/db/schema";
import { ImageUploadFields } from "@/components/dashboard/image-upload-fields";

type BlogEditorProps = {
  page?: BlogPage;
  action: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
};

function imageLines(images?: string) {
  if (!images) return "";
  try { return (JSON.parse(images) as string[]).join("\n"); } catch { return images; }
}

function tagList(tags?: string) {
  if (!tags) return "";
  try { return (JSON.parse(tags) as string[]).join(", "); } catch { return tags; }
}

export function BlogEditor({ page, action, saved }: BlogEditorProps) {
  return <>
    <header className="editor-heading"><div><Link href="/dashboard"><ArrowLeft aria-hidden="true" /> All posts</Link><p className="eyebrow">{page ? "Edit article" : "New article"}</p><h1>{page ? page.title : "Untitled story"}</h1></div><div>{saved ? <span className="saved-indicator">Saved successfully</span> : null}<button className="button button-primary" type="submit" form="blog-editor-form">{page ? "Save changes" : "Create post"}</button></div></header>
    <form id="blog-editor-form" className="blog-editor" action={action}>
      <section className="editor-main">
        <div className="editor-card"><div className="editor-card-heading"><span>01</span><div><h2>Story</h2><p>The content readers will see.</p></div></div><div className="editor-fields">
          <label>Title<input name="title" defaultValue={page?.title} required placeholder="A clear, memorable title" /></label>
          <label>Slug<div className="slug-input"><span>/blog/</span><input name="slug" defaultValue={page?.slug} placeholder="generated-from-title" /></div></label>
          <label>Excerpt<textarea name="excerpt" defaultValue={page?.excerpt} required rows={3} placeholder="A concise introduction for cards and search results." /></label>
          <label>Main content<textarea className="content-field" name="content" defaultValue={page?.content} required rows={12} placeholder="Write the opening and primary body of the article…" /></label>
          <label>Secondary content<textarea name="secondaryContent" defaultValue={page?.secondaryContent} rows={7} placeholder="Optional second section…" /></label>
          <label>Third content<textarea name="thirdContent" defaultValue={page?.thirdContent} rows={7} placeholder="Optional closing section…" /></label>
        </div></div>
        <div className="editor-card"><div className="editor-card-heading"><span>02</span><div><h2>Search appearance</h2><p>How this article is introduced to search engines.</p></div></div><div className="editor-fields two-columns">
          <label>SEO title<input name="seoMetaTitle" defaultValue={page?.seoMetaTitle} maxLength={70} placeholder="Defaults to the article title" /></label>
          <label>SEO description<textarea name="seoMetaDescription" defaultValue={page?.seoMetaDescription} maxLength={170} rows={3} placeholder="Defaults to the excerpt" /></label>
        </div></div>
      </section>
      <aside className="editor-sidebar">
        <div className="editor-card"><div className="editor-card-heading"><span>03</span><div><h2>Publishing</h2><p>Control the article lifecycle.</p></div></div><div className="editor-fields"><label>Status<select name="status" defaultValue={page?.status ?? "DRAFT"}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label><label>Content tags<input name="tags" defaultValue={tagList(page?.tags)} maxLength={300} placeholder="Next.js, UX, Engineering" /></label><p className="field-note">Separate tags with commas. Up to 10 tags will be saved.</p>{page?.publishedAt ? <p className="field-note">First published {page.publishedAt.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}</p> : null}</div></div>
        <div className="editor-card"><div className="editor-card-heading"><span>04</span><div><h2>Media</h2><p>Upload visuals or use existing URLs.</p></div></div><div className="editor-fields"><ImageUploadFields initialCoverUrl={page?.coverImageUrl ?? ""} initialGalleryUrls={imageLines(page?.images)} /></div></div>
      </aside>
    </form>
  </>;
}
