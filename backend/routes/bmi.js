// ============================================
// BMI Route - POST /bmi  v2.0
// Enhanced with: BMR, waist-to-height ratio,
// calorie needs, ideal weight goal
// ============================================

const express = require('express');
const router = express.Router();

// ---- POST /bmi ----
router.post('/', (req, res) => {
  const { height, weight, unit, age, gender, activityLevel, waist } = req.body;

  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'Please provide valid height and weight values.' });
  }

  let h = parseFloat(height);
  let w = parseFloat(weight);

  if (h <= 0 || w <= 0) {
    return res.status(400).json({ error: 'Height and weight must be positive numbers.' });
  }

  let bmi, heightInMeters, weightInKg;

  if (unit === 'imperial') {
    heightInMeters = h * 0.0254;
    weightInKg = w * 0.453592;
  } else {
    heightInMeters = h / 100;
    weightInKg = w;
  }

  bmi = Math.round((weightInKg / (heightInMeters * heightInMeters)) * 10) / 10;

  // ---- BMI Category ----
  let category, advice, color, emoji;
  if (bmi < 18.5) {
    category = 'Underweight'; emoji = '⚠️'; color = 'blue';
    advice = 'You are underweight. Consider eating more nutritious, calorie-rich foods. Consult a doctor or nutritionist for a healthy weight gain plan.';
  } else if (bmi < 25) {
    category = 'Normal Weight'; emoji = '✅'; color = 'green';
    advice = 'Great! Your weight is in the healthy range. Maintain it with a balanced diet and regular exercise.';
  } else if (bmi < 30) {
    category = 'Overweight'; emoji = '⚠️'; color = 'orange';
    advice = 'You are slightly overweight. Try to incorporate more physical activity and reduce processed foods.';
  } else if (bmi < 35) {
    category = 'Obese (Class I)'; emoji = '🔴'; color = 'red';
    advice = 'Your BMI indicates obesity. This increases risk of diabetes, heart disease, and other conditions. Please consult a doctor.';
  } else {
    category = 'Severely Obese (Class II+)'; emoji = '🔴'; color = 'darkred';
    advice = 'Your BMI indicates severe obesity. Please seek medical advice for a safe and supervised weight management program.';
  }

  // ---- Ideal Weight Range ----
  const idealMin = Math.round(18.5 * heightInMeters * heightInMeters * 10) / 10;
  const idealMax = Math.round(24.9 * heightInMeters * heightInMeters * 10) / 10;

  // ---- BMR (Basal Metabolic Rate) ----
  // Mifflin-St Jeor Equation (most accurate)
  let bmr = null;
  let tdee = null;
  let calorieGoal = null;

  if (age && gender) {
    const ageNum = parseFloat(age);
    if (gender === 'male') {
      bmr = Math.round(10 * weightInKg + 6.25 * (heightInMeters * 100) - 5 * ageNum + 5);
    } else {
      bmr = Math.round(10 * weightInKg + 6.25 * (heightInMeters * 100) - 5 * ageNum - 161);
    }

    // TDEE = BMR × Activity Multiplier
    const activityMultipliers = {
      sedentary:    1.2,   // Little or no exercise
      light:        1.375, // Light exercise 1–3 days/week
      moderate:     1.55,  // Moderate exercise 3–5 days/week
      active:       1.725, // Hard exercise 6–7 days/week
      veryactive:   1.9    // Very hard exercise + physical job
    };

    const multiplier = activityMultipliers[activityLevel] || 1.2;
    tdee = Math.round(bmr * multiplier);

    // Calorie goals
    calorieGoal = {
      maintain:   tdee,
      loseWeight: tdee - 500,  // ~0.5kg/week loss
      gainWeight: tdee + 500   // ~0.5kg/week gain
    };
  }

  // ---- Waist-to-Height Ratio ----
  let waistRatio = null;
  if (waist) {
    const waistCm = unit === 'imperial' ? parseFloat(waist) * 2.54 : parseFloat(waist);
    const heightCm = heightInMeters * 100;
    const ratio = Math.round((waistCm / heightCm) * 100) / 100;

    let waistCategory, waistColor;
    if (ratio < 0.4) {
      waistCategory = 'Underweight range'; waistColor = 'blue';
    } else if (ratio < 0.5) {
      waistCategory = 'Healthy ✅'; waistColor = 'green';
    } else if (ratio < 0.6) {
      waistCategory = 'Overweight range'; waistColor = 'orange';
    } else {
      waistCategory = 'Obese range'; waistColor = 'red';
    }

    waistRatio = { ratio, category: waistCategory, color: waistColor };
  }

  // ---- Weight to Lose/Gain to reach ideal ----
  const weightDiff = unit === 'imperial'
    ? Math.round((weightInKg - (idealMin + idealMax) / 2) / 0.453592 * 10) / 10
    : Math.round((weightInKg - (idealMin + idealMax) / 2) * 10) / 10;

  res.json({
    bmi,
    category,
    emoji,
    color,
    advice,
    idealWeightRange: {
      min: unit === 'imperial' ? Math.round(idealMin / 0.453592 * 10) / 10 : idealMin,
      max: unit === 'imperial' ? Math.round(idealMax / 0.453592 * 10) / 10 : idealMax,
      unit: unit === 'imperial' ? 'lbs' : 'kg'
    },
    weightDiff: {
      value: Math.abs(weightDiff),
      direction: weightDiff > 0 ? 'lose' : weightDiff < 0 ? 'gain' : 'maintain',
      unit: unit === 'imperial' ? 'lbs' : 'kg'
    },
    bmr,
    tdee,
    calorieGoal,
    waistRatio,
    disclaimer: true
  });
});

module.exports = router;
