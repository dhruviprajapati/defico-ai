import crypto from "crypto" ; 
import logger from "../../core/logger.js";
import { ingestQueue ,JOB_NAMES } from "../../config/queue.js";
import AppError from "../../core/AppError.js";

export const processDatasetUpload = async(file)=>{
    if(!file){
        throw new AppError("uploaded file is required" , 400);
    }
    const uploadId = crypto.randomUUID();
    logger.info({uploadId , filename :file.originalname} , "Dataset received by service");

    await ingestQueue.add(JOB_NAMES.PROCESS_DATASET ,{
        uploadId,
        filePath :file.path,
        originalName: file.originalname

    });

    logger.info({uploadId} ,"Job successfully pushed to IngestionQueue");

    return {uploadId};

}
