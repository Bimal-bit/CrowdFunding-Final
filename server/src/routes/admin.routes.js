import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { 
  createProject, 
  updateProject, 
  deleteProject, 
  getAllProjectsAdmin,
  getStats 
} from '../controllers/admin.controller.js';

const router = express.Router();

// Admin-only routes
router.get('/stats', protect, adminOnly, getStats);
router.get('/projects', protect, adminOnly, getAllProjectsAdmin);
router.put('/projects/:id', protect, adminOnly, updateProject);
router.delete('/projects/:id', protect, adminOnly, deleteProject);

// Any authenticated user can create projects
router.post('/projects', protect, createProject);

export default router;
