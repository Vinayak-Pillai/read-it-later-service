import {
  pgSchema,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";

/**
 * PostgreSQL schema for read-it-later
 */
export const readItLaterSchema = pgSchema("read_it_later");

export const refItemsCategorization = readItLaterSchema.table(
  "ref_items_categorization",
  {
    itemsCategoryId: serial("items_category_id").primaryKey(),
    url: varchar("url", { length: 255 }).unique(),
    category: varchar("category", { length: 255 }),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const items = readItLaterSchema.table("items", {
  itemsId: serial("items_id").primaryKey(),
  itemsUuid: uuid("items_uuid").defaultRandom(),
  refItemsCategoryId: integer("items_category_id").references(
    () => refItemsCategorization.itemsCategoryId,
  ),
  title: text("title"),
  description: text("description"),
  content: text("content"),
  author: varchar("author", { length: 255 }),
  coverImage: text("cover_image"),
  isRead: boolean("is_read").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  favorite: boolean("favorite").default(false).notNull(),
  markAsRead: boolean("mark_as_read").default(false).notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const articlesSummary = readItLaterSchema.table("articles_summary", {
  articleId: integer("article_id").primaryKey(),
  favorites: integer("favorites").default(0).notNull(),
  markAsRead: integer("mark_as_read").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export type RefItemCategorization = typeof refItemsCategorization.$inferSelect;
export type NewRefItemCategorization =
  typeof refItemsCategorization.$inferInsert;

export type ArticleSummary = typeof articlesSummary.$inferSelect;
export type NewArticleSummary = typeof articlesSummary.$inferInsert;
