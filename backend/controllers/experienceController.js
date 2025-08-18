const Experience = require('../models/Experience');
const { deleteFromCloudinary, deleteLocalFile } = require('../middleware/upload');

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
  try {
    const { userId, current, limit = 10, page = 1 } = req.query;
    
    const query = { isPublic: true };
    
    // Filter by user
    if (userId) {
      query.user = userId;
    }
    
    // Filter by current status
    if (current === 'true') {
      query.current = true;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const experiences = await Experience.find(query)
      .populate('user', 'name avatar')
      .sort({ from: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Experience.countDocuments(query);
    
    res.json({
      experiences,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('user', 'name avatar bio location social');

    if (experience) {
      res.json(experience);
    } else {
      res.status(404).json({ message: 'Experience not found' });
    }
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private
const createExperience = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
      responsibilities,
      achievements,
      technologies,
      industry,
      employmentType,
      salary,
      supervisor,
      companyWebsite,
      companyLogo
    } = req.body;

    const experience = new Experience({
      title,
      company,
      location,
      from: new Date(from),
      to: current === 'true' ? null : new Date(to),
      current: current === 'true',
      description,
      responsibilities: responsibilities ? responsibilities.split(',').map(resp => resp.trim()) : [],
      achievements: achievements ? achievements.split(',').map(ach => ach.trim()) : [],
      technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
      industry,
      employmentType,
      salary,
      supervisor,
      companyWebsite,
      companyLogo: req.body.companyLogo || companyLogo,
      user: req.user._id
    });

    const createdExperience = await experience.save();
    const populatedExperience = await Experience.findById(createdExperience._id)
      .populate('user', 'name avatar');

    res.status(201).json(populatedExperience);
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Check if user owns the experience or is admin
    if (experience.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Handle company logo deletion if new logo is uploaded
    if (req.body.companyLogo && req.body.companyLogo !== experience.companyLogo) {
      // Delete old logo
      if (experience.companyLogo) {
        if (process.env.NODE_ENV === 'production') {
          const publicId = experience.companyLogo.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`portfolio/${publicId}`);
        } else {
          deleteLocalFile(experience.companyLogo);
        }
      }
    }

    // Update experience fields
    experience.title = req.body.title || experience.title;
    experience.company = req.body.company || experience.company;
    experience.location = req.body.location || experience.location;
    experience.from = req.body.from ? new Date(req.body.from) : experience.from;
    experience.to = req.body.current === 'true' ? null : (req.body.to ? new Date(req.body.to) : experience.to);
    experience.current = req.body.current !== undefined ? req.body.current === 'true' : experience.current;
    experience.description = req.body.description || experience.description;
    experience.responsibilities = req.body.responsibilities ? req.body.responsibilities.split(',').map(resp => resp.trim()) : experience.responsibilities;
    experience.achievements = req.body.achievements ? req.body.achievements.split(',').map(ach => ach.trim()) : experience.achievements;
    experience.technologies = req.body.technologies ? req.body.technologies.split(',').map(tech => tech.trim()) : experience.technologies;
    experience.industry = req.body.industry || experience.industry;
    experience.employmentType = req.body.employmentType || experience.employmentType;
    experience.salary = req.body.salary || experience.salary;
    experience.supervisor = req.body.supervisor || experience.supervisor;
    experience.companyWebsite = req.body.companyWebsite || experience.companyWebsite;
    experience.companyLogo = req.body.companyLogo || experience.companyLogo;
    experience.isPublic = req.body.isPublic !== undefined ? req.body.isPublic === 'true' : experience.isPublic;

    const updatedExperience = await experience.save();
    const populatedExperience = await Experience.findById(updatedExperience._id)
      .populate('user', 'name avatar');

    res.json(populatedExperience);
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Check if user owns the experience or is admin
    if (experience.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete company logo
    if (experience.companyLogo) {
      if (process.env.NODE_ENV === 'production') {
        const publicId = experience.companyLogo.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`portfolio/${publicId}`);
      } else {
        deleteLocalFile(experience.companyLogo);
      }
    }

    await experience.remove();
    res.json({ message: 'Experience removed' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's experiences
// @route   GET /api/experiences/user/:userId
// @access  Public
const getUserExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ 
      user: req.params.userId,
      isPublic: true 
    })
    .populate('user', 'name avatar')
    .sort({ from: -1 });

    res.json(experiences);
  } catch (error) {
    console.error('Get user experiences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get experience statistics
// @route   GET /api/experiences/stats
// @access  Private
const getExperienceStats = async (req, res) => {
  try {
    const stats = await Experience.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalExperiences: { $sum: 1 },
          currentExperiences: { $sum: { $cond: ['$current', 1, 0] } },
          totalDuration: {
            $sum: {
              $cond: [
                '$current',
                { $divide: [{ $subtract: [new Date(), '$from'] }, 1000 * 60 * 60 * 24 * 365] },
                { $divide: [{ $subtract: ['$to', '$from'] }, 1000 * 60 * 60 * 24 * 365] }
              ]
            }
          }
        }
      }
    ]);

    const industryStats = await Experience.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 }
        }
      }
    ]);

    const employmentTypeStats = await Experience.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$employmentType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: stats[0] || { totalExperiences: 0, currentExperiences: 0, totalDuration: 0 },
      industryStats,
      employmentTypeStats
    });
  } catch (error) {
    console.error('Get experience stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getUserExperiences,
  getExperienceStats
}; 