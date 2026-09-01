import { Queue } from "bullmq";
import logger from "../core/logger.js";

export const QUEUE_NAMES = {
    INGESTION: "IngestionQueue",
};

export const JOB_NAMES = {
    PROCESS_DATASET: "processDatasetJob",
};

export const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
};

const DEFAULT_JOB_OPTIONS = {
    attempts: 3,
    backoff: {
        type: "exponential",
        delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
};

export const ingestQueue = new Queue(QUEUE_NAMES.INGESTION, {
    connection: redisConnection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

logger.info(
    {
        queue: QUEUE_NAMES.INGESTION,
        host: redisConnection.host,
        port: redisConnection.port,
    },
    "BullMQ queue initialized"
);