require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. IMPORT MODELS FIRST
require('./models/Restaurant');
require('./models/Food');
require('./models/User');
require('./models/Order');

const app = express();

// 2. UPDATED CORS CONFIGURATION
// We must ensure Authorization is explicitly handled for preflight (OPTIONS) requests
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. ROUTES
// Order matters: Admin routes often need to be defined clearly to avoid conflicts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin')); // Admin routes (Protected)
app.use('/api/foods', require('./routes/foods'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/users', require('./routes/user'));

app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'Food Delivery API is running' });
});

// 4. MONGODB CONNECTION
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Atlas Connection Error:', err.message));

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ 
    error: true, 
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});