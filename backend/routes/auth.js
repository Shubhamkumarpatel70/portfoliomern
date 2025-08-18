const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
  changePassword,
  updateAvatar
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/profile/avatar', protect, uploadSingle('avatar'), updateAvatar);

// Admin routes
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router; 