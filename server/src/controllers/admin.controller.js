import Project from '../models/Project.model.js';
import Payment from '../models/Payment.model.js';
import User from '../models/User.model.js';

export const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      creator: req.user._id,
      endDate: new Date(Date.now() + req.body.daysLeft * 24 * 60 * 60 * 1000)
    };

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().populate('creator', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const totalPayments = await Payment.countDocuments();
    
    const totalRaised = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        totalUsers,
        totalPayments,
        totalRaised: totalRaised[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
