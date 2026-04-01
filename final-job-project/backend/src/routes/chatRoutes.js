import express from 'express';
import { getMessages,saveMessages} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

;
router.post('/',protect,saveMessages);
router.get('/:receiverId', protect, getMessages);

export default router;
