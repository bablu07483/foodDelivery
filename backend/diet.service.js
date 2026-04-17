// backend/services/diet.service.js

const calculateNutritionalBudget = (userStats) => {
  const { age, gender, weight, height, healthCondition } = userStats;

  // 1. Base BMR Calculation
  let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'male' ? 5 : -161);
  
  // 2. Adjust BMR for specific conditions
  if (healthCondition === 'thyroid') {
    bmr = bmr * 0.85; // Hypothyroidism often slows metabolism by ~15%
  }

  // 3. TDEE (Maintenance Calories)
  let tdee = Math.round(bmr * 1.2);

  // 4. Dynamic Macro Ratios & Advice
  let ratios = { protein: 0.20, carbs: 0.55, fat: 0.25 }; // Standard
  let advice = "Follow a balanced diet with variety.";

  switch (healthCondition) {
    case 'diabetes':
      ratios = { protein: 0.30, carbs: 0.35, fat: 0.35 };
      advice = "Focus on Low-GI foods and high fiber to manage blood sugar.";
      break;
    case 'hypertension':
      ratios = { protein: 0.25, carbs: 0.50, fat: 0.25 };
      advice = "Strictly limit sodium intake below 2300mg/day. Focus on Potassium.";
      break;
    case 'pcos':
      ratios = { protein: 0.30, carbs: 0.40, fat: 0.30 };
      advice = "Anti-inflammatory foods and complex carbs are key for insulin resistance.";
      break;
    case 'thyroid':
      ratios = { protein: 0.30, carbs: 0.45, fat: 0.25 };
      advice = "Ensure adequate Iodine and Selenium. Limit raw cruciferous vegetables.";
      break;
    case 'muscle_building':
      tdee += 300; // Caloric surplus for growth
      ratios = { protein: 0.35, carbs: 0.45, fat: 0.20 };
      advice = "High protein intake required for muscle synthesis. Maintain a surplus.";
      break;
  }

  return {
    tdee,
    proteinGrams: Math.round((tdee * ratios.protein) / 4),
    carbGrams: Math.round((tdee * ratios.carbs) / 4),
    fatGrams: Math.round((tdee * ratios.fat) / 9),
    advice
  };
};

module.exports = { calculateNutritionalBudget };