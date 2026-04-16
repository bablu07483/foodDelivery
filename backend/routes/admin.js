const express = require('express');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const User = require('../models/User'); 
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Apply both middlewares to all routes in this file
// This ensures every request below must have a valid Admin Token
router.use(auth);
router.use(adminAuth);

// --- 1. User Management ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// --- 2. Order Management ---
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email role') 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// --- 3. Food Management ---
router.post('/foods', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json({ message: 'Food item created successfully', food });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food updated', food });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- 4. Restaurant Management ---
router.post('/restaurants', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/restaurants/:id', async (req, res) => {
  try {
    // Explicitly using runValidators to catch schema errors
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error during update', error: error.message });
  }
});

router.delete('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- 5. Optional: Update Order Status ---
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;