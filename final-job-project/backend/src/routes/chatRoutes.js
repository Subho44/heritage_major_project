import express from 'express';
import { getConversation, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:userId', protect, getConversation);

export default router;
