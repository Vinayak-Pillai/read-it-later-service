import { eq } from "drizzle-orm";
import { db } from "../db/db-client.js";
import { articlesSummary, } from "../models/read-it-later-schema.js";
const upsert = async (data) => {
    try {
        const result = await db
            .insert(articlesSummary)
            .values(data)
            .onConflictDoUpdate({
            target: articlesSummary.articleId,
            set: {
                favorites: data.favorites,
                markAsRead: data.markAsRead,
                updatedAt: new Date(),
            },
        })
            .returning();
        return result?.[0] || null;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
const findById = async (articleId) => {
    try {
        const result = await db
            .select()
            .from(articlesSummary)
            .where(eq(articlesSummary.articleId, articleId))
            .limit(1);
        return result?.[0] || null;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
const update = async (articleId, data) => {
    try {
        const result = await db
            .update(articlesSummary)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where(eq(articlesSummary.articleId, articleId))
            .returning();
        return result?.[0] || null;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
export const articlesSummaryDao = {
    upsert,
    findById,
    update,
};
