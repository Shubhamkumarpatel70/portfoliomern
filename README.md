# MERN Portfolio Website

A comprehensive portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, responsive design, and dynamic content management.

## Features

### 🔐 Authentication

- User registration and login with JWT
- Protected routes and admin functionality
- Secure password hashing with bcrypt

### 📱 Responsive Design

- Mobile-first approach with Material-UI
- Smooth animations with Framer Motion
- Modern and clean UI design

### 🎯 Pages

- **Home**: Hero section, skills showcase, featured projects
- **About**: Personal information, skills breakdown, education, achievements
- **Experience**: Professional timeline with CRUD operations
- **Projects**: Portfolio showcase with filtering and search
- **Login/Register**: Authentication forms with validation

### ⚙️ Admin Features

- Add, edit, and delete projects (authenticated users)
- Add, edit, and delete experience entries
- Real-time content management

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend

- **React.js** - UI library
- **Material-UI** - Component library
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Axios** - HTTP client

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mern-portfolio
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

5. **Start the development servers**

   **Option 1: Run both servers simultaneously**

   ```bash
   npm run dev
   ```

   **Option 2: Run servers separately**

   Terminal 1 (Backend):

   ```bash
   npm run server
   ```

   Terminal 2 (Frontend):

   ```bash
   npm run client
   ```

## Usage

### For Visitors

1. Navigate to `http://localhost:3000`
2. Browse through the portfolio pages
3. View projects and experience

### For Admin/Portfolio Owner

1. Register a new account at `http://localhost:3000/register`
2. Login to access admin features
3. Add/edit/delete projects and experience entries
4. Manage portfolio content dynamically

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile (protected)

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Experience

- `GET /api/experience` - Get all experience entries
- `POST /api/experience` - Create new experience (protected)
- `PUT /api/experience/:id` - Update experience (protected)
- `DELETE /api/experience/:id` - Delete experience (protected)

## Project Structure

```
mern-portfolio/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   └── package.json
├── server.js               # Express server
├── package.json            # Backend dependencies
├── config.env              # Environment variables
└── README.md
```

## Customization

### Personal Information

Update the following files with your information:

- `client/src/pages/Home.js` - Hero section, skills, featured projects
- `client/src/pages/About.js` - Personal details, education, achievements
- `client/src/components/Footer.js` - Contact information and social links

### Styling

- Modify the theme in `client/src/App.js`
- Update colors and styling in individual components
- Customize Material-UI theme properties

### Content Management

- Use the admin interface to manage projects and experience
- Add new content through the web interface
- Images can be hosted on services like Cloudinary or AWS S3

## Deployment

### Backend Deployment (Heroku)

1. Create a Heroku account and install Heroku CLI
2. Initialize git repository and connect to Heroku
3. Set environment variables in Heroku dashboard
4. Deploy using `git push heroku main`

### Frontend Deployment (Vercel/Netlify)

1. Build the React app: `npm run build`
2. Deploy the `build` folder to your preferred platform
3. Set environment variables for API endpoints

### Database

- Use MongoDB Atlas for cloud database hosting
- Update `MONGODB_URI` in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Happy Coding! 🚀**
