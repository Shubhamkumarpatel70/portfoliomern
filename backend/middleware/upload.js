const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn('Cloudinary credentials not found. Using local storage only.');
}

// Configure multer storage for local uploads (fallback)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    // Ensure the uploads directory exists
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image or PDF files are allowed!'), false);
  }
};

// Create multer instances
const uploadToCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadToLocal = multer({
  storage: localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload middleware functions
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    // Always use local storage if Cloudinary is not configured
    const upload = (process.env.NODE_ENV === 'production' && 
                   process.env.CLOUDINARY_CLOUD_NAME && 
                   process.env.CLOUDINARY_API_KEY && 
                   process.env.CLOUDINARY_API_SECRET) ? uploadToCloudinary : uploadToLocal;
    
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      // If file was uploaded, add the URL to req.body
      if (req.file) {
        if (process.env.NODE_ENV === 'production' && 
            process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET) {
          req.body[fieldName] = req.file.path;
        } else {
          req.body[fieldName] = `/uploads/${req.file.filename}`;
        }
      }
      
      next();
    });
  };
};

const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    // Always use local storage if Cloudinary is not configured
    const upload = (process.env.NODE_ENV === 'production' && 
                   process.env.CLOUDINARY_CLOUD_NAME && 
                   process.env.CLOUDINARY_API_KEY && 
                   process.env.CLOUDINARY_API_SECRET) ? uploadToCloudinary : uploadToLocal;
    
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: `Too many files. Maximum is ${maxCount}.` });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      // If files were uploaded, add the URLs to req.body
      if (req.files && req.files.length > 0) {
        const fileUrls = req.files.map(file => {
          if (process.env.NODE_ENV === 'production' && 
              process.env.CLOUDINARY_CLOUD_NAME && 
              process.env.CLOUDINARY_API_KEY && 
              process.env.CLOUDINARY_API_SECRET) {
            return file.path;
          } else {
            return `/uploads/${file.filename}`;
          }
        });
        req.body[fieldName] = fileUrls;
      }
      
      next();
    });
  };
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

// Delete local file
const deleteLocalFile = (filePath) => {
  const fs = require('fs');
  const fullPath = path.join(__dirname, '..', filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting local file:', error);
    return false;
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFromCloudinary,
  deleteLocalFile,
  cloudinary
}; 