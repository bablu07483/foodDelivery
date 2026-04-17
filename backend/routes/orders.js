const express = require('express');
const Order = require('../models/Order');
const Food = require('../models/Food');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 1. Create Order
router.post('/', auth, async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId).catch(() => null);
      if (food) {
        totalAmount += food.price * item.quantity;
        orderItems.push({ 
          food: food._id, 
          name: food.name,
          image: food.image, 
          quantity: item.quantity, 
          price: food.price 
        });
      } else {
        totalAmount += (item.price || 0) * item.quantity;
        orderItems.push({ 
          food: item.foodId, 
          name: item.name || 'Custom Diet Item',
          image: item.image || 'https://via.placeholder.com/60x60',
          quantity: item.quantity, 
          price: item.price || 0 
        });
      }
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress || req.user.address,
      phone: phone || req.user.phone
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. Get My Orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ ADDED: Update Order Status (For Cancellation & Editing)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Security Check: Don't allow cancellation if already delivered
    if (status === 'cancelled' && order.status === 'delivered' && order.status === 'pick-up' && order.status === 'on the way') {
      return res.status(400).json({ message: 'Cannot cancel a delivered order' });
    }

    order.status = status || order.status;
    await order.save();

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;