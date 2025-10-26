import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, IndianRupee, Calendar, Users, Target, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadImage } from '../services/upload';
import { campaignRequestAPI } from '../services/api';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect non-authenticated users
    if (!user) {
      alert('Please login to submit a campaign request.');
      navigate('/login');
    }
  }, [user, navigate]);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    image: '',
    goal: '',
    duration: '',
    featured: false,
    rewards: [],
  });
  const [reward, setReward] = useState({ title: '', description: '', amount: '', delivery: '' });

  const steps = [
    { number: 1, title: 'Project Basics', icon: Target },
    { number: 2, title: 'Funding & Timeline', icon: IndianRupee },
    { number: 3, title: 'Media & Content', icon: ImageIcon },
    { number: 4, title: 'Rewards', icon: Users },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRewardChange = (field: string, value: string) => {
    setReward(prev => ({ ...prev, [field]: value }));
  };

  const addReward = () => {
    if (reward.title && reward.amount && reward.description && reward.delivery) {
      setFormData(prev => ({
        ...prev,
        rewards: [...prev.rewards, { ...reward, amount: Number(reward.amount) }]
      }));
      setReward({ title: '', description: '', amount: '', delivery: '' });
    } else {
      alert('Please fill in all reward fields');
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

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      console.log('Uploading file:', file.name);
      const uploadedUrl = await uploadImage(file);
      console.log('Upload successful, URL:', uploadedUrl);
      setFormData(prev => ({ ...prev, image: uploadedUrl }));
      alert('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }
    // Basic URL validation
    try {
      new URL(imageUrl);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      alert('Image URL added successfully!');
    } catch {
      alert('Please enter a valid URL');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in all required fields in Project Basics');
      setCurrentStep(1);
      return;
    }

    if (!formData.goal || !formData.duration) {
      alert('Please fill in funding goal and duration');
      setCurrentStep(2);
      return;
    }

    if (!formData.image) {
      alert('Please upload a project image');
      setCurrentStep(3);
      return;
    }

    try {
      setLoading(true);
      const projectData = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription || formData.description,
        category: formData.category,
        image: formData.image,
        goal: Number(formData.goal),
        daysLeft: Number(formData.duration),
        featured: formData.featured,
        rewards: formData.rewards
      };

      await campaignRequestAPI.submit(projectData);
      alert('Campaign request submitted successfully! Your campaign will be reviewed by an admin.');
      navigate('/dashboard');
    } catch (error: any) {
      alert('Error creating project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit Campaign <span className="gradient-text">Request</span>
          </h1>
          <p className="text-xl text-gray-600">
            Submit your campaign for admin review and approval
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    Step {step.number}
                  </p>
                  <p
                    className={`text-sm ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {step.number < steps.length && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 ml-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Basics</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Give your project a compelling title"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project in detail. What problem does it solve? Why is it important?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding & Timeline</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Goal (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      placeholder="50000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Duration (days)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="30"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Funding Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Set a realistic goal based on your actual needs</li>
                  <li>• Consider platform fees and payment processing costs</li>
                  <li>• Research similar projects for goal benchmarking</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Media & Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image *
                </label>
                
                {/* Toggle between Upload and URL */}
                <div className="flex space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('upload')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      uploadMethod === 'upload'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Upload from Device
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      uploadMethod === 'url'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Paste Image URL
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadMethod === 'upload' ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload project image</p>
                      <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF up to 10MB</p>
                      <label className="cursor-pointer">
                        <span className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
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
                  ) : (
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                      <p className="text-gray-600 mb-3">Enter image URL</p>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={handleUrlSubmit}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add URL
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Paste a direct link to an image hosted online
                      </p>
                    </div>
                  )}
                  
                  {formData.image && (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Image failed to load:', formData.image);
                          alert('Failed to load image. Please try a different image or URL.');
                        }}
                        onLoad={() => console.log('Image loaded successfully')}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: '' }));
                          setImageUrl('');
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 break-all">
                        URL: {formData.image}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description (Optional)
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange('longDescription', e.target.value)}
                  placeholder="Provide a detailed description of your project..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Mark as Featured Project</label>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rewards</h2>
              
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-green-900 mb-2">Create Compelling Rewards</h3>
                <p className="text-sm text-green-800">
                  Offer meaningful rewards that motivate people to support your project at different contribution levels.
                </p>
              </div>

              {formData.rewards.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.rewards.map((r: any, index: number) => (
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

              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Add New Reward</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward Title
                    </label>
                    <input
                      type="text"
                      value={reward.title}
                      onChange={(e) => handleRewardChange('title', e.target.value)}
                      placeholder="Early Bird Special"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pledge Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={reward.amount}
                      onChange={(e) => handleRewardChange('amount', e.target.value)}
                      placeholder="25"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Description
                  </label>
                  <input
                    type="text"
                    value={reward.description}
                    onChange={(e) => handleRewardChange('description', e.target.value)}
                    placeholder="Describe what backers will receive..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery
                  </label>
                  <input
                    type="text"
                    value={reward.delivery}
                    onChange={(e) => handleRewardChange('delivery', e.target.value)}
                    placeholder="March 2025"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <button
                  type="button"
                  onClick={addReward}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Add This Reward
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mb-12">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Submit Campaign Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;