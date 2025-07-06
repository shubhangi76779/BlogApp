import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ Extend Request type to include custom field
declare global {
    namespace Express {
        interface Request {
            image?: string;
        }
    }
}

export const fileUploadMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (req.file) {
            // ✅ Upload file using Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            // ✅ Store secure URL for later use
            req.image = result.secure_url;

            // ✅ Optional: remove file from server after upload
            fs.unlinkSync(req.file.path);
        }
        next();
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ message: "Image upload failed", error });
    }
};
