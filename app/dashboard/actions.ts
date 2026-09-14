"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { blogPages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { slugBelongsToAnotherPage } from "@/lib/blog/queries";
import { parseBlogPageForm } from "@/lib/blog/validation";

export async function createBlogPageAction(formData: FormData) {
  await requireAdmin("/dashboard/blog/new");
  const db = getDb();
  const input = parseBlogPageForm(formData);
  if (await slugBelongsToAnotherPage(input.slug)) throw new Error("A blog page already uses this slug.");
  const now = new Date();
  const [page] = await db.insert(blogPages).values({
    ...input,
    published: input.status === "PUBLISHED",
    publishedAt: input.status === "PUBLISHED" ? now : null,
    updatedAt: now,
  }).returning({ id: blogPages.id });
  revalidatePath("/dashboard");
  redirect(`/dashboard/blog/${page.id}/edit?saved=created`);
}

export async function updateBlogPageAction(id: string, formData: FormData) {
  await requireAdmin(`/dashboard/blog/${id}/edit`);
  const db = getDb();
  const input = parseBlogPageForm(formData);
  if (await slugBelongsToAnotherPage(input.slug, id)) throw new Error("A blog page already uses this slug.");
  const existing = await db.query.blogPages.findFirst({ where: eq(blogPages.id, id) });
  if (!existing || existing.deletedAt) throw new Error("Blog page not found.");
  await db.update(blogPages).set({
    ...input,
    published: input.status === "PUBLISHED",
    publishedAt: input.status === "PUBLISHED" ? existing.publishedAt ?? new Date() : existing.publishedAt,
    updatedAt: new Date(),
  }).where(eq(blogPages.id, id));
  revalidatePath("/dashboard");
  redirect(`/dashboard/blog/${id}/edit?saved=updated`);
}

export async function archiveBlogPageAction(id: string) {
  await requireAdmin();
  const db = getDb();
  await db.update(blogPages).set({ status: "ARCHIVED", published: false, updatedAt: new Date() }).where(eq(blogPages.id, id));
  revalidatePath("/dashboard");
}

export async function deleteBlogPageAction(id: string) {
  await requireAdmin();
  const db = getDb();
  await db.update(blogPages).set({ deletedAt: new Date(), published: false, updatedAt: new Date() }).where(eq(blogPages.id, id));
  revalidatePath("/dashboard");
}
