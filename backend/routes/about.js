const express = require('express');
const router = express.Router();
const { protect, admin, optionalAuth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  getAbout,
  getAboutByUserId,
  getFirstAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  getAllAbout,
  uploadResume
} = require('../controllers/aboutController');

// Public routes with optional auth (to gate resumeUrl)
router.get('/public', optionalAuth, getFirstAbout);
router.route('/user/:userId').get(optionalAuth, getAboutByUserId);

// Protected routes (require authentication)
router.route('/me')
  .get(protect, getAbout)
  .post(protect, createAbout)
  .put(protect, updateAbout)
  .delete(protect, deleteAbout);

// Upload resume (PDF)
router.put('/me/resume', protect, uploadSingle('resume'), uploadResume);

// Admin routes
router.route('/admin/all').get(protect, admin, getAllAbout);

module.exports = router; 