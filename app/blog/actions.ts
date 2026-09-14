"use server";

import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { blogComments, blogLikes, blogPages, blogViews } from "@/db/schema";
import { ensureVisitorId } from "@/lib/blog/visitor";

export type CommentFormState = { error?: string; success?: boolean };

async function assertPublishedPage(blogPageId: string, slug: string) {
  const db = getDb();
  const [page] = await db
    .select({ id: blogPages.id })
    .from(blogPages)
    .where(and(eq(blogPages.id, blogPageId), eq(blogPages.slug, slug), eq(blogPages.status, "PUBLISHED"), eq(blogPages.published, true), isNull(blogPages.deletedAt)))
    .limit(1);
  if (!page) throw new Error("This article is not available.");
}

export async function toggleBlogLikeAction(blogPageId: string, slug: string) {
  await assertPublishedPage(blogPageId, slug);
  const db = getDb();
  const visitorId = await ensureVisitorId();
  const [existing] = await db
    .select({ id: blogLikes.id })
    .from(blogLikes)
    .where(and(eq(blogLikes.blogPageId, blogPageId), eq(blogLikes.visitorId, visitorId)))
    .limit(1);

  if (existing) {
    await db.delete(blogLikes).where(eq(blogLikes.id, existing.id));
  } else {
    await db.insert(blogLikes).values({ blogPageId, visitorId }).onConflictDoNothing();
  }

  const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(blogLikes).where(eq(blogLikes.blogPageId, blogPageId));
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { liked: !existing, count: result.count };
}

export async function registerBlogViewAction(blogPageId: string, slug: string) {
  await assertPublishedPage(blogPageId, slug);
  const db = getDb();
  const visitorId = await ensureVisitorId();
  await db.insert(blogViews).values({ blogPageId, visitorId });
  const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(blogViews).where(eq(blogViews.blogPageId, blogPageId));

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);

  return { count: result.count };
}

export async function createBlogCommentAction(blogPageId: string, slug: string, _state: CommentFormState, formData: FormData): Promise<CommentFormState> {
  await assertPublishedPage(blogPageId, slug);
  const authorName = String(formData.get("authorName") ?? "").trim().replace(/\s+/g, " ");
  const content = String(formData.get("content") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) return { success: true };
  if (authorName.length < 2 || authorName.length > 50) return { error: "Your name must be between 2 and 50 characters." };
  if (!content || content.length > 1000) return { error: "Your comment must be between 1 and 1,000 characters." };

  const db = getDb();
  const visitorId = await ensureVisitorId();
  const cutoff = new Date(Date.now() - 15_000);
  const [recent] = await db
    .select({ id: blogComments.id })
    .from(blogComments)
    .where(and(eq(blogComments.visitorId, visitorId), gt(blogComments.createdAt, cutoff), isNull(blogComments.deletedAt)))
    .orderBy(desc(blogComments.createdAt))
    .limit(1);
  if (recent) return { error: "Please wait a few seconds before commenting again." };

  await db.insert(blogComments).values({ blogPageId, visitorId, authorName, content });
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { success: true };
}
