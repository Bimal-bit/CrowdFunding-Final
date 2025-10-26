import Stripe from 'stripe';
import Payment from '../models/Payment.model.js';
import Project from '../models/Project.model.js';
import { generateReceipt } from '../utils/generateReceipt.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize Stripe with the loaded key
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY || STRIPE_KEY === 'sk_test_dummy') {
  console.error('❌ STRIPE_SECRET_KEY is not properly set!');
  console.error('Current value:', STRIPE_KEY ? STRIPE_KEY.substring(0, 15) + '...' : 'undefined');
}
const stripe = new Stripe(STRIPE_KEY || 'sk_test_dummy');

export const createPaymentIntent = async (req, res) => {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Payment system is not configured. Please contact administrator.' 
      });
    }

    const { amount, projectId, rewardId } = req.body;

    // Validate input
    if (!amount || !projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount and projectId are required' 
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure integer
      currency: 'inr', // Changed to INR for Indian Rupees
      metadata: {
        projectId,
        rewardId: rewardId || 'none',
        userId: req.user._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('❌ Payment Intent Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, projectId, rewardId, amount } = req.body;

    console.log('💳 Confirming payment:', { paymentIntentId, projectId, rewardId, amount, userId: req.user._id });

    // Validate input
    if (!paymentIntentId || !projectId || !amount) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Payment Intent ID, Project ID, and Amount are required' 
      });
    }

    // Verify payment with Stripe
    console.log('🔍 Verifying payment with Stripe...');
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      console.error('❌ Payment not succeeded. Status:', paymentIntent.status);
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    console.log('✅ Payment verified with Stripe');

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ stripePaymentId: paymentIntentId });
    if (existingPayment) {
      console.log('⚠️ Payment already recorded:', existingPayment._id);
      return res.status(200).json({
        success: true,
        data: existingPayment,
        message: 'Payment already recorded'
      });
    }

    // Create payment record
    console.log('💾 Creating payment record in database...');
    const payment = await Payment.create({
      user: req.user._id,
      project: projectId,
      amount,
      reward: rewardId || null,
      stripePaymentId: paymentIntentId,
      status: 'completed'
    });

    console.log('✅ Payment record created:', payment._id);

    // Update project using findByIdAndUpdate to avoid validation issues
    console.log('📊 Updating project stats...');
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        $inc: { raised: amount, backers: 1 }
      },
      { new: true, runValidators: false }
    );

    if (!project) {
      console.error('❌ Project not found:', projectId);
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    console.log('✅ Project updated. New raised amount:', project.raised);

    // Update reward backers if applicable
    if (rewardId) {
      console.log('🎁 Updating reward backers...');
      await Project.findOneAndUpdate(
        { _id: projectId, 'rewards._id': rewardId },
        { $inc: { 'rewards.$.backers': 1 } },
        { runValidators: false }
      );
    }

    // Add donation update to project updates
    console.log('📝 Adding donation update to project...');
    const donationUpdate = {
      title: 'New Donation Received',
      content: `${req.user.name} has donated ₹${amount.toLocaleString('en-IN')} to this project. Thank you for your support!`,
      type: 'announcement',
      createdAt: new Date()
    };
    
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { updates: donationUpdate } },
      { runValidators: false }
    );
    console.log('✅ Donation update added to project');

    // Generate receipt
    console.log('📄 Generating receipt...');
    const receiptUrl = await generateReceipt(payment, req.user, project);
    payment.receiptUrl = receiptUrl;
    
    await payment.save();

    // Generate download URL
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const receiptDownloadUrl = `${backendUrl}/api/payments/receipt/${payment._id}`;
    
    console.log('✅ Receipt generated for payment:', payment._id);
    console.log('📥 Receipt download URL:', receiptDownloadUrl);
    console.log('✅ Payment process completed successfully!');

    res.status(200).json({
      success: true,
      data: payment,
      receiptUrl,
      receiptDownloadUrl,
      message: 'Payment successful! Download your receipt.'
    });
  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all payments (for debugging/admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's payments
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('project', 'title image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('user', 'name email')
      .populate('project', 'title');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    if (!payment.receiptUrl) {
      return res.status(404).json({ success: false, message: 'Receipt not generated yet' });
    }

    const receiptPath = path.join(__dirname, '../../', payment.receiptUrl);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt_${payment._id}.pdf"`);
    
    res.download(receiptPath, `FundRise_Receipt_${payment.user.name.replace(/\s+/g, '_')}.pdf`, (err) => {
      if (err) {
        console.error('Error downloading receipt:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Error downloading receipt' });
        }
      }
    });
  } catch (error) {
    console.error('Receipt download error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
