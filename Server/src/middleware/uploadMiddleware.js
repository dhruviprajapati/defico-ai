import multer from "multer";
import AppError from "../core/AppError.js";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const allowedMimeTypes = [
    "text/csv",
    "application/vnd.ms-excel",
];

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
        const isCsv =
            allowedMimeTypes.includes(file.mimetype) &&
            file.originalname.toLowerCase().endsWith(".csv");

        if (!isCsv) {
            return cb(
                new AppError("Only CSV files are allowed.", 400),
                false
            );
        }

        cb(null, true);
    },
});

export default upload;