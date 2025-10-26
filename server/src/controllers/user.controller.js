import User from '../models/User.model.js';
import Project from '../models/Project.model.js';
import Payment from '../models/Payment.model.js';
import CampaignRequest from '../models/CampaignRequest.model.js';
import bcrypt from 'bcryptjs';

// Get user dashboard statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get projects created by user (from approved campaign requests that became projects)
    const userProjects = await Project.find({ creator: userId });
    
    // Calculate total raised across all user's projects
    const totalRaised = userProjects.reduce((sum, project) => sum + (project.raised || 0), 0);
    
    // Calculate total backers across all user's projects
    const totalBackers = userProjects.reduce((sum, project) => sum + (project.backers || 0), 0);
    
    // Count projects created
    const projectsCreated = userProjects.length;
    
    // Calculate success rate (successful projects / total projects)
    const successfulProjects = userProjects.filter(p => p.status === 'successful').length;
    const successRate = projectsCreated > 0 ? Math.round((successfulProjects / projectsCreated) * 100) : 0;

    // Get campaign requests stats
    const campaignRequests = await CampaignRequest.find({ creator: userId });
    const pendingRequests = campaignRequests.filter(r => r.status === 'pending').length;
    const approvedRequests = campaignRequests.filter(r => r.status === 'approved').length;
    const rejectedRequests = campaignRequests.filter(r => r.status === 'rejected').length;

    // Get payments made by user (backed projects)
    const userPayments = await Payment.find({ user: userId, status: 'completed' });
    const totalContributed = userPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const projectsBacked = new Set(userPayments.map(p => p.project.toString())).size;

    res.status(200).json({
      success: true,
      data: {
        totalRaised,
        totalBackers,
        projectsCreated,
        successRate,
        totalContributed,
        projectsBacked,
        campaignRequests: {
          total: campaignRequests.length,
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's created projects
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const projects = await Project.find({ creator: userId })
      .sort({ createdAt: -1 })
      .populate('creator', 'name email');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's backed projects (contributions)
export const getUserBackedProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const payments = await Payment.find({ user: userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .populate('project', 'title description image category goal raised status')
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching backed projects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's analytics data
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's projects
    const userProjects = await Project.find({ creator: userId });
    
    // Get user's payments (contributions)
    const userPayments = await Payment.find({ user: userId, status: 'completed' });

    // Calculate monthly funding progress for user's projects
    const fundingProgressData = [];
    const monthlyData = {};
    
    userProjects.forEach(project => {
      const month = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { raised: 0, goal: 0 };
      }
      monthlyData[month].raised += project.raised || 0;
      monthlyData[month].goal += project.goal || 0;
    });

    Object.keys(monthlyData).forEach(month => {
      fundingProgressData.push({
        month,
        raised: monthlyData[month].raised,
        goal: monthlyData[month].goal
      });
    });

    // Calculate backer growth
    const backerGrowthData = [];
    let cumulativeBackers = 0;
    const backersByMonth = {};

    userProjects.forEach(project => {
      const month = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short' });
      if (!backersByMonth[month]) {
        backersByMonth[month] = 0;
      }
      backersByMonth[month] += project.backers || 0;
    });

    Object.keys(backersByMonth).forEach(month => {
      cumulativeBackers += backersByMonth[month];
      backerGrowthData.push({
        month,
        backers: cumulativeBackers
      });
    });

    // Project status distribution
    const projectStatusData = [
      { name: 'Active', value: userProjects.filter(p => p.status === 'active').length, color: '#10b981' },
      { name: 'Successful', value: userProjects.filter(p => p.status === 'successful').length, color: '#3b82f6' },
      { name: 'Draft', value: userProjects.filter(p => p.status === 'draft').length, color: '#6b7280' },
      { name: 'Failed', value: userProjects.filter(p => p.status === 'failed').length, color: '#ef4444' }
    ].filter(item => item.value > 0);

    // Monthly contributions (as a backer)
    const contributionsByMonth = {};
    userPayments.forEach(payment => {
      const month = new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short' });
      if (!contributionsByMonth[month]) {
        contributionsByMonth[month] = 0;
      }
      contributionsByMonth[month] += 1;
    });

    const monthlyContributionsData = Object.keys(contributionsByMonth).map(month => ({
      month,
      contributions: contributionsByMonth[month]
    }));

    // Category performance
    const categoryData = {};
    userProjects.forEach(project => {
      if (!categoryData[project.category]) {
        categoryData[project.category] = 0;
      }
      categoryData[project.category] += project.raised || 0;
    });

    const categoryPerformanceData = Object.keys(categoryData).map(category => ({
      category,
      raised: categoryData[category]
    }));

    res.status(200).json({
      success: true,
      data: {
        fundingProgressData,
        backerGrowthData,
        projectStatusData,
        monthlyContributionsData,
        categoryPerformanceData
      }
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, avatar } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }

    // Update fields
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user password
export const updateUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide current and new password' 
      });
    }

    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
