CREATE TABLE "read_it_later"."articles_summary" (
	"article_id" integer PRIMARY KEY NOT NULL,
	"favorites" integer DEFAULT 0 NOT NULL,
	"mark_as_read" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "read_it_later"."items" ADD COLUMN "favorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "read_it_later"."items" ADD COLUMN "mark_as_read" boolean DEFAULT false NOT NULL;