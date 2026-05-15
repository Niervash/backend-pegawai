import multer from 'multer';
import path from 'path';
// import sharp from 'sharp';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Setup storage in memory to process with sharp before saving
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB Limit
    fileFilter: fileFilter
});

export const processUpload = async (req: any, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join('uploads', fileName);

    try {
/*
        if (req.file.mimetype.startsWith('image/')) {
            // Compress Image
            await sharp(req.file.buffer)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(filePath);
        } else {
*/
            // Save PDF or other files directly from buffer
            fs.writeFileSync(filePath, req.file.buffer);
//      }

        // Attach the saved file path to req object
        req.file.path = `/uploads/${fileName}`;
        next();
    } catch (error) {
        next(error);
    }
};
