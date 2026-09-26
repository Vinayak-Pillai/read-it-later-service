/**
 * Retrieve application health status
 */
const getHealthStatus = async () => {
    return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };
};
export const healthService = {
    getHealthStatus,
};
