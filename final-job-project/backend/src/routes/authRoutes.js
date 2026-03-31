import express from 'express';
import { getMe, loginWithPassword, register, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginWithPassword);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);

export default router;
