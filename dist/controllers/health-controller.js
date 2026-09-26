import * as healthService from "../services/health/index.js";
import { handleException, handleResponse } from "../utils/index.js";
/**
 * Health check controller
 */
export const getHealth = async (_req, res) => {
    try {
        const healthStatus = await healthService.getHealth();
        handleResponse(res, {
            status: 200,
            message: "Health check successful",
            data: {
                status: healthStatus.status,
                timestamp: healthStatus.timestamp,
                uptime: healthStatus.uptime,
            },
        });
    }
    catch (error) {
        handleException(res, error);
    }
};
