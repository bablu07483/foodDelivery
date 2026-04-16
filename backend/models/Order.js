const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: {
    type: String, // Supports both MongoDB ObjectIds and custom Diet IDs
    required: true
  },
  name: { 
    type: String,
    required: true 
  },
  image: { 
    type: String // ✅ Stores the image URL directly in the order
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'pick-up','on the way', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);