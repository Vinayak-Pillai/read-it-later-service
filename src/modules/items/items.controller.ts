import { Request, Response } from "express";
import { itemsService } from "./items.service.js";
import { handleException, handleResponse } from "../../utils/index.js";
import { GetItemsQueryDto } from "./dto/index.js";

/**
 * Get all items controller
 */
const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as GetItemsQueryDto;
    const items = await itemsService.getAllItems(query);

    handleResponse(res, {
      status: 200,
      message: "Items retrieved successfully",
      data: items,
    });
  } catch (error) {
    handleException(res, error);
  }
};

/**
 * Get item by ID controller
 */
const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const item = await itemsService.getItemById(id);

    if (!item) {
      handleResponse(res, {
        status: 404,
        message: `Item with id ${req.params.id} not found`,
        data: {},
      });
      return;
    }

    handleResponse(res, {
      status: 200,
      message: "Item retrieved successfully",
      data: item,
    });
  } catch (error) {
    handleException(res, error);
  }
};

/**
 * Create item controller
 */
const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    if (!url) {
      handleResponse(res, {
        status: 400,
        message: "URL is required",
        data: {},
      });
      return;
    }

    const createdItem = await itemsService.createItem(req.body);

    if (!createdItem) {
      handleResponse(res, {
        status: 400,
        message: "Failed to create item",
        data: {},
      });
      return;
    }

    handleResponse(res, {
      status: 201,
      message: "Item created successfully",
      data: createdItem,
    });
  } catch (error) {
    handleException(res, error);
  }
};

/**
 * Update item controller
 */
const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const updated = await itemsService.updateItem(id, req.body);

    if (!updated) {
      handleResponse(res, {
        status: 404,
        message: `Item with id ${req.params.id} not found`,
        data: {},
      });
      return;
    }

    handleResponse(res, {
      status: 200,
      message: "Item updated successfully",
      data: updated,
    });
  } catch (error) {
    handleException(res, error);
  }
};

/**
 * Update status of favorite and markAsRead controller
 */
const updateItemStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { favorite, markAsRead } = req.body;

    if (favorite === undefined && markAsRead === undefined) {
      handleResponse(res, {
        status: 400,
        message: "Either 'favorite' or 'markAsRead' status must be provided",
        data: {},
      });
      return;
    }

    const updated = await itemsService.updateItemStatus(id, {
      favorite,
      markAsRead,
    });

    if (!updated) {
      handleResponse(res, {
        status: 404,
        message: `Item with id ${req.params.id} not found`,
        data: {},
      });
      return;
    }

    handleResponse(res, {
      status: 200,
      message: "Item status updated successfully",
      data: updated,
    });
  } catch (error) {
    handleException(res, error);
  }
};

/**
 * Archive item controller
 */
const archiveItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const isArchived =
      req.body?.isArchived !== undefined ? req.body.isArchived : true;
    const result = await itemsService.archiveItem(id, isArchived);

    if (!result) {
      handleResponse(res, {
        status: 404,
        message: `Item with id ${req.params.id} not found`,
        data: {},
      });
      return;
    }

    handleResponse(res, {
      status: 200,
      message: "Item archive status updated successfully",
      data: { itemsId: id, isArchived },
    });
  } catch (error) {
    handleException(res, error);
  }
};

/**
 * Delete item controller
 */
const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await itemsService.deleteItem(id);

    if (!result) {
      handleResponse(res, {
        status: 404,
        message: `Item with id ${req.params.id} not found`,
        data: {},
      });
      return;
    }

    handleResponse(res, {
      status: 200,
      message: "Item deleted successfully",
      data: { itemsId: id },
    });
  } catch (error) {
    handleException(res, error);
  }
};

export const itemsController = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  archiveItem,
  deleteItem,
};
