import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, campaignRequestAPI } from '../services/api';
import { Plus, Edit, Trash2, TrendingUp, Users, IndianRupee, Folder, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  totalRaised: number;
}

interface Project {
  _id: string;
  title: string;
  category: string;
  goal: number;
  raised: number;
  status: 'active' | 'successful' | 'draft' | 'failed';
}

interface Reward {
  title: string;
  description: string;
  amount: number;
  delivery: string;
  backers: number;
}

interface CampaignRequest {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  image: string;
  goal: number;
  daysLeft: number;
  featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  creator: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  rewards?: Reward[];
  adminNotes?: string;
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewedAt?: string;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [campaignRequests, setCampaignRequests] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, projectsRes, requestsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllProjects(),
        campaignRequestAPI.getAll('pending')
      ]);
      setStats(statsRes.data);
      setProjects(projectsRes.data);
      setCampaignRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await adminAPI.deleteProject(id);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error: any) {
      alert('Error deleting project: ' + error.message);
    }
  };

  const handleApproveRequest = async (id: string) => {
    const notes = prompt('Add admin notes (optional):');
    if (notes === null) return; // User cancelled
    
    try {
      const response = await campaignRequestAPI.approve(id, notes);
      alert('Campaign request approved successfully! A certificate has been generated for the creator.');
      console.log('Certificate URL:', response.data.certificateDownloadUrl);
      fetchData(); // Refresh data
    } catch (error: any) {
      alert('Error approving request: ' + error.message);
    }
  };

  const handleRejectRequest = async (id: string) => {
    const notes = prompt('Reason for rejection:');
    if (!notes) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    try {
      await campaignRequestAPI.reject(id, notes);
      alert('Campaign request rejected');
      fetchData(); // Refresh data
    } catch (error: any) {
      alert('Error rejecting request: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600">Manage projects and monitor platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Folder className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{stats?.totalProjects || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Projects</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{stats?.activeProjects || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Active Projects</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{stats?.totalUsers || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Users</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <IndianRupee className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                ₹{(stats?.totalRaised || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Total Raised</p>
          </div>
        </div>

        {/* Pending Campaign Requests Section */}
        {campaignRequests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Pending Campaign Requests ({campaignRequests.length})
              </h2>
            </div>

            <div className="space-y-4">
              {campaignRequests.map((request) => (
                <div key={request._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {request.image && (
                            <img 
                              src={request.image} 
                              alt={request.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                            <p className="text-sm text-gray-700 mt-1 line-clamp-2">{request.description}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="text-sm text-gray-600">
                                <strong>Category:</strong> {request.category}
                              </span>
                              <span className="text-sm text-gray-600">
                                <strong>Goal:</strong> ₹{request.goal.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-600">
                                <strong>Duration:</strong> {request.daysLeft} days
                              </span>
                              {request.featured && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              <strong>Submitted by:</strong> {request.creator.name} ({request.creator.email})
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleApproveRequest(request._id)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
                          className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                          {expandedRequest === request._id ? (
                            <><ChevronUp className="h-4 w-4" /><span>Less</span></>
                          ) : (
                            <><ChevronDown className="h-4 w-4" /><span>More</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedRequest === request._id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <div className="space-y-4">
                        {/* Long Description */}
                        {request.longDescription && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Detailed Description</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.longDescription}</p>
                          </div>
                        )}
                        
                        {/* Rewards */}
                        {request.rewards && request.rewards.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Rewards ({request.rewards.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {request.rewards.map((reward, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-semibold text-gray-900">{reward.title}</h5>
                                    <span className="text-green-600 font-bold">₹{reward.amount}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{reward.description}</p>
                                  <p className="text-xs text-gray-500">
                                    <strong>Delivery:</strong> {reward.delivery}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Campaign ID</p>
                            <p className="text-sm text-gray-900 font-mono">{request._id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Creator ID</p>
                            <p className="text-sm text-gray-900 font-mono">{request.creator._id}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
            <button
              onClick={() => navigate('/admin/create-project')}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Submit Campaign Request</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Goal</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Raised</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{project.title}</td>
                    <td className="py-3 px-4">{project.category}</td>
                    <td className="py-3 px-4">₹{project.goal.toLocaleString()}</td>
                    <td className="py-3 px-4">₹{project.raised.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'successful' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/admin/edit-project/${project._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
