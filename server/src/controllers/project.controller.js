import Project from '../models/Project.model.js';

export const getAllProjects = async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    let query = { status: 'active' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sort = {};
    switch (sortBy) {
      case 'trending':
        sort = { backers: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'ending':
        sort = { daysLeft: 1 };
        break;
      case 'funded':
        sort = { raised: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const projects = await Project.find(query).sort(sort).populate('creator', 'name avatar');
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('creator', 'name avatar email');
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true, status: 'active' })
      .limit(6)
      .populate('creator', 'name avatar');
    
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get project updates
export const getProjectUpdates = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select('updates');
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Sort updates by date (newest first)
    const sortedUpdates = project.updates.sort((a, b) => b.createdAt - a.createdAt);
    
    res.status(200).json({ success: true, data: sortedUpdates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add project update (admin only)
export const addProjectUpdate = async (req, res) => {
  try {
    const { title, content, type, image, videoUrl } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const newUpdate = {
      title,
      content,
      type: type || 'announcement',
      image,
      videoUrl
    };

    project.updates.push(newUpdate);
    await project.save();

    res.status(201).json({ 
      success: true, 
      message: 'Update added successfully',
      data: project.updates[project.updates.length - 1]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update project update (admin only)
export const updateProjectUpdate = async (req, res) => {
  try {
    const { projectId, updateId } = req.params;
    const { title, content, type, image, videoUrl } = req.body;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updateIndex = project.updates.findIndex(u => u._id.toString() === updateId);
    
    if (updateIndex === -1) {
      return res.status(404).json({ success: false, message: 'Update not found' });
    }

    // Update fields
    if (title) project.updates[updateIndex].title = title;
    if (content) project.updates[updateIndex].content = content;
    if (type) project.updates[updateIndex].type = type;
    if (image !== undefined) project.updates[updateIndex].image = image;
    if (videoUrl !== undefined) project.updates[updateIndex].videoUrl = videoUrl;

    await project.save();

    res.status(200).json({ 
      success: true, 
      message: 'Update modified successfully',
      data: project.updates[updateIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete project update (admin only)
export const deleteProjectUpdate = async (req, res) => {
  try {
    const { projectId, updateId } = req.params;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updateIndex = project.updates.findIndex(u => u._id.toString() === updateId);
    
    if (updateIndex === -1) {
      return res.status(404).json({ success: false, message: 'Update not found' });
    }

    project.updates.splice(updateIndex, 1);
    await project.save();

    res.status(200).json({ 
      success: true, 
      message: 'Update deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
