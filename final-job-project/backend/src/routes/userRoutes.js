import express from 'express';
import { getMyResume, updateProfile, uploadUserResume } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/resume', protect, uploadResume.single('resume'), uploadUserResume);
router.get('/resume', protect, getMyResume);

export default router;
