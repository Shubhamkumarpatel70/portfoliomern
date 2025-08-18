# MERN Portfolio Backend

A comprehensive backend API for the MERN Portfolio application with file upload, authentication, and CRUD operations.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload**: Support for both local and Cloudinary storage
- **Project Management**: Full CRUD operations for portfolio projects
- **Experience Management**: Professional experience tracking with timeline
- **Security**: Rate limiting, CORS, Helmet, and input validation
- **Admin Features**: User management and content moderation
- **Statistics**: Analytics for projects and experiences

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── projectController.js  # Project CRUD operations
│   └── experienceController.js # Experience CRUD operations
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── upload.js            # File upload middleware
├── models/
│   ├── User.js              # User schema
│   ├── Project.js           # Project schema
│   └── Experience.js        # Experience schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── projects.js          # Project routes
│   └── experiences.js       # Experience routes
├── uploads/                 # Local file storage
├── server.js               # Main server file
├── package.json            # Dependencies
└── config.env              # Environment variables
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp config.env .env
   # Edit .env with your configuration
   ```

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/mern-portfolio

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration (for production)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Projects

- `GET /api/projects` - Get all projects (with filtering)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/user/:userId` - Get user's projects
- `PUT /api/projects/:id/like` - Like project
- `GET /api/projects/stats` - Get project statistics

### Experiences

- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get single experience
- `POST /api/experiences` - Create new experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience
- `GET /api/experiences/user/:userId` - Get user's experiences
- `GET /api/experiences/stats` - Get experience statistics

### File Upload

- `POST /api/projects/upload-images` - Upload multiple project images

## File Upload Features

### Local Storage (Development)

- Files stored in `uploads/` directory
- Automatic file naming with timestamps
- File size limit: 5MB
- Supported formats: jpg, jpeg, png, gif, webp

### Cloudinary Storage (Production)

- Automatic image optimization
- Cloud storage with CDN
- Image transformations (resize, quality optimization)
- Automatic cleanup of old files

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Request data validation
- **File Upload Security**: File type and size restrictions

## Database Models

### User Model

- Basic info (name, email, password)
- Profile details (bio, location, website)
- Social links (GitHub, LinkedIn, Twitter, Instagram)
- Skills array
- Role-based access (user/admin)
- Timestamps and activity tracking

### Project Model

- Project details (title, description, image)
- Technology stack
- Links (GitHub, live demo)
- Features and challenges
- Statistics (views, likes)
- Categorization and tags
- Public/private visibility

### Experience Model

- Job details (title, company, location)
- Date range with current position support
- Responsibilities and achievements
- Technology stack
- Employment type and industry
- Company information

## Development

### Running in Development Mode

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

### Code Formatting

```bash
npm run format
```

## Production Deployment

1. **Set environment variables for production**
2. **Configure Cloudinary for file storage**
3. **Set up MongoDB Atlas or production database**
4. **Configure CORS for your domain**
5. **Set up SSL/TLS certificates**

## Error Handling

The API includes comprehensive error handling:

- Validation errors
- Authentication errors
- File upload errors
- Database errors
- Custom error messages

## Performance Optimizations

- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevents abuse
- **Image Optimization**: Automatic resizing and compression
- **Database Indexing**: Optimized queries
- **Caching**: Response caching (can be extended with Redis)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
