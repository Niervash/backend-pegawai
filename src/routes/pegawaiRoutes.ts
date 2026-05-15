import { Router } from 'express';
import {
    getAllPegawai,
    getPegawaiById,
    createPegawai,
    updatePegawai,
    deletePegawai,
    createAccountForPegawai
} from '../controllers/pegawaiController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { upload, processUpload } from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/', protect, getAllPegawai);
router.get('/:id', protect, getPegawaiById);
router.post('/', protect, authorize('admin'), upload.single('avatar'), processUpload, createPegawai);
router.put('/:id', protect, authorize('admin'), upload.single('avatar'), processUpload, updatePegawai);
router.delete('/:id', protect, authorize('admin'), deletePegawai);
router.post('/:id/create-account', protect, authorize('admin'), createAccountForPegawai);

export default router;
