import { Worker } from "bullmq";
import fs from "fs";
import { promises as fsPromises } from "fs";
import csv from "csv-parser";

import logger from "../core/logger.js";
import { QUEUE_NAMES, redisConnection } from "../config/queue.js";
import { NormalizedEvent } from "../domains/events/eventModel.js";
import { normalizeCsvRow } from "../domains/ingest/csvNormalizer.js";

const BATCH_SIZE = 500;

const processCsvJob = async (job) => {
    const { uploadId, filePath } = job.data;

    logger.info(
        {
            jobId: job.id,
            uploadId,
        },
        "Worker started processing dataset"
    );

    return new Promise((resolve, reject) => {
        const batch = [];
        let processedCount = 0;

        const stream = fs.createReadStream(filePath).pipe(csv());

        stream.on("data", async (row) => {
            stream.pause();

            try {
                const event = normalizeCsvRow(uploadId, row);
                batch.push(event);

                if (batch.length >= BATCH_SIZE) {
                    const documents = [...batch];
                    batch.length = 0;

                    try {
                        await NormalizedEvent.insertMany(documents, {
                            ordered: false,
                        });

                        processedCount += documents.length;
                    } catch (error) {
                        if (error.code !== 11000) {
                            throw error;
                        }

                        logger.warn(
                            {
                                uploadId,
                            },
                            "Duplicate records detected while inserting batch."
                        );
                    }
                }

                stream.resume();
            } catch (error) {
                stream.destroy(error);
            }
        });

        stream.on("end", async () => {
            try {
                if (batch.length > 0) {
                    try {
                        await NormalizedEvent.insertMany(batch, {
                            ordered: false,
                        });

                        processedCount += batch.length;
                    } catch (error) {
                        if (error.code !== 11000) {
                            throw error;
                        }

                        logger.warn(
                            {
                                uploadId,
                            },
                            "Duplicate records detected in final batch."
                        );
                    }
                }

                logger.info(
                    {
                        uploadId,
                        processedCount,
                    },
                    "Dataset successfully processed."
                );

                resolve({
                    processedCount,
                });
            } catch (error) {
                reject(error);
            } finally {
                try {
                    await fsPromises.unlink(filePath);

                    logger.info(
                        {
                            uploadId,
                        },
                        "Temporary upload deleted."
                    );
                } catch (error) {
                    logger.warn(
                        {
                            uploadId,
                            filePath,
                            err: error.message,
                        },
                        "Unable to delete uploaded file."
                    );
                }
            }
        });

        stream.on("error", (error) => {
            logger.error(
                {
                    uploadId,
                    err: error.message,
                },
                "CSV parsing failed."
            );

            reject(error);
        });
    });
};

export const ingestWorker = new Worker(
    QUEUE_NAMES.INGESTION,
    processCsvJob,
    {
        connection: redisConnection,
        concurrency: 1,
    }
);

ingestWorker.on("completed", (job) => {
    logger.info(
        {
            jobId: job.id,
        },
        "Background job completed successfully."
    );
});

ingestWorker.on("failed", (job, err) => {
    logger.error(
        {
            jobId: job?.id,
            err: err.message,
        },
        "Background job failed."
    );
});