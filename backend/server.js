const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set');
  console.error('Please create a .env file with your MongoDB Atlas connection string');
  console.error('Format: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
.catch(err => {
  console.error('❌ MongoDB Atlas Connection Error:', err.message);
  console.error('\n🔍 Troubleshooting Steps:');
  console.error('1. Verify your connection string is correct');
  console.error('2. Check if your IP address is whitelisted in MongoDB Atlas');
  console.error('3. Ensure your password is URL-encoded (special characters like @, #, $, etc.)');
  console.error('4. Verify your cluster is running in MongoDB Atlas dashboard');
  console.error('5. Check your internet connection');
  console.error('\n💡 Connection String Format:');
  console.error('mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority');
  console.error('\n⚠️  Make sure to URL-encode special characters in your password!');
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



