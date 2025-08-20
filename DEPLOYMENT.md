# Deployment Guide - Render

## Prerequisites

1. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
2. **Render Account**: Sign up at [render.com](https://render.com)

## Environment Variables

Set these environment variables in your Render dashboard:

```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=https://your-app-name.onrender.com
```

## Deployment Steps

### 1. Connect to GitHub
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository: `Shubhamkumarpatel70/portfoliomern`

### 2. Configure the Service
- **Name**: `portfoliomern` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Build Command**: `npm run render-postbuild`
- **Start Command**: `npm start`

### 3. Set Environment Variables
Add these in the Render dashboard:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `your_mongodb_atlas_connection_string` |
| `JWT_SECRET` | `your_super_secret_jwt_key` |
| `CLIENT_URL` | `https://your-app-name.onrender.com` |

### 4. Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the build to complete (usually 5-10 minutes)

## MongoDB Atlas Setup

1. Go to [mongodb.com](https://mongodb.com) and create a free account
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password
5. Add the connection string to your Render environment variables

## Features After Deployment

✅ **Full-stack MERN application**
✅ **Admin authentication**
✅ **Portfolio management**
✅ **Responsive design**
✅ **API endpoints**
✅ **File uploads (if configured)**

## Troubleshooting

### Common Issues:

1. **Build fails**: Check the build logs in Render dashboard
2. **Database connection**: Verify MONGO_URI is correct
3. **CORS errors**: Ensure CLIENT_URL matches your Render URL
4. **Environment variables**: Make sure all required variables are set

### Health Check
Your application includes a health check endpoint: `/api/health`

## Support
If you encounter issues, check the Render logs in your dashboard or refer to the application logs.
