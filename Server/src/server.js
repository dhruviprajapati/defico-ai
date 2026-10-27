
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import logger from "./core/logger.js";
import connectDB from "./config/db.js";
import ingestRoutes from "./domains/ingest/ingestRoutes.js";
import "./workers/ingestWorker.js";

import AppError from "./core/AppError.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and request parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "Defico AI",
        timestamp: new Date().toISOString(),
    });
});

// Application routes
app.use("/ingest", ingestRoutes);

// Handle unknown routes
app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// Centralized error handler (must remain last)
app.use(errorHandler);

// Start server only after database connection succeeds
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`Defico AI Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
