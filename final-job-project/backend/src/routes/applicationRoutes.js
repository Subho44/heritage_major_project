import express from 'express';
import {
  applyToJob,
  getApplicationsForRecruiter,
  getMyApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, authorize('jobseeker'), applyToJob);
router.get('/my/list', protect, authorize('jobseeker'), getMyApplications);
router.get('/recruiter/list', protect, authorize('recruiter', 'admin'), getApplicationsForRecruiter);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

export default router;
