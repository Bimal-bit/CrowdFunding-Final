import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true },
  reward: { type: mongoose.Schema.Types.ObjectId },
  stripePaymentId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  receiptUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
