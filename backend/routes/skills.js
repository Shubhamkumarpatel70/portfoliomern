const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const skillController = require('../controllers/skillController');

// Public
router.get('/', skillController.getSkills);
router.get('/:id', skillController.getSkill);

// Admin only
router.post('/', protect, admin, skillController.createSkill);
router.put('/:id', protect, admin, skillController.updateSkill);
router.delete('/:id', protect, admin, skillController.deleteSkill);

module.exports = router; 