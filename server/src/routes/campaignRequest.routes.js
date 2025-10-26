import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  submitCampaignRequest,
  getMyCampaignRequests,
  getAllCampaignRequests,
  getCampaignRequest,
  approveCampaignRequest,
  rejectCampaignRequest,
  deleteCampaignRequest,
  getCertificate
} from '../controllers/campaignRequest.controller.js';

const router = express.Router();

// User routes (authenticated users)
router.post('/', protect, submitCampaignRequest);
router.get('/my-requests', protect, getMyCampaignRequests);
router.get('/:id', protect, getCampaignRequest);
router.delete('/:id', protect, deleteCampaignRequest);

// Admin routes
router.get('/', protect, adminOnly, getAllCampaignRequests);
router.put('/:id/approve', protect, adminOnly, approveCampaignRequest);
router.put('/:id/reject', protect, adminOnly, rejectCampaignRequest);

// Certificate route (creator or admin can download)
router.get('/certificate/:id', protect, getCertificate);

export default router;
