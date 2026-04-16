const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  cuisine: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    trim: true
  },
  // ✅ NEW: Geospatial Location Field
  location: {
    type: {
      type: String, 
      enum: ['Point'], // Must be 'Point'
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true
    }
  },
  phone: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// ✅ CRITICAL: Create a 2dsphere index for distance queries
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);