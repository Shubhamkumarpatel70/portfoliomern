const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getUserProjects,
  likeProject,
  getProjectStats,
  toggleFeatured
} = require('../controllers/projectController');

// Public routes
router.get('/', getProjects);
router.get('/:id', optionalAuth, getProject);
router.get('/user/:userId', getUserProjects);

// Protected routes
router.post('/', protect, uploadSingle('image'), createProject);
router.put('/:id', protect, uploadSingle('image'), updateProject);
router.delete('/:id', protect, deleteProject);
router.put('/:id/like', protect, likeProject);
router.put('/:id/feature', protect, toggleFeatured);
router.get('/stats', protect, getProjectStats);

// Multiple image upload route
router.post('/upload-images', protect, uploadMultiple('images', 5), (req, res) => {
  res.json({ images: req.body.images || [] });
});

module.exports = router; 