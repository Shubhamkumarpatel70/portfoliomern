const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner',
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  percent: {
    type: Number,
    min: 0,
    max: 100,
    default: null // null means use default mapping
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema); 