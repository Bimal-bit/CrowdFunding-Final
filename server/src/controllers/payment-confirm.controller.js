import Stripe from 'stripe';
import Project from '../models/Project.model.js';
import Payment from '../models/Payment.model.js';
import User from '../models/User.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// This endpoint is called by the frontend after successful payment
export const confirmPaymentAndUpdate = async (req, res) => {
  try {
    const { sessionId } = req.body;

    console.log('🔍 Confirming payment for session:', sessionId);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('📊 Session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      client_reference_id: session.client_reference_id,
      amount_total: session.amount_total
    });

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    const projectId = session.client_reference_id;
    const amount = session.amount_total / 100;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Anonymous Donor';

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'No project ID found in session'
      });
    }

    console.log('💰 Processing payment:', { projectId, amount, customerEmail });

    // Check if payment already processed
    const existingPayment = await Payment.findOne({ stripePaymentId: sessionId });
    if (existingPayment) {
      console.log('⚠️ Payment already processed');
      return res.status(200).json({
        success: true,
        message: 'Payment already processed',
        alreadyProcessed: true
      });
    }

    // Find or create user
    let user = await User.findOne({ email: customerEmail });
    if (!user) {
      user = await User.create({
        email: customerEmail,
        name: customerName,
        role: 'user',
        password: Math.random().toString(36).slice(-8)
      });
      console.log('✅ Created guest user:', user._id);
    }

    // Create payment record
    const payment = await Payment.create({
      user: user._id,
      project: projectId,
      amount: amount,
      stripePaymentId: sessionId,
      status: 'completed'
    });

    console.log('✅ Payment record created:', payment._id);

    // Update project using updateOne (completely bypasses all validation)
    await Project.updateOne(
      { _id: projectId },
      {
        $inc: { raised: amount, backers: 1 },
        $push: {
          updates: {
            title: 'New Donation Received',
            content: `${customerName} has donated ₹${amount.toLocaleString('en-IN')} to this project. Thank you for your support!`,
            type: 'announcement',
            createdAt: new Date()
          }
        }
      }
    );
    
    // Get the updated project
    const project = await Project.findById(projectId);
    
    if (!project) {
      console.error('❌ Project not found with ID:', projectId);
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    console.log('✅ Project updated successfully!');
    console.log('📊 New project data:', {
      newRaised: project.raised,
      newBackers: project.backers,
      updatesCount: project.updates.length
    });
    
    // Verify the update in database
    const verifyProject = await Project.findById(projectId);
    console.log('🔍 Verification - Database shows:', {
      raised: verifyProject.raised,
      backers: verifyProject.backers,
      lastUpdate: verifyProject.updates[verifyProject.updates.length - 1]?.title
    });
    
    console.log('🎉 Payment confirmation completed successfully!');

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and project updated',
      data: {
        paymentId: payment._id,
        projectId: project._id,
        newRaisedAmount: project.raised,
        newBackersCount: project.backers
      }
    });

  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm payment'
    });
  }
};
