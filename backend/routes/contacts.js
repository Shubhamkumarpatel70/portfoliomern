const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const contactController = require('../controllers/contactController');

// Public
router.post('/', contactController.createContact);

// Admin only
router.get('/', protect, admin, contactController.getContacts);
router.get('/:id', protect, admin, contactController.getContact);
router.put('/:id', protect, admin, contactController.updateContact);
router.delete('/:id', protect, admin, contactController.deleteContact);

module.exports = router; 