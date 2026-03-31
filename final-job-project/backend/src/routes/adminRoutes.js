import express from 'express';
import { getAllUsers, getDashboardStats } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;
