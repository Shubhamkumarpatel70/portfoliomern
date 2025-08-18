const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  from: {
    type: Date,
    required: [true, 'Start date is required']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  responsibilities: [{
    type: String,
    trim: true,
    maxlength: [200, 'Responsibility cannot be more than 200 characters']
  }],
  achievements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Achievement cannot be more than 200 characters']
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  industry: {
    type: String,
    trim: true,
    maxlength: [50, 'Industry cannot be more than 50 characters']
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    default: 'full-time'
  },
  salary: {
    type: String,
    trim: true
  },
  supervisor: {
    type: String,
    trim: true,
    maxlength: [100, 'Supervisor name cannot be more than 100 characters']
  },
  companyWebsite: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  companyLogo: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for formatted date range
experienceSchema.virtual('dateRange').get(function() {
  const fromDate = this.from.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
  
  if (this.current) {
    return `${fromDate} - Present`;
  }
  
  const toDate = this.to.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
  
  return `${fromDate} - ${toDate}`;
});

// Virtual for duration
experienceSchema.virtual('duration').get(function() {
  const start = this.from;
  const end = this.current ? new Date() : this.to;
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);
  
  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
});

// Ensure virtual fields are serialized
experienceSchema.set('toJSON', { virtuals: true });
experienceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Experience', experienceSchema); 