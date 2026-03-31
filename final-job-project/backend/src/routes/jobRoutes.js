import express from 'express';
import { createJob, deleteJob, getJobs, getRecruiterJobs, updateJob } from '../controllers/jobController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
