import Stripe from 'stripe';
import Project from '../models/Project.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

export const createCheckoutSession = async (req, res) => {
  try {
    const { projectId, amount, rewardId } = req.body;

    console.log('Creating checkout session:', { projectId, amount, rewardId });

    // Validate input
    if (!projectId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and amount are required'
      });
    }

    // Get project details
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Donation to: ${project.title}`,
              description: project.description,
              images: project.image ? [project.image] : [],
            },
            unit_amount: Math.round(amount * 100), // Convert to paise (cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/project/${projectId}`,
      client_reference_id: projectId,
      metadata: {
        projectId: projectId,
        rewardId: rewardId || 'none',
        userId: req.user?._id?.toString() || 'guest',
      },
    });

    console.log('✅ Checkout session created:', session.id);

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('❌ Checkout session error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json({
      success: true,
      session: {
        id: session.id,
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total / 100,
        projectId: session.client_reference_id,
      },
    });
  } catch (error) {
    console.error('❌ Error retrieving session:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
