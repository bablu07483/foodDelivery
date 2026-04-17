const express = require('express');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category, restaurant, search, minProtein, minCalories, maxCarbs, minFiber, lat, lng } = req.query;
        let query = { isAvailable: true };

        if (restaurant === 'nearby' && lat && lng) {
            const nearbyRestaurants = await Restaurant.find({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                        $maxDistance: 5000 
                    }
                }
            }).select('_id');
            query.restaurant = { $in: nearbyRestaurants.map(r => r._id) };
        } 
        else if (restaurant && restaurant !== '' && restaurant !== 'nearby') {
            query.restaurant = restaurant;
        }

        if (category && category !== '') query.category = category;
        if (minProtein) query['nutrition.protein'] = { $gte: Number(minProtein) };
        if (minCalories) query['nutrition.calories'] = { $gte: Number(minCalories) };
        if (minFiber) query['nutrition.fiber'] = { $gte: Number(minFiber) };
        if (maxCarbs) query['nutrition.carbohydrates'] = { $lte: Number(maxCarbs) };

        if (search && search.trim() !== '') {
            query.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        const foods = await Food.find(query)
            .populate('restaurant', 'name cuisine image')
            .sort({ createdAt: -1 });

        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        if (Array.isArray(data)) {
            const formattedData = data.map(item => ({
                ...item,
                isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
                nutrition: {
                    protein: item.nutrition?.protein || 0,
                    calories: item.nutrition?.calories || 0,
                    fiber: item.nutrition?.fiber || 0,
                    carbohydrates: item.nutrition?.carbohydrates || 0,
                    fats: item.nutrition?.fats || 0
                }
            }));
            const savedFoods = await Food.insertMany(formattedData);
            const populatedFoods = await Food.populate(savedFoods, { path: 'restaurant', select: 'name cuisine image' });
            return res.status(201).json(populatedFoods);
        } else {
            const { name, description, price, category, image, restaurant, nutrition, isAvailable } = data;
            const newFood = new Food({
                name, description, price, category, image, restaurant,
                isAvailable: isAvailable !== undefined ? isAvailable : true,
                nutrition: {
                    protein: nutrition?.protein || 0,
                    calories: nutrition?.calories || 0,
                    fiber: nutrition?.fiber || 0,
                    carbohydrates: nutrition?.carbohydrates || 0,
                    fats: nutrition?.fats || 0
                }
            });
            const savedFood = await newFood.save();
            const populatedFood = await savedFood.populate('restaurant', 'name cuisine image');
            res.status(201).json(populatedFood);
        }
    } catch (error) {
        res.status(400).json({ message: 'Error creating food item', error: error.message });
    }
});

module.exports = router;