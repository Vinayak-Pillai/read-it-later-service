import { Request, Response } from "express";
import { healthService } from "./health.service.js";
import { handleException, handleResponse } from "../../utils/index.js";

/**
 * Health check controller
 */
const getHealth = async (_req: Request, res: Response): Promise<void> => {
  try {
    const healthStatus = await healthService.getHealthStatus();
    handleResponse(res, {
      status: 200,
      message: "Health check successful",
      data: healthStatus,
    });
  } catch (error) {
    handleException(res, error);
  }
};

export const healthController = {
  getHealth,
};
