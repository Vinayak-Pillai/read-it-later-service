/**
 * Handles exceptions and returns HTTP 500 with 'something went wrong'
 */
export const handleException = (res, error, customMessage = "something went wrong") => {
    console.error("Handled exception:", error);
    return res.status(500).json({
        status: 500,
        message: customMessage,
        data: error instanceof Error && process.env.NODE_ENV !== "production"
            ? { error: error.message }
            : {},
    });
};
