import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { campaignRequestAPI } from '../services/api';
import { uploadImage } from '../services/upload';
import { Plus, X, Upload as UploadIcon } from 'lucide-react';

interface Reward {
  title: string;
  description: string;
  amount: number | string;
  delivery: string;
}

interface FormData {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  goal: string;
  daysLeft: string;
  featured: boolean;
  rewards: Reward[];
}

const AdminCreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    image: '',
    goal: '',
    daysLeft: '',
    featured: false,
    rewards: []
  });

  const [reward, setReward] = useState<Reward>({
    title: '',
    description: '',
    amount: '',
    delivery: ''
  });

  const isAdmin = user?.role === 'admin';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReward(prev => ({ ...prev, [name]: value }));
  };

  const addReward = () => {
    if (reward.title && reward.amount && reward.description && reward.delivery) {
      setFormData(prev => ({
        ...prev,
        rewards: [...prev.rewards, { ...reward, amount: Number(reward.amount) }]
      }));
      setReward({ title: '', description: '', amount: '', delivery: '' });
    }
  };

  const removeReward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      alert('Please upload a project image');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        ...formData,
        goal: Number(formData.goal),
        daysLeft: Number(formData.daysLeft)
      };

      await campaignRequestAPI.submit(requestData);
      
      if (isAdmin) {
        alert('Campaign request submitted successfully! As an admin, you can approve it from the admin dashboard.');
      } else {
        alert('Campaign request submitted successfully! Your campaign will be reviewed by an admin.');
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      alert('Error submitting campaign request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit Campaign <span className="gradient-text">Request</span>
          </h1>
          <p className="text-xl text-gray-600">
            Submit your campaign for admin review and approval
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="education">Education</option>
              <option value="health">Health & Wellness</option>
              <option value="environment">Environment</option>
              <option value="arts">Arts & Culture</option>
              <option value="community">Community</option>
              <option value="sports">Sports & Fitness</option>
              <option value="food">Food & Beverage</option>
              <option value="fashion">Fashion & Design</option>
              <option value="film">Film & Video</option>
              <option value="music">Music</option>
              <option value="gaming">Gaming</option>
              <option value="publishing">Publishing</option>
              <option value="photography">Photography</option>
              <option value="crafts">Crafts</option>
              <option value="theater">Theater</option>
              <option value="dance">Dance</option>
              <option value="comics">Comics</option>
              <option value="journalism">Journalism</option>
              <option value="agriculture">Agriculture</option>
              <option value="animals">Animals & Pets</option>
              <option value="travel">Travel & Adventure</option>
              <option value="social">Social Impact</option>
              <option value="business">Business & Entrepreneurship</option>
              <option value="science">Science & Research</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long Description (HTML)</label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Image *</label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload project image</p>
                <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF up to 10MB</p>
                <label className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.image && (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (₹) *</label>
              <input
                type="number"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Duration (days) *</label>
              <input
                type="number"
                name="daysLeft"
                value={formData.daysLeft}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Featured Project</label>
          </div>

          {/* Rewards Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rewards</h3>
            
            {formData.rewards.length > 0 && (
              <div className="space-y-3 mb-4">
                {formData.rewards.map((r, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold">{r.title} - ₹{r.amount}</p>
                      <p className="text-sm text-gray-600">{r.description}</p>
                      <p className="text-xs text-gray-500">Delivery: {r.delivery}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeReward(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="title"
                value={reward.title}
                onChange={handleRewardChange}
                placeholder="Reward Title"
                className="px-4 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="number"
                name="amount"
                value={reward.amount}
                onChange={handleRewardChange}
                placeholder="Amount (₹)"
                className="px-4 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                name="description"
                value={reward.description}
                onChange={handleRewardChange}
                placeholder="Description"
                className="px-4 py-2 border border-gray-200 rounded-lg md:col-span-2"
              />
              <input
                type="text"
                name="delivery"
                value={reward.delivery}
                onChange={handleRewardChange}
                placeholder="Delivery Date (e.g., March 2025)"
                className="px-4 py-2 border border-gray-200 rounded-lg md:col-span-2"
              />
            </div>

            <button
              type="button"
              onClick={addReward}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Reward</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Campaign Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProject;
