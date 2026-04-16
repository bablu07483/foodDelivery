const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

/**
 * 1. POST - Create a new restaurant
 * Takes separate lat/lng from the request body and saves as GeoJSON
 */
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      cuisine, 
      image, 
      address, 
      phone, 
      lat, 
      lng, 
      isActive,
      rating 
    } = req.body;

    const newRestaurant = new Restaurant({
      name,
      description,
      cuisine,
      image,
      address,
      phone,
      rating,
      isActive: isActive !== undefined ? isActive : true,
      // Mapping lat/lng to the GeoJSON format defined in your model
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)] // MongoDB stores [Longitude, Latitude]
      }
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating restaurant', 
      error: error.message 
    });
  }
});

/**
 * 2. GET - Fetch restaurants (Supports Nearby Geospatial Search)
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    let query = { isActive: true };

    if (lat && lng && lat !== 'undefined' && lng !== 'undefined') {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius ? parseInt(radius) : 15000 // Default 15km
        }
      };
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 3. PATCH - Update existing restaurant
 */
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;