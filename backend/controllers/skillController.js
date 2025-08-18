const Skill = require('../models/Skill');

// Get all skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single skill
exports.getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create skill
exports.createSkill = async (req, res) => {
  try {
    const skill = new Skill({
      ...req.body,
      percent: req.body.percent !== undefined ? req.body.percent : null
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update skill
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (req.body.percent !== undefined) {
      skill.percent = req.body.percent;
    }
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 