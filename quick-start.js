const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

console.log('🔍 Checking MongoDB connection...');
console.log('📋 Environment variables:');
console.log(`   PORT: ${process.env.PORT || '5001 (default)'}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ Not set'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

if (!process.env.MONGO_URI) {
  console.log('\n❌ ERROR: MONGO_URI is not set in your environment variables!');
  console.log('📝 Please check your config.env file and ensure it contains:');
  console.log('   MONGO_URI=mongodb://localhost:27017/portfolio');
  console.log('\n💡 For MongoDB Atlas, use:');
  console.log('   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority');
  process.exit(1);
}

// Test MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log('🚀 Your backend server should now work properly.');
  console.log('📱 Frontend can connect to: http://localhost:5001');
  process.exit(0);
})
.catch((error) => {
  console.log('\n❌ MongoDB Connection Failed!');
  console.log('🔧 Error:', error.message);
  console.log('\n💡 Solutions:');
  console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
  console.log('   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
  console.log('   3. Check if MongoDB service is running');
  console.log('\n📖 See setup-mongodb-atlas.md for detailed instructions');
  process.exit(1);
});