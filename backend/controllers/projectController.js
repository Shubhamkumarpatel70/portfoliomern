const Project = require('../models/Project');
const { deleteFromCloudinary, deleteLocalFile } = require('../middleware/upload');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { category, search, featured, limit = 10, page = 1 } = req.query;
    
    const query = { isPublic: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const projects = await Project.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const project = await Project.findById(req.params.id)
      .populate('user', 'name avatar bio location social');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment views
    project.views = (project.views || 0) + 1;
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      category,
      githubUrl,
      liveUrl,
      demoUrl,
      features,
      challenges,
      solutions,
      duration,
      teamSize,
      status,
      featured,
      tags
    } = req.body;

    const project = new Project({
      title,
      description,
      image: req.body.image,
      images: req.body.images || [],
      technologies: Array.isArray(technologies) 
        ? technologies 
        : (technologies ? technologies.split(',').map(tech => tech.trim()) : []),
      category,
      githubUrl,
      liveUrl,
      demoUrl,
      features: Array.isArray(features) 
        ? features 
        : (features ? features.split(',').map(feature => feature.trim()) : []),
      challenges,
      solutions,
      duration,
      teamSize: teamSize ? parseInt(teamSize) : undefined,
      status,
      featured: featured === 'true',
      tags: Array.isArray(tags) 
        ? tags 
        : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      user: req.user._id
    });

    const createdProject = await project.save();
    const populatedProject = await Project.findById(createdProject._id)
      .populate('user', 'name avatar');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project or is admin
    if (project.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Handle image deletion if new image is uploaded
    if (req.body.image && req.body.image !== project.image) {
      // Delete old image
      if (project.image) {
        if (process.env.NODE_ENV === 'production') {
          // Extract public_id from Cloudinary URL
          const publicId = project.image.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`portfolio/${publicId}`);
        } else {
          deleteLocalFile(project.image);
        }
      }
    }

    // Handle multiple images deletion
    if (req.body.images && req.body.images.length > 0) {
      const oldImages = project.images.filter(img => !req.body.images.includes(img));
      for (const oldImage of oldImages) {
        if (process.env.NODE_ENV === 'production') {
          const publicId = oldImage.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`portfolio/${publicId}`);
        } else {
          deleteLocalFile(oldImage);
        }
      }
    }

    // Update project fields
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.image = req.body.image || project.image;
    project.images = req.body.images || project.images;
    
    // Handle technologies - check if it's already an array or needs to be split
    if (req.body.technologies) {
      project.technologies = Array.isArray(req.body.technologies) 
        ? req.body.technologies 
        : req.body.technologies.split(',').map(tech => tech.trim());
    }
    
    project.category = req.body.category || project.category;
    project.githubUrl = req.body.githubUrl || project.githubUrl;
    project.liveUrl = req.body.liveUrl || project.liveUrl;
    project.demoUrl = req.body.demoUrl || project.demoUrl;
    
    // Handle features - check if it's already an array or needs to be split
    if (req.body.features) {
      project.features = Array.isArray(req.body.features) 
        ? req.body.features 
        : req.body.features.split(',').map(feature => feature.trim());
    }
    
    project.challenges = req.body.challenges || project.challenges;
    project.solutions = req.body.solutions || project.solutions;
    project.duration = req.body.duration || project.duration;
    project.teamSize = req.body.teamSize ? parseInt(req.body.teamSize) : project.teamSize;
    project.status = req.body.status || project.status;
    project.featured = req.body.featured !== undefined ? req.body.featured === 'true' : project.featured;
    
    // Handle tags - check if it's already an array or needs to be split
    if (req.body.tags) {
      project.tags = Array.isArray(req.body.tags) 
        ? req.body.tags 
        : req.body.tags.split(',').map(tag => tag.trim());
    }
    
    project.isPublic = req.body.isPublic !== undefined ? req.body.isPublic === 'true' : project.isPublic;

    const updatedProject = await project.save();
    const populatedProject = await Project.findById(updatedProject._id)
      .populate('user', 'name avatar');

    res.json(populatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project or is admin
    if (project.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete images
    if (project.image) {
      if (process.env.NODE_ENV === 'production') {
        const publicId = project.image.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`portfolio/${publicId}`);
      } else {
        deleteLocalFile(project.image);
      }
    }

    // Delete multiple images
    for (const image of project.images) {
      if (process.env.NODE_ENV === 'production') {
        const publicId = image.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`portfolio/${publicId}`);
      } else {
        deleteLocalFile(image);
      }
    }

    await project.remove();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's projects
// @route   GET /api/projects/user/:userId
// @access  Public
const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 
      user: req.params.userId,
      isPublic: true 
    })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike project
// @route   PUT /api/projects/:id/like
// @access  Private
const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Simple like implementation (you might want to track who liked what)
    project.likes += 1;
    await project.save();

    res.json({ likes: project.likes });
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private
const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          featuredProjects: { $sum: { $cond: ['$featured', 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Project.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: stats[0] || { totalProjects: 0, totalViews: 0, totalLikes: 0, featuredProjects: 0 },
      categoryStats
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle project featured status
// @route   PUT /api/projects/:id/feature
// @access  Private (Admin only)
const toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin access required.' });
    }

    // Toggle featured status
    project.featured = !project.featured;
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('user', 'name avatar');

    res.json({
      ...populatedProject.toObject(),
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getUserProjects,
  likeProject,
  getProjectStats,
  toggleFeatured
}; 