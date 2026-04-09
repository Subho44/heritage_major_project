import express from 'express';
import { analyzeresume } from '../controllers/resumeAiController.js';

const router = express.Router();


router.post('/analyze',analyzeresume);

export default router;