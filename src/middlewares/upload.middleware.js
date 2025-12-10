import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config Loaded:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tickify',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        const error = new Error("Only images are allowed");
        error.statusCode = StatusCodes.BAD_REQUEST;
        cb(error, false);
    }
};

const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
};

export const upload = multer({ storage, fileFilter, limits });
