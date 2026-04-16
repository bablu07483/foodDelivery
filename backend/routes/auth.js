const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {auth} = require('../middleware/auth');
const { sendWelcomeEmail, sendOTPEmail } = require('../utils/sendEmail'); 

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, phone, address });
    await user.save();
    sendWelcomeEmail(user.email, user.name);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN (Phase 1: Verify Credentials & Send OTP)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // Check if email exists
    if (!user) {
      return res.status(404).json({ message: 'Email is not registered' });
    }

    // Check password
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otpCode;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes
    await user.save();

    await sendOTPEmail(user.email, otpCode);

    res.json({ otpSent: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VERIFY OTP (Phase 2: Final JWT Issuance)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verify
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;