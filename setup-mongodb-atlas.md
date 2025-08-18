# MongoDB Atlas Setup Guide

## Option 1: MongoDB Atlas (Recommended for beginners)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" and create an account
3. Choose the free tier (M0)

### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

### Step 3: Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Your Connection String

1. Go back to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

### Step 6: Update Your Config

Replace the MONGO_URI in your `config.env` file:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster>` with your actual values.

## Option 2: Local MongoDB Installation

### Windows:

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB Compass (GUI tool) when prompted
5. Start MongoDB service

### macOS (with Homebrew):

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu):

```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Test Your Connection

After setting up either option, start your backend server:

```bash
cd backend
npm start
```

You should see: "MongoDB Connected: [your-connection-host]"
