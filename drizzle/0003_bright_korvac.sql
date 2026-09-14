CREATE TABLE "blog_views" (
	"id" text PRIMARY KEY NOT NULL,
	"blog_page_id" text NOT NULL,
	"visitor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_views" ADD CONSTRAINT "blog_views_blog_page_id_blog_pages_id_fk" FOREIGN KEY ("blog_page_id") REFERENCES "public"."blog_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_views_page_visitor_unique" ON "blog_views" USING btree ("blog_page_id","visitor_id");--> statement-breakpoint
CREATE INDEX "blog_views_page_created_at_idx" ON "blog_views" USING btree ("blog_page_id","created_at");