import * as itemService from "../services/items/index.js";
import { handleException, handleResponse } from "../utils/index.js";
/**
 * Get all items with optional filtering
 */
export const getItems = async (req, res) => {
    try {
        const { isRead, isArchived, category } = req.query;
        const filters = {};
        if (isRead !== undefined) {
            filters.isRead = isRead === "true";
        }
        if (isArchived !== undefined) {
            filters.isArchived = isArchived === "true";
        }
        if (typeof category === "string") {
            filters.category = category;
        }
        const itemsList = await itemService.findItems(filters);
        handleResponse(res, {
            status: 200,
            message: "Items retrieved successfully",
            data: itemsList,
        });
    }
    catch (error) {
        handleException(res, error);
    }
};
/**
 * Get a single item by ID (numeric itemsId or UUID)
 */
export const getItemById = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await itemService.findItemById(id);
        if (!item) {
            handleResponse(res, {
                status: 404,
                message: `Item with id ${id} not found`,
                data: {},
            });
            return;
        }
        handleResponse(res, {
            status: 200,
            message: "Item retrieved successfully",
            data: item,
        });
    }
    catch (error) {
        handleException(res, error);
    }
};
/**
 * Create a new read-it-later item
 */
export const createItem = async (req, res) => {
    try {
        const { url, category, title, description, content, author, coverImage, tags, isRead, isArchived, itemsId, itemsUuid, refItemsCategoryId, } = req.body;
        if (!url) {
            handleResponse(res, {
                status: 400,
                message: "URL is required",
                data: {},
            });
            return;
        }
        const created = await itemService.createItem({
            refItemsCategoryId: typeof refItemsCategoryId === "number" ? refItemsCategoryId : undefined,
            title,
            description,
            content,
            author,
            coverImage,
            tags,
            isRead,
            isArchived,
        });
        handleResponse(res, {
            status: 201,
            message: "Item created successfully",
            data: created,
        });
    }
    catch (error) {
        handleException(res, error);
    }
};
/**
 * Update an existing item
 */
export const updateItem = async (req, res) => {
    try {
        const id = req.params.id;
        const { url, category, title, description, content, author, coverImage, isRead, isArchived, tags, } = req.body;
        const updated = await itemService.updateItem(id, {
            url,
            category,
            title,
            description,
            content,
            author,
            coverImage,
            isRead,
            isArchived,
            tags,
        });
        if (!updated) {
            handleResponse(res, {
                status: 404,
                message: `Item with id ${id} not found`,
                data: {},
            });
            return;
        }
        handleResponse(res, {
            status: 200,
            message: "Item updated successfully",
            data: updated,
        });
    }
    catch (error) {
        handleException(res, error);
    }
};
/**
 * Delete an item by ID
 */
export const deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await itemService.deleteItem(id);
        if (!deleted) {
            handleResponse(res, {
                status: 404,
                message: `Item with id ${id} not found`,
                data: {},
            });
            return;
        }
        handleResponse(res, {
            status: 200,
            message: `Item ${id} deleted successfully`,
            data: { id },
        });
    }
    catch (error) {
        handleException(res, error);
    }
};
