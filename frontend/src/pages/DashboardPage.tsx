import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart as BarChartIcon, Users, TrendingUp, IndianRupee , Plus, Eye, Edit, Mail, User as UserIcon, Calendar, Activity, Target, Award, Bell, Download, CheckCircle, Camera, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { campaignRequestAPI, userAPI } from '../services/api';
import { uploadImage } from '../services/upload';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isAdmin, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [campaignRequests, setCampaignRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [backedProjects, setBackedProjects] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBacked, setLoadingBacked] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileData, setProfileData] = useState({ name: '', email: '', avatar: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Fetch user stats
  const fetchUserStats = async () => {
    if (!user) return;
    setLoadingStats(true);
    try {
      const response = await userAPI.getStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default values on error
      setUserStats({
        totalRaised: 0,
        totalBackers: 0,
        projectsCreated: 0,
        successRate: 0,
        totalContributed: 0,
        projectsBacked: 0
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  // Auto-refresh data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Dashboard visible - refreshing all data...');
        fetchUserStats();
        fetchUserProjects();
        fetchBackedProjects();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Fetch user projects
  const fetchUserProjects = async () => {
    if (!user) return;
    setLoadingProjects(true);
    try {
      const response = await userAPI.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching user projects:', error);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, [user]);

  // Fetch backed projects
  const fetchBackedProjects = async () => {
    if (!user) return;
    setLoadingBacked(true);
    try {
      const response = await userAPI.getBackedProjects();
      setBackedProjects(response.data);
    } catch (error) {
      console.error('Error fetching backed projects:', error);
      setBackedProjects([]);
    } finally {
      setLoadingBacked(false);
    }
  };

  useEffect(() => {
    fetchBackedProjects();
  }, [user, refreshTrigger]);

  // Auto-refresh disabled - data will only refresh on visibility change or manual action

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      setLoadingAnalytics(true);
      try {
        const response = await userAPI.getAnalytics();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Set default empty analytics
        setAnalyticsData({
          fundingProgressData: [],
          backerGrowthData: [],
          projectStatusData: [],
          monthlyContributionsData: [],
          categoryPerformanceData: []
        });
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  // Handler functions
  const handleCreateProject = () => {
    if (!isAdmin()) {
      alert('You must be an admin to create projects. Please contact support to upgrade your account.');
      return;
    }
    navigate('/admin/projects/new');
  };

  const handleEditProfile = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    });
    setShowEditProfile(true);
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleNotificationSettings = () => {
    setShowNotificationSettings(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setUploadingAvatar(true);
      const uploadedUrl = await uploadImage(file);
      
      // Update profile with new avatar
      await userAPI.updateProfile({ avatar: uploadedUrl });
      
      // Refresh user context
      await refreshUser();
      
      setShowAvatarModal(false);
      alert('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      alert('Error uploading profile picture: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarUrlSubmit = async () => {
    if (!avatarUrl) {
      alert('Please enter an image URL');
      return;
    }

    try {
      new URL(avatarUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    try {
      setUploadingAvatar(true);
      await userAPI.updateProfile({ avatar: avatarUrl });
      
      // Refresh user context
      await refreshUser();
      
      setShowAvatarModal(false);
      setAvatarUrl('');
      alert('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Avatar URL update error:', error);
      alert('Error updating profile picture: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await userAPI.updateProfile(profileData);
      
      // Refresh user data
      await refreshUser();
      
      alert('Profile updated successfully!');
      setShowEditProfile(false);
    } catch (error: any) {
      alert('Error updating profile: ' + error.message);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await userAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      alert('Error changing password: ' + error.message);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Notification settings saved!');
    setShowNotificationSettings(false);
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditProject = (projectId: number) => {
    if (!isAdmin()) {
      alert('You must be an admin to edit projects.');
      return;
    }
    navigate(`/admin/projects/edit/${projectId}`);
  };

  // Fetch user's campaign requests
  useEffect(() => {
    const fetchCampaignRequests = async () => {
      if (!user) return;
      setLoadingRequests(true);
      try {
        const response = await campaignRequestAPI.getMyRequests();
        setCampaignRequests(response.data);
      } catch (error) {
        console.error('Error fetching campaign requests:', error);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchCampaignRequests();
  }, [user]);

  const handleDownloadCertificate = async (requestId: string, title: string) => {
    try {
      const response = await campaignRequestAPI.getCertificate(requestId);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FundRise_Certificate_${title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error downloading certificate');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, <span className="gradient-text">{user?.name || 'User'}</span>
          </h1>
          <p className="text-xl text-gray-600">
            Manage your projects and track your impact
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {loadingStats ? (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-500">Loading stats...</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <IndianRupee  className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    ₹{userStats?.totalRaised?.toLocaleString('en-IN') || 0}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Total Raised</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {userStats?.totalBackers?.toLocaleString() || 0}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Total Backers</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <BarChartIcon className="h-8 w-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {userStats?.projectsCreated || 0}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Projects Created</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">
                    {userStats?.successRate || 0}%
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Success Rate</p>
              </div>
            </>
          )}
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'projects', label: 'My Projects' },
                { id: 'backed', label: 'Backed Projects' },
                { id: 'analytics', label: 'Analytics' },
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

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Profile</h3>
                
                {/* User Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative group">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="bg-white p-4 rounded-full">
                          <UserIcon className="h-16 w-16 text-blue-600" />
                        </div>
                      )}
                      <button
                        onClick={() => setShowAvatarModal(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="h-8 w-8 text-white" />
                      </button>
                      {uploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h2>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{user?.email || 'N/A'}</span>
                        </div>
                        {isAdmin() && (
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Click on the avatar to upload a new profile picture</p>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                      <span>Account Information</span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{user?.name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">{user?.email || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-medium text-gray-900">{isAdmin() ? 'Administrator' : 'Regular User'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-mono text-xs text-gray-600">{user?._id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span>Account Status</span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-medium text-gray-900">Today</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={handleEditProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Change Password
                    </button>
                    <button 
                      onClick={handleNotificationSettings}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Notification Settings
                    </button>
                  </div>
                </div>

                {/* Edit Profile Form */}
                {showEditProfile && (
                  <div className="mt-6 bg-white rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Edit Profile</h4>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEditProfile(false)}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Change Password Form */}
                {showChangePassword && (
                  <div className="mt-6 bg-white rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
                    <form onSubmit={handleSavePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                          minLength={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                          minLength={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Change Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowChangePassword(false)}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notification Settings Form */}
                {showNotificationSettings && (
                  <div className="mt-6 bg-white rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Notification Settings</h4>
                    <form onSubmit={handleSaveNotifications} className="space-y-4">
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Email notifications for new backers</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Email notifications for project updates</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Weekly summary emails</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Marketing and promotional emails</span>
                        </label>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save Settings
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNotificationSettings(false)}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Bell className="h-6 w-6 text-blue-600" />
                  <span>Notifications</span>
                </h3>

                {loadingRequests ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading notifications...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Approved Campaign Certificates */}
                    {campaignRequests.filter((req: any) => req.status === 'approved' && req.certificateUrl).length > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Campaign Approvals - Certificates Available</span>
                        </h4>
                        <div className="space-y-3">
                          {campaignRequests
                            .filter((req: any) => req.status === 'approved' && req.certificateUrl)
                            .map((request: any) => (
                              <div key={request._id} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900 mb-1">{request.title}</h5>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Your campaign has been approved! Download your certificate below.
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span>Category: {request.category}</span>
                                      <span>Goal: ₹{request.goal?.toLocaleString()}</span>
                                      <span>Approved: {new Date(request.reviewedAt).toLocaleDateString()}</span>
                                    </div>
                                    {request.adminNotes && (
                                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-gray-700">
                                        <strong>Admin Note:</strong> {request.adminNotes}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleDownloadCertificate(request._id, request.title)}
                                    className="ml-4 flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span>Download Certificate</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Pending Campaign Requests */}
                    {campaignRequests.filter((req: any) => req.status === 'pending').length > 0 && (
                      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <Bell className="h-5 w-5 text-yellow-600" />
                          <span>Pending Campaign Requests</span>
                        </h4>
                        <div className="space-y-3">
                          {campaignRequests
                            .filter((req: any) => req.status === 'pending')
                            .map((request: any) => (
                              <div key={request._id} className="bg-white rounded-lg p-4 border border-gray-200">
                                <h5 className="font-semibold text-gray-900 mb-1">{request.title}</h5>
                                <p className="text-sm text-gray-600 mb-2">
                                  Your campaign request is under review by our admin team.
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Category: {request.category}</span>
                                  <span>Goal: ₹{request.goal?.toLocaleString()}</span>
                                  <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Rejected Campaign Requests */}
                    {campaignRequests.filter((req: any) => req.status === 'rejected').length > 0 && (
                      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <Bell className="h-5 w-5 text-red-600" />
                          <span>Rejected Campaign Requests</span>
                        </h4>
                        <div className="space-y-3">
                          {campaignRequests
                            .filter((req: any) => req.status === 'rejected')
                            .map((request: any) => (
                              <div key={request._id} className="bg-white rounded-lg p-4 border border-gray-200">
                                <h5 className="font-semibold text-gray-900 mb-1">{request.title}</h5>
                                <p className="text-sm text-gray-600 mb-2">
                                  Unfortunately, your campaign request was not approved.
                                </p>
                                {request.adminNotes && (
                                  <div className="mt-2 p-2 bg-red-50 rounded text-sm text-gray-700">
                                    <strong>Reason:</strong> {request.adminNotes}
                                  </div>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                                  <span>Category: {request.category}</span>
                                  <span>Goal: ₹{request.goal?.toLocaleString()}</span>
                                  <span>Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* No Notifications */}
                    {campaignRequests.length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg font-medium mb-2">No notifications yet</p>
                        <p className="text-gray-500">
                          Submit a campaign request to get started!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Projects</h3>
                  <button 
                    onClick={handleCreateProject}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </button>
                </div>

                {loadingProjects ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <BarChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium mb-2">No projects yet</p>
                    <p className="text-gray-500 mb-4">
                      Create your first project to start raising funds!
                    </p>
                    <button 
                      onClick={() => navigate('/create-project')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Campaign Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project: any) => (
                      <div key={project._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              project.status === 'active' ? 'bg-green-100 text-green-800' :
                              project.status === 'successful' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewProject(project._id)}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                              title="View Project"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {isAdmin() && (
                              <button 
                                onClick={() => handleEditProject(project._id)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Edit Project"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Raised</p>
                            <p className="font-semibold">₹{(project.raised || 0).toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Goal</p>
                            <p className="font-semibold">₹{(project.goal || 0).toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Backers</p>
                            <p className="font-semibold">{project.backers || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Days Left</p>
                            <p className="font-semibold">{project.daysLeft || 0}</p>
                          </div>
                        </div>

                        {project.status === 'active' && (
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="progress-bar h-2 rounded-full"
                                style={{ width: `${Math.min(((project.raised || 0) / (project.goal || 1)) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'backed' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Projects You've Backed</h3>
                {loadingBacked ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading backed projects...</p>
                  </div>
                ) : backedProjects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium mb-2">No contributions yet</p>
                    <p className="text-gray-500 mb-4">
                      Start supporting amazing projects!
                    </p>
                    <button 
                      onClick={() => navigate('/projects')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Projects
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {backedProjects.map((payment: any) => (
                      <div key={payment._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{payment.project?.title || 'Project'}</h4>
                            <p className="text-gray-600 text-sm mt-1">{payment.project?.category || 'N/A'}</p>
                            {payment.project?.description && (
                              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{payment.project.description}</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-lg font-bold text-green-600">₹{payment.amount?.toLocaleString('en-IN') || 0}</p>
                            <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Analytics Dashboard</h3>
                
                {loadingAnalytics ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading analytics...</p>
                  </div>
                ) : !analyticsData || (analyticsData.fundingProgressData?.length === 0 && analyticsData.backerGrowthData?.length === 0) ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium mb-2">No analytics data yet</p>
                    <p className="text-gray-500">
                      Create projects and get backers to see your analytics!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Key Metrics Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium mb-1">Avg. Funding Rate</p>
                        <p className="text-2xl font-bold text-blue-900">₹24,167/month</p>
                      </div>
                      <Activity className="h-10 w-10 text-blue-600 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium mb-1">Goal Achievement</p>
                        <p className="text-2xl font-bold text-green-900">96.7%</p>
                      </div>
                      <Target className="h-10 w-10 text-green-600 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium mb-1">Top Performer</p>
                        <p className="text-lg font-bold text-purple-900">Smart Learning</p>
                      </div>
                      <Award className="h-10 w-10 text-purple-600 opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Funding Progress - Area Chart */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Funding Progress Over Time</span>
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData?.fundingProgressData || []}>
                        <defs>
                          <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                          formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="raised" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRaised)" name="Amount Raised" />
                        <Area type="monotone" dataKey="goal" stroke="#10b981" fillOpacity={1} fill="url(#colorGoal)" name="Goal" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Backer Growth - Line Chart */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span>Backer Growth Trend</span>
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData?.backerGrowthData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="backers" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Total Backers"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Performance - Bar Chart */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <BarChartIcon className="h-5 w-5 text-purple-600" />
                      <span>Category Performance</span>
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData?.categoryPerformanceData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="category" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                          formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                        />
                        <Legend />
                        <Bar dataKey="raised" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Amount Raised">
                          <Cell fill="#3b82f6" />
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Project Status Distribution - Pie Chart */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-orange-600" />
                      <span>Project Status Distribution</span>
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData?.projectStatusData || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(analyticsData?.projectStatusData || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Contributions - Full Width Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                    <span>Monthly Contribution Activity</span>
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData?.monthlyContributionsData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="contributions" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Number of Contributions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Insights Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h5 className="font-semibold text-gray-900 mb-2">📈 Key Insight</h5>
                    <p className="text-gray-700 text-sm">
                      Your backer growth rate increased by 17% in the last month. The Smart Learning Platform project is driving the most engagement.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h5 className="font-semibold text-gray-900 mb-2">💡 Recommendation</h5>
                    <p className="text-gray-700 text-sm">
                      Consider launching a new project in the Education category, which shows the highest funding success rate at 150% of goal.
                    </p>
                  </div>
                </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Update Profile Picture</h3>
              <button 
                onClick={() => {
                  setShowAvatarModal(false);
                  setAvatarUrl('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Upload from Device */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Upload from Device</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Click to upload image</p>
                  <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF up to 5MB</p>
                  <label className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      {uploadingAvatar ? 'Uploading...' : 'Choose File'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Paste Image URL</label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={uploadingAvatar}
                  />
                  <button
                    onClick={handleAvatarUrlSubmit}
                    disabled={uploadingAvatar || !avatarUrl}
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingAvatar ? 'Updating...' : 'Update from URL'}
                  </button>
                </div>
              </div>

              {/* Preview */}
              {avatarUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="flex justify-center">
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;