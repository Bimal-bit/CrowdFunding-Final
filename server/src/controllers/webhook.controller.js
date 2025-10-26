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

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // For testing without webhook secret
      event = req.body;
    }

    console.log('📨 Webhook received:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('❌ Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

async function handleCheckoutSessionCompleted(session) {
  console.log('💳 Checkout session completed:', session.id);
  console.log('📊 Payment status:', session.payment_status);
  console.log('📊 Client reference ID:', session.client_reference_id);
  console.log('📊 Amount total:', session.amount_total);
  console.log('📊 Customer email:', session.customer_details?.email);

  try {
    // Extract data from session
    const projectId = session.client_reference_id;
    const amount = session.amount_total / 100; // Convert from cents to rupees
    const customerEmail = session.customer_details?.email;
    const stripeSessionId = session.id;

    console.log('🔍 Extracted data:', { projectId, amount, customerEmail, stripeSessionId });

    if (!projectId) {
      console.error('❌ No project ID in session');
      console.error('❌ Session metadata:', session.metadata);
      return;
    }

    console.log('Project ID:', projectId);
    console.log('Amount:', amount);
    console.log('Customer Email:', customerEmail);


    // Find or create user by email
    let user = await User.findOne({ email: customerEmail });
    if (!user) {
      // Create a guest user for this payment
      user = await User.create({
        email: customerEmail,
        name: session.customer_details?.name || 'Anonymous Donor',
        role: 'user',
        // Generate a random password (user can reset it later)
        password: Math.random().toString(36).slice(-8)
      });
      console.log('✅ Created guest user:', user._id);
    }

    // Check if payment already recorded
    const existingPayment = await Payment.findOne({ stripePaymentId: stripeSessionId });
    if (existingPayment) {
      console.log('⚠️ Payment already recorded');
      return;
    }

    // Create payment record
    const payment = await Payment.create({
      user: user._id,
      project: projectId,
      amount: amount,
      stripePaymentId: stripeSessionId,
      status: 'completed'
    });

    console.log('✅ Payment record created:', payment._id);

    // Update project
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        $inc: { raised: amount, backers: 1 }
      },
      { new: true, runValidators: false }
    );

    if (!project) {
      console.error('❌ Project not found:', projectId);
      return;
    }

    console.log('✅ Project updated. New raised amount:', project.raised);

    // Add donation update to project
    const donationUpdate = {
      title: 'New Donation Received',
      content: `${user.name} has donated ₹${amount.toLocaleString('en-IN')} to this project. Thank you for your support!`,
      type: 'announcement',
      createdAt: new Date()
    };

    await Project.findByIdAndUpdate(
      projectId,
      { $push: { updates: donationUpdate } },
      { runValidators: false }
    );

    console.log('✅ Donation update added to project');
    console.log('🎉 Webhook processing completed successfully!');

  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('💰 Payment intent succeeded:', paymentIntent.id);
  // This is handled by the existing confirmPayment endpoint
  // This webhook is just for logging/backup
}
