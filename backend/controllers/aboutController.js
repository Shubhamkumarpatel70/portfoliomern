const About = require('../models/About');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { uploadSingle } = require('../middleware/upload');

// Get about information
exports.getAbout = catchAsyncErrors(async (req, res, next) => {
  const about = await About.findOne({ user: req.user.id });

  if (!about) {
    return res.status(404).json({
      success: false,
      message: 'About information not found'
    });
  }

  res.status(200).json({
    success: true,
    about
  });
});

// Get about by user ID (for public access)
exports.getAboutByUserId = catchAsyncErrors(async (req, res, next) => {
  const about = await About.findOne({ user: req.params.userId }).populate('user', 'name email avatar');

  if (!about) {
    return res.status(404).json({
      success: false,
      message: 'About information not found'
    });
  }

  // If not authenticated, hide resumeUrl
  const isAuthed = !!req.user;
  const aboutObj = about.toObject();
  if (!isAuthed) {
    delete aboutObj.resumeUrl;
  }

  res.status(200).json({
    success: true,
    about: aboutObj
  });
});

// Upload resume (PDF) for current user
exports.uploadResume = catchAsyncErrors(async (req, res, next) => {
  // uploadSingle middleware already set req.body.resume
  if (!req.body.resume) {
    return res.status(400).json({ success: false, message: 'No resume uploaded' });
  }

  let about = await About.findOne({ user: req.user.id });
  if (!about) {
    about = await About.create({ user: req.user.id, name: req.user.name || 'User', bio: ' ', resumeUrl: req.body.resume });
  } else {
    about.resumeUrl = req.body.resume;
    await about.save();
  }

  res.status(200).json({ success: true, resumeUrl: about.resumeUrl });
});

// Create about information
exports.createAbout = catchAsyncErrors(async (req, res, next) => {
  // Check if about already exists for this user
  const existingAbout = await About.findOne({ user: req.user.id });
  
  if (existingAbout) {
    return res.status(400).json({
      success: false,
      message: 'About information already exists for this user'
    });
  }

  const aboutData = {
    ...req.body,
    user: req.user.id
  };

  // Convert skills string to array if provided
  if (aboutData.skills && typeof aboutData.skills === 'string') {
    aboutData.skills = aboutData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  }

  // Convert achievements string to array if provided
  if (aboutData.achievements && typeof aboutData.achievements === 'string') {
    aboutData.achievements = aboutData.achievements.split(',').map(achievement => achievement.trim()).filter(achievement => achievement);
  }

  const about = await About.create(aboutData);

  res.status(201).json({
    success: true,
    about
  });
});

// Update about information
exports.updateAbout = catchAsyncErrors(async (req, res, next) => {
  let about = await About.findOne({ user: req.user.id });

  if (!about) {
    return res.status(404).json({
      success: false,
      message: 'About information not found'
    });
  }

  const updateData = { ...req.body };

  // Convert skills string to array if provided
  if (updateData.skills && typeof updateData.skills === 'string') {
    updateData.skills = updateData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  }

  // Convert achievements string to array if provided
  if (updateData.achievements && typeof updateData.achievements === 'string') {
    updateData.achievements = updateData.achievements.split(',').map(achievement => achievement.trim()).filter(achievement => achievement);
  }

  about = await About.findOneAndUpdate(
    { user: req.user.id },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    about
  });
});

// Delete about information
exports.deleteAbout = catchAsyncErrors(async (req, res, next) => {
  const about = await About.findOne({ user: req.user.id });

  if (!about) {
    return res.status(404).json({
      success: false,
      message: 'About information not found'
    });
  }

  await About.findByIdAndDelete(about._id);

  res.status(200).json({
    success: true,
    message: 'About information deleted successfully'
  });
});

// Get first available about information (for public access)
exports.getFirstAbout = catchAsyncErrors(async (req, res, next) => {
  const about = await About.findOne().populate('user', 'name email avatar');

  if (!about) {
    return res.status(404).json({
      success: false,
      message: 'About information not found'
    });
  }

  const isAuthed = !!req.user;
  const aboutObj = about.toObject();
  if (!isAuthed) {
    delete aboutObj.resumeUrl;
  }

  res.status(200).json({
    success: true,
    about: aboutObj
  });
});

// Get all about information (admin only)
exports.getAllAbout = catchAsyncErrors(async (req, res, next) => {
  const abouts = await About.find().populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: abouts.length,
    abouts
  });
}); 