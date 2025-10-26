import React, { useState, useEffect } from 'react';
import { Calendar, Video, Edit, Trash2, Plus, X } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../services/upload';

interface ProjectUpdatesProps {
  projectId: string;
}

const ProjectUpdates: React.FC<ProjectUpdatesProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    image: '',
    videoUrl: ''
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchUpdates();
  }, [projectId]);

  // Re-fetch updates when component remounts (e.g., after payment)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUpdates();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getUpdates(projectId);
      setUpdates(response.data || []);
    } catch (error: any) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
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
    
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      if (editingUpdate) {
        await projectsAPI.updateUpdate(projectId, editingUpdate._id, formData);
        alert('Update modified successfully!');
      } else {
        await projectsAPI.addUpdate(projectId, formData);
        alert('Update added successfully!');
      }
      
      setShowAddModal(false);
      setEditingUpdate(null);
      setFormData({ title: '', content: '', type: 'announcement', image: '', videoUrl: '' });
      fetchUpdates();
    } catch (error: any) {
      alert('Error saving update: ' + error.message);
    }
  };

  const handleEdit = (update: any) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      content: update.content,
      type: update.type,
      image: update.image || '',
      videoUrl: update.videoUrl || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      await projectsAPI.deleteUpdate(projectId, updateId);
      alert('Update deleted successfully!');
      fetchUpdates();
    } catch (error: any) {
      alert('Error deleting update: ' + error.message);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUpdate(null);
    setFormData({ title: '', content: '', type: 'announcement', image: '', videoUrl: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Project Updates</h3>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Update</span>
          </button>
        )}
      </div>
      
      {updates.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No updates yet. Check back later!</p>
        </div>
      ) : (
        updates.map((update) => (
          <div key={update._id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">{formatDate(update.createdAt)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  update.type === 'milestone' ? 'bg-green-100 text-green-800' :
                  update.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {update.type}
                </span>
              </div>
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(update)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(update._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{update.title}</h4>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{update.content}</p>
            
            {update.image && (
              <img
                src={update.image}
                alt="Update"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            {update.videoUrl && (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <a 
                  href={update.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Watch Video
                </a>
              </div>
            )}
          </div>
        ))
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingUpdate ? 'Edit Update' : 'Add New Update'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="milestone">Milestone</option>
                    <option value="media">Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : editingUpdate ? 'Save Changes' : 'Add Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectUpdates;