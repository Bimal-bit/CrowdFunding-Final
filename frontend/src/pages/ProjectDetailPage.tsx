import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Flag, Users, Calendar, Target, Award } from 'lucide-react';
import ProjectUpdates from '../components/Project/ProjectUpdates';
import ProjectComments from '../components/Project/ProjectComments';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Use real payment modal with Stripe integration
const PaymentModal = lazy(() => import('../components/Payment/PaymentModal'));

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('story');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states for icons
  const [liked, setLiked] = useState(false);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async (silent = false) => {
    try {
      console.log('Fetching project data for ID:', id, silent ? '(silent refresh)' : '');
      // Only show loading screen on initial load, not on refresh
      if (!silent) {
        setLoading(true);
      }
      const response = await projectsAPI.getById(id);
      console.log('Project data received:', response.data);
      setProject(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message || 'Failed to load project');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleShare = async () => {
    if (!project) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: project.description,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Project link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-xl">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Project not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);

  const handleBackProject = (reward: any) => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login with return URL
      alert('Please login to back this project');
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }
    
    setSelectedReward(reward);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Project Media */}
            <div>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Project Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </span>
                <div className="flex items-center space-x-2 ml-auto">
                  {/* Heart (Like) */}
                  <button onClick={() => setLiked(!liked)} className="p-2 transition-colors">
                    <Heart
                      className={`h-5 w-5 ${
                        liked
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    />
                  </button>

                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>

                  {/* Flag (Report) */}
                  <button onClick={() => setFlagged(!flagged)} className="p-2 transition-colors">
                    <Flag
                      className={`h-5 w-5 ${
                        flagged
                          ? 'text-orange-500 fill-orange-500'
                          : 'text-gray-600 hover:text-orange-500'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{project.description}</p>

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>₹{project.raised.toLocaleString('en-IN')} raised</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="progress-bar h-3 rounded-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  of ₹{project.goal.toLocaleString('en-IN')} goal
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{project.backers}</div>
                  <div className="text-sm text-gray-500">Backers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{project.daysLeft}</div>
                  <div className="text-sm text-gray-500">Days Left</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-500">Funded</div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={project.creator?.avatar || 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=200'}
                  alt={project.creator?.name || 'Creator'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{project.creator?.name || 'Project Creator'}</h4>
                  <p className="text-sm text-gray-600">
                    {project.creator?.email || 'Creator'}
                  </p>
                </div>
                <button className="ml-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Contact Creator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'story', label: 'Story' },
                    { id: 'updates', label: 'Updates' },
                    { id: 'comments', label: 'Comments' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'story' && (
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: project.longDescription }} />
                  </div>
                )}
                {activeTab === 'updates' && <ProjectUpdates projectId={id!} />}
                {activeTab === 'comments' && <ProjectComments />}
              </div>
            </div>
          </div>

          {/* Rewards Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Support This Project</h3>

              <div className="space-y-4">
                {project.rewards && project.rewards.length > 0 ? (
                  project.rewards.map((reward: any) => (
                    <div
                      key={reward._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{reward.title}</h4>
                        <span className="text-lg font-bold text-blue-600">₹{reward.amount}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <span>Delivery: {reward.delivery}</span>
                        <span>{reward.backers || 0} backers</span>
                      </div>
                      <button
                        onClick={() => handleBackProject(reward)}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                      >
                        Select Reward
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No rewards available</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleBackProject({ id: 0, title: 'Custom Amount', amount: 0 })}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Back Without Reward
                </button>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 text-center">
              <Award className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Featured Project</h4>
              <p className="text-sm text-gray-600">
                This project has been selected by our team for its innovation and impact potential.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="text-white">Loading...</div></div>}>
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            project={project}
            reward={selectedReward}
            onPaymentSuccess={() => fetchProject(true)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ProjectDetailPage;
