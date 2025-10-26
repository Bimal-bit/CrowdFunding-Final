import express from 'express';
import { 
  getAllProjects, 
  getProject, 
  getFeaturedProjects,
  getProjectUpdates,
  addProjectUpdate,
  updateProjectUpdate,
  deleteProjectUpdate
} from '../controllers/project.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProject);

// Updates routes
router.get('/:id/updates', getProjectUpdates);
router.post('/:id/updates', protect, adminOnly, addProjectUpdate);
router.put('/:projectId/updates/:updateId', protect, adminOnly, updateProjectUpdate);
router.delete('/:projectId/updates/:updateId', protect, adminOnly, deleteProjectUpdate);

export default router;
