import { Request, Response } from 'express';
import DokumenPenting from '../models/DokumenPenting';

export const getAllDokumen = async (req: Request, res: Response) => {
    try {
        const data = await DokumenPenting.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createDokumen = async (req: any, res: Response) => {
    try {
        const { name } = req.body;
        const file_url = req.file?.path;
        
        if (!file_url) {
            return res.status(400).json({ success: false, message: 'File is required' });
        }

        const type = req.file.originalname.split('.').pop()?.toUpperCase() || 'PDF';
        const size = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';

        const data = await DokumenPenting.create({
            name: name || req.file.originalname.split('.')[0],
            type,
            size,
            file_url
        });

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteDokumen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await DokumenPenting.destroy({ where: { id } });
        if (deleted) {
            return res.json({ success: true, message: 'Document deleted' });
        }
        res.status(404).json({ success: false, message: 'Document not found' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
