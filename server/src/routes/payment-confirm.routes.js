import express from 'express';
import { confirmPaymentAndUpdate } from '../controllers/payment-confirm.controller.js';

const router = express.Router();

// Confirm payment and update project (called by frontend after successful payment)
router.post('/confirm-payment', confirmPaymentAndUpdate);

export default router;
