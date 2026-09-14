CREATE TABLE "blog_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"blog_page_id" text NOT NULL,
	"visitor_id" text NOT NULL,
	"author_name" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "blog_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"blog_page_id" text NOT NULL,
	"visitor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_blog_page_id_blog_pages_id_fk" FOREIGN KEY ("blog_page_id") REFERENCES "public"."blog_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_blog_page_id_blog_pages_id_fk" FOREIGN KEY ("blog_page_id") REFERENCES "public"."blog_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_comments_page_created_at_idx" ON "blog_comments" USING btree ("blog_page_id","created_at");--> statement-breakpoint
CREATE INDEX "blog_comments_visitor_created_at_idx" ON "blog_comments" USING btree ("visitor_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_likes_page_visitor_unique" ON "blog_likes" USING btree ("blog_page_id","visitor_id");--> statement-breakpoint
CREATE INDEX "blog_likes_page_created_at_idx" ON "blog_likes" USING btree ("blog_page_id","created_at");