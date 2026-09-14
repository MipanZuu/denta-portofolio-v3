import "server-only";
import { and, asc, desc, eq, inArray, isNull, ne, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { blogComments, blogLikes, blogPages, blogViews, type BlogPageStatus } from "@/db/schema";

export async function listBlogPages(search = "", status = "ALL") {
  const db = getDb();
  const conditions = [isNull(blogPages.deletedAt)];
  if (status !== "ALL") conditions.push(eq(blogPages.status, status as BlogPageStatus));
  if (search) conditions.push(sql`(${blogPages.title} ilike ${`%${search}%`} or ${blogPages.slug} ilike ${`%${search}%`})`);

  return db.select().from(blogPages).where(and(...conditions)).orderBy(desc(blogPages.updatedAt));
}

export async function getBlogPage(id: string) {
  const db = getDb();
  const [page] = await db.select().from(blogPages).where(and(eq(blogPages.id, id), isNull(blogPages.deletedAt))).limit(1);
  return page;
}

export async function getBlogStats() {
  const db = getDb();
  const [stats] = await db.select({
    total: sql<number>`count(*)::int`,
    drafts: sql<number>`count(*) filter (where ${blogPages.status} = 'DRAFT')::int`,
    published: sql<number>`count(*) filter (where ${blogPages.status} = 'PUBLISHED')::int`,
    archived: sql<number>`count(*) filter (where ${blogPages.status} = 'ARCHIVED')::int`,
  }).from(blogPages).where(isNull(blogPages.deletedAt));
  return stats;
}

export async function slugBelongsToAnotherPage(slug: string, id?: string) {
  const db = getDb();
  const conditions = [eq(blogPages.slug, slug)];
  if (id) conditions.push(ne(blogPages.id, id));
  const [match] = await db.select({ id: blogPages.id }).from(blogPages).where(and(...conditions)).limit(1);
  return Boolean(match);
}

export async function listPublishedBlogPages() {
  const db = getDb();
  const posts = await db
    .select({
      id: blogPages.id,
      title: blogPages.title,
      slug: blogPages.slug,
      excerpt: blogPages.excerpt,
      coverImageUrl: blogPages.coverImageUrl,
      publishedAt: blogPages.publishedAt,
      images: blogPages.images,
      tags: blogPages.tags,
    })
    .from(blogPages)
    .where(and(eq(blogPages.status, "PUBLISHED"), eq(blogPages.published, true), isNull(blogPages.deletedAt)))
    .orderBy(desc(blogPages.publishedAt), desc(blogPages.createdAt));

  if (!posts.length) return [];
  const pageIds = posts.map((post) => post.id);
  const [likeCounts, commentCounts, viewCounts] = await Promise.all([
    db
      .select({ blogPageId: blogLikes.blogPageId, count: sql<number>`count(*)::int` })
      .from(blogLikes)
      .where(inArray(blogLikes.blogPageId, pageIds))
      .groupBy(blogLikes.blogPageId),
    db
      .select({ blogPageId: blogComments.blogPageId, count: sql<number>`count(*)::int` })
      .from(blogComments)
      .where(and(inArray(blogComments.blogPageId, pageIds), isNull(blogComments.deletedAt)))
      .groupBy(blogComments.blogPageId),
    db
      .select({ blogPageId: blogViews.blogPageId, count: sql<number>`count(*)::int` })
      .from(blogViews)
      .where(inArray(blogViews.blogPageId, pageIds))
      .groupBy(blogViews.blogPageId),
  ]);
  const likesByPage = new Map(likeCounts.map((row) => [row.blogPageId, row.count]));
  const commentsByPage = new Map(commentCounts.map((row) => [row.blogPageId, row.count]));
  const viewsByPage = new Map(viewCounts.map((row) => [row.blogPageId, row.count]));

  return posts.map((post) => ({
    ...post,
    likeCount: likesByPage.get(post.id) ?? 0,
    commentCount: commentsByPage.get(post.id) ?? 0,
    viewCount: viewsByPage.get(post.id) ?? 0,
  }));
}

export async function getPublishedBlogPageBySlug(slug: string) {
  const db = getDb();
  const [page] = await db
    .select()
    .from(blogPages)
    .where(and(eq(blogPages.slug, slug), eq(blogPages.status, "PUBLISHED"), eq(blogPages.published, true), isNull(blogPages.deletedAt)))
    .limit(1);
  return page;
}

export async function getBlogComments(blogPageId: string) {
  const db = getDb();
  return db
    .select()
    .from(blogComments)
    .where(and(eq(blogComments.blogPageId, blogPageId), isNull(blogComments.deletedAt)))
    .orderBy(asc(blogComments.createdAt));
}

export async function getBlogEngagement(blogPageId: string, visitorId?: string) {
  const db = getDb();
  const [[likes], [comments], [views], visitorLike] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(blogLikes).where(eq(blogLikes.blogPageId, blogPageId)),
    db.select({ count: sql<number>`count(*)::int` }).from(blogComments).where(and(eq(blogComments.blogPageId, blogPageId), isNull(blogComments.deletedAt))),
    db.select({ count: sql<number>`count(*)::int` }).from(blogViews).where(eq(blogViews.blogPageId, blogPageId)),
    visitorId
      ? db.select({ id: blogLikes.id }).from(blogLikes).where(and(eq(blogLikes.blogPageId, blogPageId), eq(blogLikes.visitorId, visitorId))).limit(1)
      : Promise.resolve([]),
  ]);
  return { likeCount: likes.count, commentCount: comments.count, viewCount: views.count, liked: visitorLike.length > 0 };
}

export async function getLikedBlogPageIds(visitorId: string | undefined, blogPageIds: string[]) {
  if (!visitorId || !blogPageIds.length) return new Set<string>();
  const rows = await getDb()
    .select({ blogPageId: blogLikes.blogPageId })
    .from(blogLikes)
    .where(and(eq(blogLikes.visitorId, visitorId), inArray(blogLikes.blogPageId, blogPageIds)));
  return new Set(rows.map((row) => row.blogPageId));
}
