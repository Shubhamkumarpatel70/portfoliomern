const Newsletter = require('../models/Newsletter');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Subscribe to newsletter
exports.subscribeNewsletter = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler('Please provide an email address', 400));
  }

  // Check if already subscribed
  const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
  
  if (existingSubscription) {
    if (existingSubscription.isActive) {
      return next(new ErrorHandler('You are already subscribed to our newsletter', 400));
    } else {
      // Reactivate subscription
      existingSubscription.isActive = true;
      existingSubscription.subscribedAt = new Date();
      await existingSubscription.save();
      
      return res.status(200).json({
        success: true,
        message: 'Welcome back! Your newsletter subscription has been reactivated.'
      });
    }
  }

  // Create new subscription
  const subscription = await Newsletter.create({
    email: email.toLowerCase(),
    source: req.body.source || 'website'
  });

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to newsletter!',
    subscription
  });
});

// Unsubscribe from newsletter
exports.unsubscribeNewsletter = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.params;

  const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

  if (!subscription) {
    return next(new ErrorHandler('Subscription not found', 404));
  }

  subscription.isActive = false;
  await subscription.save();

  res.status(200).json({
    success: true,
    message: 'Successfully unsubscribed from newsletter'
  });
});

// Get all subscriptions (Admin only)
exports.getAllSubscriptions = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const subscriptions = await Newsletter.find()
    .sort({ subscribedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Newsletter.countDocuments();
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    subscriptions,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// Get subscription statistics (Admin only)
exports.getSubscriptionStats = catchAsyncErrors(async (req, res, next) => {
  const totalSubscriptions = await Newsletter.countDocuments();
  const activeSubscriptions = await Newsletter.countDocuments({ isActive: true });
  const todaySubscriptions = await Newsletter.countDocuments({
    subscribedAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0))
    }
  });
  const thisMonthSubscriptions = await Newsletter.countDocuments({
    subscribedAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
  });

  res.status(200).json({
    success: true,
    stats: {
      total: totalSubscriptions,
      active: activeSubscriptions,
      today: todaySubscriptions,
      thisMonth: thisMonthSubscriptions
    }
  });
});

// Delete subscription (Admin only)
exports.deleteSubscription = catchAsyncErrors(async (req, res, next) => {
  const subscription = await Newsletter.findById(req.params.id);

  if (!subscription) {
    return next(new ErrorHandler('Subscription not found', 404));
  }

  await subscription.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Subscription deleted successfully'
  });
});

// Export subscriptions to CSV (Admin only)
exports.exportSubscriptions = catchAsyncErrors(async (req, res, next) => {
  const subscriptions = await Newsletter.find().sort({ subscribedAt: -1 });

  const csvData = subscriptions.map(sub => ({
    email: sub.email,
    subscribedAt: sub.subscribedAt.toISOString(),
    isActive: sub.isActive,
    source: sub.source
  }));

  res.status(200).json({
    success: true,
    data: csvData
  });
});
