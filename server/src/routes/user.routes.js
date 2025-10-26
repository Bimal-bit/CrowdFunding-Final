import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getUserStats, 
  getUserProjects, 
  getUserBackedProjects,
  getUserAnalytics,
  updateUserProfile,
  updateUserPassword
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/user/stats
// @desc    Get user dashboard statistics
// @access  Private
router.get('/stats', getUserStats);

// @route   GET /api/user/projects
// @desc    Get user's created projects
// @access  Private
router.get('/projects', getUserProjects);

// @route   GET /api/user/backed-projects
// @desc    Get user's backed projects (contributions)
// @access  Private
router.get('/backed-projects', getUserBackedProjects);

// @route   GET /api/user/analytics
// @desc    Get user's analytics data
// @access  Private
router.get('/analytics', getUserAnalytics);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateUserProfile);

// @route   PUT /api/user/password
// @desc    Update user password
// @access  Private
router.put('/password', updateUserPassword);

export default router;
