// backend/routes/user.js
const express = require('express');
const User = require('../models/User'); // Import your User model
const { auth } = require('../middleware/auth'); // Import your authentication middleware
const router = express.Router();

// GET /api/users/profile - Fetches the authenticated user's profile
router.get('/profile', auth, async (req, res) => {
  try {
    // The auth middleware should provide the user's ID on req.user._id
    // We select '-password' to exclude the hashed password from the response for security
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;