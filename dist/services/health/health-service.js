/**
 * Service to retrieve current application health status
 */
export const getHealth = async () => {
    return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };
};
