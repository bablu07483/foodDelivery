const mongoose = require('mongoose');



const foodSchema = new mongoose.Schema({

  name: { type: String, required: true, trim: true },

  description: { type: String, trim: true },

  category: { 
  type: String, 
  enum: ['beverages', 'snacks & starters', 'desserts', 'breakfast', 'fastfood', 'south-indian', 'veg', 'non-veg'], 
  required: true 
},

  price: { type: Number, required: true, min: 0 },

  image: { type: String, default: '' },

  restaurant: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'Restaurant',

    required: true

  },

  nutrition: {

    calories: { type: Number, default: 0 },

    protein: { type: Number, default: 0 },

    fiber: { type: Number, default: 0 },

    carbohydrates: { type: Number, default: 0 },

    fats: { type: Number, default: 0 }

  },

  isAvailable: { type: Boolean, default: true }

}, { timestamps: true });



module.exports = mongoose.model('Food', foodSchema);