CREATE TYPE "public"."blog_page_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "blog_pages" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"secondary_content" text DEFAULT '' NOT NULL,
	"third_content" text DEFAULT '' NOT NULL,
	"seo_meta_title" text NOT NULL,
	"seo_meta_description" text NOT NULL,
	"cover_image_url" text,
	"images" text DEFAULT '[]' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"status" "blog_page_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "blog_pages_slug_unique" ON "blog_pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_pages_status_updated_at_idx" ON "blog_pages" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "blog_pages_published_at_idx" ON "blog_pages" USING btree ("published_at");