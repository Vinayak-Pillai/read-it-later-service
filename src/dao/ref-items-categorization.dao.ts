import { eq, desc } from "drizzle-orm";
import { db } from "../db/db-client.js";
import {
  NewRefItemCategorization,
  refItemsCategorization,
} from "../models/read-it-later-schema.js";

const upsert = async (data: NewRefItemCategorization) => {
  try {
    const result = await db
      .insert(refItemsCategorization)
      .values(data)
      .onConflictDoUpdate({
        target: refItemsCategorization.url,
        set: data,
      })
      .returning({ id: refItemsCategorization.itemsCategoryId });

    return result?.[0]?.id;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const findAll = async () => {
  try {
    const result = await db
      .select()
      .from(refItemsCategorization)
      .orderBy(desc(refItemsCategorization.createdAt));

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const findById = async (itemsCategoryId: number) => {
  try {
    const result = await db
      .select()
      .from(refItemsCategorization)
      .where(eq(refItemsCategorization.itemsCategoryId, itemsCategoryId))
      .limit(1);

    return result?.[0] || null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const toArchive = async (
  itemsCategoryId: number,
  isArchived: boolean = true
) => {
  try {
    const result = await db
      .update(refItemsCategorization)
      .set({
        isArchived,
        updatedAt: new Date(),
      })
      .where(eq(refItemsCategorization.itemsCategoryId, itemsCategoryId))
      .returning();

    return result?.[0] || null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const refItemsCategorizationDao = {
  upsert,
  findAll,
  findById,
  toArchive,
};
