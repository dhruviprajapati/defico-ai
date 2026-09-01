import express from "express";
import upload from "../../middleware/uploadMiddleware.js";
import { uploadDataset } from "./ingestController.js";

const router = express.Router();

router.post("/dataset", upload.single("dataset"), uploadDataset);

export default router;