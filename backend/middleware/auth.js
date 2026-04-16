const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify if user is logged in
const auth = async (req, res, next) => {
  try {
    // Look for token in Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support both userId (common in custom tokens) or id
    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to verify if user is an admin
const adminAuth = (req, res, next) => {
  // auth middleware runs first, so req.user is guaranteed to exist if auth passed
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

module.exports = { auth, adminAuth };