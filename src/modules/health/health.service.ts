import { HealthResponseDto } from "./dto/index.js";

/**
 * Retrieve application health status
 */
const getHealthStatus = async (): Promise<HealthResponseDto> => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
};

export const healthService = {
  getHealthStatus,
};
