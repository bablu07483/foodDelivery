const express = require('express');
const router = express.Router();
const Food = require('../models/Food'); 
const axios = require('axios');

const USDA_API_KEY = '3L9YDuSRNwXsLJv8dzKgzdqR8WVvd5pT4wbr552I'; 

router.post('/update-diet', async (req, res) => {
    try {
        const { dietProfile } = req.body;
        const { age, gender, weight, height, nutritionGoal, requestedQuantity, unit, healthCondition } = dietProfile;

        // 1. BMR Calculation
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = (gender === 'male') ? bmr + 5 : bmr - 161;

        // 2. Health Condition Logic (Expanded)
        let targetCalories = Math.round(bmr * 1.2); 
        let carbRatio = 0.50;

        switch (healthCondition) {
            case 'weight_loss': targetCalories -= 500; carbRatio = 0.40; break;
            case 'weight_gain': targetCalories += 500; carbRatio = 0.55; break;
            case 'diabetes': carbRatio = 0.35; break;
            case 'pcos': carbRatio = 0.40; break;
            case 'thyroid': targetCalories = Math.round(targetCalories * 0.9); break;
            case 'muscle_building': targetCalories += 300; carbRatio = 0.45; break;
            case 'hypertension': carbRatio = 0.50; break; 
        }

        const dailyCarbLimitGrams = Math.round((targetCalories * carbRatio) / 4);

        // 3. Unit Logic
        const qty = parseFloat(requestedQuantity) || 1;
        const unitLogic = {
            'kg': (qty * 1000) / 100, 'gm': qty / 100, 'ml': qty / 100,
            'piece': (qty * 180) / 100, 'plate': (qty * 350) / 100, 'bowl': (qty * 250) / 100
        };
        const factor = unitLogic[unit] || qty / 100;

        const usdaRes = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${nutritionGoal}&pageSize=5&api_key=${USDA_API_KEY}`);

        const recommendations = await Promise.all(usdaRes.data.foods.map(async (food) => {
            const getNutrient = (name) => {
                const n = food.foodNutrients.find(nut => nut.nutrientName.toLowerCase().includes(name.toLowerCase()));
                return n ? (n.value * factor).toFixed(1) : 0;
            };

            const protein = parseFloat(getNutrient('Protein'));
            const carbs = parseFloat(getNutrient('Carbohydrate'));
            const sodium = parseFloat(getNutrient('Sodium'));

            // Meta-lookup for local data
            const localMatch = await Food.findOne({ name: { $regex: nutritionGoal, $options: 'i' } }).select('image ingredients');

            // FIX: Enhanced Ingredient Detection
            // 1. Priority: Local DB Ingredients
            // 2. Secondary: USDA provided ingredients (if available in search result)
            // 3. Fallback: Composition based on Description
            let ingredientList = localMatch?.ingredients;
            if (!ingredientList && food.ingredients) {
                ingredientList = food.ingredients;
            }
            if (!ingredientList) {
                ingredientList = `Primary source: ${food.description}. Includes naturally occurring proteins and carbohydrates typical of ${food.foodCategory || 'this food category'}.`;
            }

            // Health Scoring
            let healthScore = 80, healthStatus = "Balanced", statusColor = "#0dcaf0";
            if (healthCondition === 'hypertension' && sodium > 400) {
                healthScore = 30; healthStatus = "High Sodium"; statusColor = "#dc3545";
            } else if (healthCondition === 'weight_loss' && getNutrient('Energy') > 450) {
                healthScore = 50; healthStatus = "High Calorie"; statusColor = "#fd7e14";
            }

            return {
                _id: food.fdcId,
                name: food.description,
                image: localMatch?.image || 'assets/default-food.jpg',
                ingredients: ingredientList,
                calories: getNutrient('Energy'),
                protein, carbs, sodium,
                price: Math.round(factor * 25) + 50, // Added small base price
                portionLabel: `${requestedQuantity} ${unit}`,
                healthImpact: { score: healthScore, label: healthStatus, color: statusColor },
                budgetImpact: ((carbs / dailyCarbLimitGrams) * 100).toFixed(1)
            };
        }));

        res.json({ targetCalories, dailyCarbLimitGrams, recommendations });
    } catch (error) {
        res.status(500).json({ message: "Analysis failed", error: error.message });
    }
});

module.exports = router;