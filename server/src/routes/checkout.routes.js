import express from 'express';
import { createCheckoutSession, getSessionDetails } from '../controllers/checkout.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create checkout session (protected - user must be logged in)
router.post('/create-session', protect, createCheckoutSession);

// Get session details
router.get('/session/:sessionId', getSessionDetails);

export default router;
