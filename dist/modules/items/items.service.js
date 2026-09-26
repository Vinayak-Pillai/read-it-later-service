import { itemsDao, refItemsCategorizationDao, articlesSummaryDao, } from "../../dao/index.js";
import { extractArticle } from "../../utils/index.js";
/**
 * Retrieve all items with optional filtering
 */
const getAllItems = async (query) => {
    const [itemsList, categoriesList] = await Promise.all([
        itemsDao.findAll(),
        refItemsCategorizationDao.findAll(),
    ]);
    if (!itemsList || !Array.isArray(itemsList)) {
        return [];
    }
    const categoryMap = new Map();
    if (Array.isArray(categoriesList)) {
        for (const cat of categoriesList) {
            categoryMap.set(cat.itemsCategoryId, {
                url: cat.url,
                category: cat.category,
            });
        }
    }
    let enriched = itemsList.map((item) => {
        const cat = item.refItemsCategoryId
            ? categoryMap.get(item.refItemsCategoryId)
            : undefined;
        return {
            ...item,
            url: cat?.url || null,
            category: cat?.category || null,
        };
    });
    if (query?.isRead !== undefined) {
        const isReadBool = query.isRead === "true";
        enriched = enriched.filter((i) => i.isRead === isReadBool);
    }
    if (query?.isArchived !== undefined) {
        const isArchivedBool = query.isArchived === "true";
        enriched = enriched.filter((i) => i.isArchived === isArchivedBool);
    }
    if (query?.favorite !== undefined) {
        const favoriteBool = query.favorite === "true";
        enriched = enriched.filter((i) => i.favorite === favoriteBool);
    }
    if (query?.markAsRead !== undefined) {
        const markAsReadBool = query.markAsRead === "true";
        enriched = enriched.filter((i) => i.markAsRead === markAsReadBool);
    }
    if (query?.category !== undefined) {
        enriched = enriched.filter((i) => i.category === query.category);
    }
    return enriched;
};
/**
 * Retrieve a single item by ID
 */
const getItemById = async (itemsId) => {
    const item = await itemsDao.findById(itemsId);
    if (!item) {
        return null;
    }
    let url = null;
    let category = null;
    if (item.refItemsCategoryId) {
        const cat = await refItemsCategorizationDao.findById(item.refItemsCategoryId);
        if (cat) {
            url = cat.url;
            category = cat.category;
        }
    }
    return {
        ...item,
        url,
        category,
    };
};
/**
 * Create a new item using the article extractor
 */
const createItem = async (dto) => {
    const targetUrl = dto.url;
    if (!targetUrl) {
        throw new Error("URL is required");
    }
    // Extract article details (thumbnail, title, domain, rawUrl) using cheerio extractor
    const extracted = await extractArticle(targetUrl);
    if (!extracted.title) {
        console.log("Extracted data not found");
        return null;
    }
    const categoryName = dto.category || dto.categoryName || extracted.domain || "General";
    // Upsert categorization record
    const categoryId = await refItemsCategorizationDao.upsert({
        url: extracted.rawUrl,
        category: categoryName,
        isArchived: false,
    });
    if (typeof categoryId !== "number") {
        throw new Error("Failed to create or retrieve category");
    }
    // Insert item with metadata from extractor
    const insertedId = await itemsDao.insert({
        itemsUuid: dto.itemsUuid,
        refItemsCategoryId: categoryId,
        title: extracted.title || dto.title || null,
        description: dto.description || null,
        content: dto.content || null,
        author: dto.author || null,
        coverImage: extracted.thumbnailUrl || dto.coverImage || null,
        isRead: dto.isRead ?? false,
        isArchived: dto.isArchived ?? false,
        favorite: dto.favorite ?? false,
        markAsRead: dto.markAsRead ?? false,
        tags: dto.tags || null,
    });
    if (typeof insertedId !== "number") {
        return null;
    }
    // Initialize summary record
    await articlesSummaryDao.upsert({
        articleId: insertedId,
        favorites: dto.favorite ? 1 : 0,
        markAsRead: dto.markAsRead ? 1 : 0,
    });
    return getItemById(insertedId);
};
/**
 * Update an item by ID
 */
const updateItem = async (itemsId, dto) => {
    const existing = await getItemById(itemsId);
    if (!existing) {
        return null;
    }
    const updateData = {};
    if (dto.title !== undefined)
        updateData.title = dto.title;
    if (dto.description !== undefined)
        updateData.description = dto.description;
    if (dto.content !== undefined)
        updateData.content = dto.content;
    if (dto.author !== undefined)
        updateData.author = dto.author;
    if (dto.coverImage !== undefined)
        updateData.coverImage = dto.coverImage;
    if (dto.isRead !== undefined)
        updateData.isRead = dto.isRead;
    if (dto.isArchived !== undefined)
        updateData.isArchived = dto.isArchived;
    if (dto.favorite !== undefined)
        updateData.favorite = dto.favorite;
    if (dto.markAsRead !== undefined) {
        updateData.markAsRead = dto.markAsRead;
        updateData.isRead = dto.markAsRead;
    }
    if (dto.tags !== undefined)
        updateData.tags = dto.tags;
    const updated = await itemsDao.update(itemsId, updateData);
    if (!updated) {
        return null;
    }
    return getItemById(itemsId);
};
/**
 * Update status of favorite and markAsRead
 */
const updateItemStatus = async (itemsId, status) => {
    const existing = await getItemById(itemsId);
    if (!existing) {
        return null;
    }
    const updateData = {};
    if (status.favorite !== undefined) {
        updateData.favorite = status.favorite;
    }
    if (status.markAsRead !== undefined) {
        updateData.markAsRead = status.markAsRead;
        updateData.isRead = status.markAsRead;
    }
    const updated = await itemsDao.update(itemsId, updateData);
    if (!updated) {
        return null;
    }
    // Update articles summary record
    const existingSummary = await articlesSummaryDao.findById(itemsId);
    const currentFavs = existingSummary ? existingSummary.favorites : 0;
    const currentMarkAsRead = existingSummary ? existingSummary.markAsRead : 0;
    const newFavs = status.favorite !== undefined
        ? status.favorite
            ? Math.max(1, currentFavs + (existing.favorite ? 0 : 1))
            : Math.max(0, currentFavs - (existing.favorite ? 1 : 0))
        : currentFavs;
    const newMarkAsRead = status.markAsRead !== undefined
        ? status.markAsRead
            ? Math.max(1, currentMarkAsRead + (existing.markAsRead ? 0 : 1))
            : Math.max(0, currentMarkAsRead - (existing.markAsRead ? 1 : 0))
        : currentMarkAsRead;
    await articlesSummaryDao.upsert({
        articleId: itemsId,
        favorites: newFavs,
        markAsRead: newMarkAsRead,
    });
    return getItemById(itemsId);
};
/**
 * Archive an item by itemsId
 */
const archiveItem = async (itemsId, isArchived = true) => {
    return itemsDao.toArchive(itemsId, isArchived);
};
/**
 * Delete an item by itemsId
 */
const deleteItem = async (itemsId) => {
    return itemsDao.toDelete(itemsId);
};
export const itemsService = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    updateItemStatus,
    archiveItem,
    deleteItem,
};
