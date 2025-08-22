const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getAllSubscriptions,
  getSubscriptionStats,
  deleteSubscription,
  exportSubscriptions
} = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.get('/unsubscribe/:email', unsubscribeNewsletter);

// Admin routes
router.get('/admin/subscriptions', protect, admin, getAllSubscriptions);
router.get('/admin/stats', protect, admin, getSubscriptionStats);
router.delete('/admin/subscription/:id', protect, admin, deleteSubscription);
router.get('/admin/export', protect, admin, exportSubscriptions);

module.exports = router;
