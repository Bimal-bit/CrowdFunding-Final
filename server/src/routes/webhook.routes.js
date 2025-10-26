import express from 'express';
import { handleStripeWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// Stripe webhook endpoint
// IMPORTANT: This must be BEFORE express.json() middleware
// Raw body is needed for webhook signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
