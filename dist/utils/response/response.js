/**
 * Handles HTTP responses with mandatory status, message, and data (object or array).
 */
export const handleResponse = (res, responseObj) => {
    return res.status(responseObj.status).json({
        status: responseObj.status,
        message: responseObj.message,
        data: responseObj.data,
    });
};
export const sendResponse = handleResponse;
