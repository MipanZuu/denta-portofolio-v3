import { randomUUID } from "node:crypto";
import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const blogPageStatusValues = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type BlogPageStatus = (typeof blogPageStatusValues)[number];

export const blogPageStatus = pgEnum("blog_page_status", blogPageStatusValues);

export const blogPages = pgTable(
  "blog_pages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `blog_${randomUUID()}`),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    secondaryContent: text("secondary_content").notNull().default(""),
    thirdContent: text("third_content").notNull().default(""),
    seoMetaTitle: text("seo_meta_title").notNull(),
    seoMetaDescription: text("seo_meta_description").notNull(),
    coverImageUrl: text("cover_image_url"),
    images: text("images").notNull().default("[]"),
    tags: text("tags").notNull().default("[]"),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    status: blogPageStatus("status").notNull().default("DRAFT"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("blog_pages_slug_unique").on(table.slug),
    index("blog_pages_status_updated_at_idx").on(table.status, table.updatedAt),
    index("blog_pages_published_at_idx").on(table.publishedAt),
  ],
);

export type BlogPage = typeof blogPages.$inferSelect;
export type NewBlogPage = typeof blogPages.$inferInsert;

export const blogLikes = pgTable(
  "blog_likes",
  {
    id: text("id").primaryKey().$defaultFn(() => `like_${randomUUID()}`),
    blogPageId: text("blog_page_id").notNull().references(() => blogPages.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("blog_likes_page_visitor_unique").on(table.blogPageId, table.visitorId),
    index("blog_likes_page_created_at_idx").on(table.blogPageId, table.createdAt),
  ],
);

export const blogComments = pgTable(
  "blog_comments",
  {
    id: text("id").primaryKey().$defaultFn(() => `comment_${randomUUID()}`),
    blogPageId: text("blog_page_id").notNull().references(() => blogPages.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    authorName: text("author_name").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("blog_comments_page_created_at_idx").on(table.blogPageId, table.createdAt),
    index("blog_comments_visitor_created_at_idx").on(table.visitorId, table.createdAt),
  ],
);

export const blogViews = pgTable(
  "blog_views",
  {
    id: text("id").primaryKey().$defaultFn(() => `view_${randomUUID()}`),
    blogPageId: text("blog_page_id").notNull().references(() => blogPages.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("blog_views_page_created_at_idx").on(table.blogPageId, table.createdAt),
  ],
);

export type BlogComment = typeof blogComments.$inferSelect;
