import { eq, desc } from "drizzle-orm";
import { db } from "../db/db-client.js";
import { NewItem, items } from "../models/read-it-later-schema.js";

const insert = async (data: NewItem) => {
  try {
    const result = await db
      .insert(items)
      .values(data)
      .returning({ id: items.itemsId });

    return result?.[0]?.id;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const findAll = async () => {
  try {
    const result = await db.select().from(items).orderBy(desc(items.createdAt));

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const findById = async (itemsId: number) => {
  try {
    const result = await db
      .select()
      .from(items)
      .where(eq(items.itemsId, itemsId))
      .limit(1);

    return result?.[0] || null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const update = async (itemsId: number, data: Partial<NewItem>) => {
  try {
    const result = await db
      .update(items)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(items.itemsId, itemsId))
      .returning();

    return result?.[0] || null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const toArchive = async (itemsId: number, isArchived: boolean = true) => {
  try {
    const result = await db
      .update(items)
      .set({
        isArchived,
        updatedAt: new Date(),
      })
      .where(eq(items.itemsId, itemsId))
      .returning();

    return result?.[0] || null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const toDelete = async (itemsId: number) => {
  try {
    const result = await db
      .delete(items)
      .where(eq(items.itemsId, itemsId))
      .returning({ id: items.itemsId });

    return result.length > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const itemsDao = {
  insert,
  findAll,
  findById,
  update,
  toArchive,
  toDelete,
};
