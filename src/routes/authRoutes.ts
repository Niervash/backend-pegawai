import { Router } from 'express';
import { login, getMe, updatePassword, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import { upload, processUpload } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), processUpload, updateProfile);
router.put('/update-password', protect, updatePassword);

export default router;
