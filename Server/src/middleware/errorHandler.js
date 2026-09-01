import logger from "../core/logger.js"

const errorHandler = (err, req, res, next) => {
    // Log the error using Pino
    logger.error({
        message: err.message || "Unknown Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        method: req.method,
        url: req.originalUrl,
    });

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production" 
            ? "Internal Server Error" 
            : err.message || "Something went wrong",
    });
};

export default errorHandler;