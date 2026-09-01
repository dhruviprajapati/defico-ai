import { processDatasetUpload} from "./ingestService.js";
import logger from "../../core/logger.js";
import AppError from "../../core/AppError.js";

export const uploadDataset = async(req,res ,next)=>{
    try {
        if(!req.file){
            throw new AppError("No dataste file provided", 400);
        }

        const result = await processDatasetUpload(req.file);
        return res.status(202).json({
            message :"Dataset received and queued for processing" , 
            data :result
        });
    } catch (error) {
        next(error); 
    }
}