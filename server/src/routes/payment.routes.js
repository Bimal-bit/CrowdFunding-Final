import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { 
  createPaymentIntent, 
  confirmPayment, 
  getReceipt,
  getAllPayments,
  getUserPayments
} from '../controllers/payment.controller.js';

const router = express.Router();

// Public route for receipt download
router.get('/receipt/:paymentId', getReceipt);

// Protected routes
router.use(protect);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/my-payments', getUserPayments);

// Admin routes
router.get('/all', adminOnly, getAllPayments);

export default router;
