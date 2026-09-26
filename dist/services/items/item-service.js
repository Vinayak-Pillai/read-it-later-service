import { eq, desc, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { items, refItemsCategorization } from "../../models/index.js";
/**
 * Retrieve items with optional filtering and joined category information
 */
export const findItems = async (filters) => {
  const query = db
    .select({
      itemsId: items.itemsId,
      itemsUuid: items.itemsUuid,
      refItemsCategoryId: items.refItemsCategoryId,
      url: refItemsCategorization.url,
      category: refItemsCategorization.category,
      title: items.title,
      description: items.description,
      content: items.content,
      author: items.author,
      coverImage: items.coverImage,
      isRead: items.isRead,
      isArchived: items.isArchived,
      tags: items.tags,
      createdAt: items.createdAt,
      updatedAt: items.updatedAt,
    })
    .from(items)
    .leftJoin(
      refItemsCategorization,
      eq(items.refItemsCategoryId, refItemsCategorization.itemsCategoryId),
    )
    .orderBy(desc(items.createdAt));
  const allItems = await query;
  let results = allItems;
  if (filters?.isRead !== undefined) {
    results = results.filter((item) => item.isRead === filters.isRead);
  }
  if (filters?.isArchived !== undefined) {
    results = results.filter((item) => item.isArchived === filters.isArchived);
  }
  if (filters?.category !== undefined) {
    results = results.filter((item) => item.category === filters.category);
  }
  return results;
};
/**
 * Retrieve a single item by numeric ID or UUID
 */
export const findItemById = async (id) => {
  const isNumeric = /^\d+$/.test(id);
  const query = db
    .select({
      itemsId: items.itemsId,
      itemsUuid: items.itemsUuid,
      refItemsCategoryId: items.refItemsCategoryId,
      url: refItemsCategorization.url,
      category: refItemsCategorization.category,
      title: items.title,
      description: items.description,
      content: items.content,
      author: items.author,
      coverImage: items.coverImage,
      isRead: items.isRead,
      isArchived: items.isArchived,
      tags: items.tags,
      createdAt: items.createdAt,
      updatedAt: items.updatedAt,
    })
    .from(items)
    .leftJoin(
      refItemsCategorization,
      eq(items.refItemsCategoryId, refItemsCategorization.itemsCategoryId),
    );
  const result = isNumeric
    ? await query.where(eq(items.itemsId, parseInt(id, 10))).limit(1)
    : await query.where(eq(items.itemsUuid, id)).limit(1);
  return result[0] || null;
};
/**
 * Create a new item, optionally creating or linking categorization
 */
export const createItem = async (data) => {
  let categoryId = data.refItemsCategoryId;
  // If URL is provided and no category ID is linked, find or create category record
  if (data.url && !categoryId) {
    const existingCategory = await db
      .select()
      .from(refItemsCategorization)
      .where(eq(refItemsCategorization.url, data.url))
      .limit(1);
    if (existingCategory.length > 0) {
      categoryId = existingCategory[0].itemsCategoryId;
    } else {
      // Find next category ID if needed
      const maxCat = await db
        .select({
          maxId: sql`coalesce(max(${refItemsCategorization.itemsCategoryId}), 0)`,
        })
        .from(refItemsCategorization);
      const nextCatId = (maxCat[0]?.maxId || 0) + 1;
      const newCat = await db
        .insert(refItemsCategorization)
        .values({
          itemsCategoryId: nextCatId,
          url: data.url,
          category: data.category || null,
        })
        .returning();
      categoryId = newCat[0]?.itemsCategoryId;
    }
  }
  // Generate itemsId if not provided
  const newItemValues = {
    itemsUuid: data.itemsUuid,
    refItemsCategoryId: categoryId || null,
    title: data.title || null,
    description: data.description || null,
    content: data.content || null,
    author: data.author || null,
    coverImage: data.coverImage || null,
    isRead: data.isRead ?? false,
    isArchived: data.isArchived ?? false,
    tags: data.tags || null,
  };
  const inserted = await db.insert(items).values(newItemValues).returning();
  const createdItem = inserted[0];
  return {
    ...createdItem,
    url: data.url || null,
    category: data.category || null,
  };
};
/**
 * Update an existing item by numeric ID or UUID
 */
export const updateItem = async (id, updates) => {
  const existing = await findItemById(id);
  if (!existing) {
    return null;
  }
  // Update categorization if URL or Category changed and refItemsCategoryId is present
  if (
    existing.refItemsCategoryId &&
    (updates.url !== undefined || updates.category !== undefined)
  ) {
    await db
      .update(refItemsCategorization)
      .set({
        ...(updates.url !== undefined && { url: updates.url }),
        ...(updates.category !== undefined && { category: updates.category }),
        updatedAt: new Date(),
      })
      .where(
        eq(refItemsCategorization.itemsCategoryId, existing.refItemsCategoryId),
      );
  }
  const isNumeric = /^\d+$/.test(id);
  const whereClause = isNumeric
    ? eq(items.itemsId, parseInt(id, 10))
    : eq(items.itemsUuid, id);
  await db
    .update(items)
    .set({
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && {
        description: updates.description,
      }),
      ...(updates.content !== undefined && { content: updates.content }),
      ...(updates.author !== undefined && { author: updates.author }),
      ...(updates.coverImage !== undefined && {
        coverImage: updates.coverImage,
      }),
      ...(updates.isRead !== undefined && { isRead: updates.isRead }),
      ...(updates.isArchived !== undefined && {
        isArchived: updates.isArchived,
      }),
      ...(updates.tags !== undefined && { tags: updates.tags }),
      updatedAt: new Date(),
    })
    .where(whereClause);
  return findItemById(id);
};
/**
 * Delete an item by numeric ID or UUID
 */
export const deleteItem = async (id) => {
  const isNumeric = /^\d+$/.test(id);
  const whereClause = isNumeric
    ? eq(items.itemsId, parseInt(id, 10))
    : eq(items.itemsUuid, id);
  const deleted = await db.delete(items).where(whereClause).returning();
  return deleted.length > 0;
};
