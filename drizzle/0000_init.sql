CREATE SCHEMA IF NOT EXISTS "read_it_later";
--> statement-breakpoint
CREATE TABLE "read_it_later"."items" (
	"items_id" serial PRIMARY KEY NOT NULL,
	"items_uuid" uuid DEFAULT gen_random_uuid(),
	"items_category_id" integer,
	"title" text,
	"description" text,
	"content" text,
	"author" varchar(255),
	"cover_image" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"tags" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "read_it_later"."ref_items_categorization" (
	"items_category_id" serial PRIMARY KEY NOT NULL,
	"url" varchar(255),
	"category" varchar(255),
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ref_items_categorization_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "read_it_later"."items" ADD CONSTRAINT "items_items_category_id_ref_items_categorization_items_category_id_fk" FOREIGN KEY ("items_category_id") REFERENCES "read_it_later"."ref_items_categorization"("items_category_id") ON DELETE no action ON UPDATE no action;
