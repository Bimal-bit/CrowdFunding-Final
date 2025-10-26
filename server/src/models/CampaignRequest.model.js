import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  delivery: { type: String, required: true },
  backers: { type: Number, default: 0 }
});

const campaignRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String, required: true },
  image: { type: String, required: true },
  goal: { type: Number, required: true },
  daysLeft: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewards: [rewardSchema],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminNotes: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  certificateUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CampaignRequest', campaignRequestSchema);
