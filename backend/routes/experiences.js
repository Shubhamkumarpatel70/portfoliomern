const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getUserExperiences,
  getExperienceStats
} = require('../controllers/experienceController');

// Public routes
router.get('/', getExperiences);
router.get('/:id', optionalAuth, getExperience);
router.get('/user/:userId', getUserExperiences);

// Protected routes
router.post('/', protect, uploadSingle('companyLogo'), createExperience);
router.put('/:id', protect, uploadSingle('companyLogo'), updateExperience);
router.delete('/:id', protect, deleteExperience);
router.get('/stats', protect, getExperienceStats);

module.exports = router; 