import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  delivery: { type: String, required: true },
  backers: { type: Number, default: 0 }
});

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['milestone', 'announcement', 'media'], default: 'announcement' },
  image: { type: String },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String, required: true },
  image: { type: String, required: true },
  goal: { type: Number, required: true },
  raised: { type: Number, default: 0 },
  backers: { type: Number, default: 0 },
  daysLeft: { type: Number, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'successful', 'failed', 'draft'], default: 'active' },
  verified: { type: Boolean, default: true }, // Projects created from approved requests are verified
  featured: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewards: [rewardSchema],
  updates: [updateSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);
