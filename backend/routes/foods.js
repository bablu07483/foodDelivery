const express = require('express');
const Food = require('../models/Food');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all foods
router.get('/', async (req, res) => {
  try {
    const { category, restaurant, search } = req.query;
    const query = { isAvailable: true };

    if (category) {
      query.category = category;
    }
    if (restaurant) {
      query.restaurant = restaurant;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foods = await Food.find(query)
      .populate('restaurant', 'name cuisine')
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('restaurant', 'name cuisine address phone');

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get diet foods (foods with nutritional information)
router.get('/diet/all', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isAvailable: true };
    
    if (category) {
      query.category = category;
    }

    const foods = await Food.find(query)
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;



