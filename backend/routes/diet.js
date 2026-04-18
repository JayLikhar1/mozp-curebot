// ============================================
// Diet Planner Route - POST /diet
// Returns a basic meal plan based on condition
// ============================================

const express = require('express');
const router = express.Router();

// ---- Diet Plans by Condition ----
const dietPlans = {
  diabetes: {
    title: '🩸 Diet Plan for Diabetes (Type 2)',
    goal: 'Control blood sugar levels through low-glycemic, balanced eating.',
    color: 'blue',
    doEat: [
      '🥦 Non-starchy vegetables: broccoli, spinach, cauliflower, cucumber',
      '🐟 Lean proteins: fish, chicken breast, eggs, lentils, tofu',
      '🌾 Whole grains: brown rice, oats, whole wheat bread (small portions)',
      '🫘 Legumes: chickpeas, kidney beans, lentils (low glycemic index)',
      '🥑 Healthy fats: avocado, olive oil, nuts (in moderation)',
      '🍓 Low-sugar fruits: berries, apple, pear, guava (small portions)',
      '💧 Water, herbal teas, buttermilk (no sugar)'
    ],
    avoid: [
      '🚫 White rice, white bread, maida (refined flour)',
      '🚫 Sugary drinks: soda, juice, energy drinks',
      '🚫 Sweets, candy, cakes, pastries',
      '🚫 Fried foods and fast food',
      '🚫 High-sugar fruits: mango, banana, grapes (limit)',
      '🚫 Alcohol'
    ],
    sampleDay: {
      breakfast: 'Oatmeal with berries + 2 boiled eggs + green tea (no sugar)',
      lunch: 'Brown rice (small) + dal + mixed vegetable curry + salad',
      snack: 'Handful of almonds + cucumber slices',
      dinner: 'Grilled fish/chicken + steamed vegetables + 1 small whole wheat roti'
    },
    tip: '💡 Eat small meals every 3–4 hours. Never skip meals. Monitor blood sugar regularly.'
  },

  hypertension: {
    title: '💊 Diet Plan for High Blood Pressure (Hypertension)',
    goal: 'Reduce sodium intake and follow the DASH diet to lower blood pressure.',
    color: 'orange',
    doEat: [
      '🥬 Leafy greens: spinach, kale, lettuce (high in potassium)',
      '🍌 Potassium-rich foods: banana, sweet potato, avocado',
      '🐟 Fatty fish: salmon, mackerel (omega-3 fatty acids)',
      '🫐 Berries: blueberries, strawberries (antioxidants)',
      '🥛 Low-fat dairy: yogurt, skim milk (calcium)',
      '🌾 Whole grains: oats, brown rice, whole wheat',
      '🧄 Garlic (natural blood pressure reducer)',
      '💧 Water — at least 8 glasses daily'
    ],
    avoid: [
      '🚫 Salt and salty foods: pickles, chips, processed meats',
      '🚫 Canned soups and sauces (high sodium)',
      '🚫 Red meat and full-fat dairy',
      '🚫 Alcohol and caffeine (limit)',
      '🚫 Fried and fast foods',
      '🚫 Frozen meals and packaged snacks'
    ],
    sampleDay: {
      breakfast: 'Oatmeal with banana + low-fat yogurt + herbal tea',
      lunch: 'Grilled chicken salad with olive oil dressing + whole wheat bread',
      snack: 'Fresh fruit + handful of unsalted nuts',
      dinner: 'Baked fish + steamed broccoli + brown rice (small portion)'
    },
    tip: '💡 Limit sodium to less than 2300mg/day (about 1 teaspoon of salt). Read food labels!'
  },

  weightloss: {
    title: '⚖️ Diet Plan for Weight Loss',
    goal: 'Create a calorie deficit while maintaining nutrition and energy.',
    color: 'green',
    doEat: [
      '🥗 Salads with lots of vegetables (low calorie, high fiber)',
      '🐔 Lean proteins: chicken breast, fish, eggs, legumes (keep you full)',
      '🥦 Non-starchy vegetables: fill half your plate',
      '🍎 Whole fruits (not juice) — fiber slows sugar absorption',
      '🌾 Small portions of whole grains',
      '💧 Water before meals (reduces appetite)',
      '🍵 Green tea (boosts metabolism slightly)'
    ],
    avoid: [
      '🚫 Sugary drinks and alcohol (empty calories)',
      '🚫 Fried foods and fast food',
      '🚫 White bread, pasta, rice (refined carbs)',
      '🚫 Processed snacks: chips, cookies, crackers',
      '🚫 Large portions — use smaller plates',
      '🚫 Late-night eating'
    ],
    sampleDay: {
      breakfast: '2 scrambled eggs + 1 slice whole wheat toast + black coffee/green tea',
      lunch: 'Large salad with grilled chicken + olive oil + lemon dressing',
      snack: 'Apple + 10 almonds',
      dinner: 'Grilled fish + steamed vegetables + small bowl of lentil soup'
    },
    tip: '💡 Aim to lose 0.5–1 kg per week. Crash diets don\'t work long-term. Exercise + diet together is key.'
  },

  weightgain: {
    title: '💪 Diet Plan for Healthy Weight Gain',
    goal: 'Increase calorie intake with nutrient-dense foods to gain healthy weight.',
    color: 'blue',
    doEat: [
      '🥜 Nuts and nut butters: peanut butter, almond butter (calorie-dense)',
      '🥑 Avocado (healthy fats + calories)',
      '🍚 Rice, pasta, potatoes (complex carbs)',
      '🥛 Full-fat dairy: milk, yogurt, cheese',
      '🥚 Eggs (protein + healthy fats)',
      '🐟 Fatty fish: salmon, tuna',
      '🍌 Bananas, mangoes, dried fruits (calorie-rich fruits)',
      '🫘 Legumes: lentils, chickpeas, beans'
    ],
    avoid: [
      '🚫 Junk food and fried food (unhealthy weight gain)',
      '🚫 Skipping meals',
      '🚫 Excessive sugar and sweets',
      '🚫 Drinking water right before meals (reduces appetite)'
    ],
    sampleDay: {
      breakfast: 'Oatmeal with full-fat milk + banana + peanut butter + boiled eggs',
      lunch: 'Rice + dal + chicken curry + salad + yogurt',
      snack: 'Peanut butter sandwich + glass of milk + handful of nuts',
      dinner: 'Pasta with meat sauce + garlic bread + fruit salad'
    },
    tip: '💡 Eat every 3 hours. Add healthy calorie-dense foods. Combine with strength training for muscle gain.'
  },

  heartdisease: {
    title: '❤️ Diet Plan for Heart Disease',
    goal: 'Reduce cholesterol, saturated fats, and sodium to protect heart health.',
    color: 'red',
    doEat: [
      '🐟 Fatty fish: salmon, sardines, mackerel (omega-3)',
      '🫐 Berries and colorful fruits (antioxidants)',
      '🥬 Leafy greens: spinach, kale (vitamin K, nitrates)',
      '🌾 Whole grains: oats, brown rice, quinoa',
      '🫘 Legumes: beans, lentils (fiber + protein)',
      '🥜 Walnuts and almonds (heart-healthy fats)',
      '🫒 Olive oil (replace butter)',
      '🧄 Garlic and turmeric (anti-inflammatory)'
    ],
    avoid: [
      '🚫 Trans fats: margarine, fried foods, packaged snacks',
      '🚫 Saturated fats: red meat, full-fat dairy, butter',
      '🚫 Salt and high-sodium foods',
      '🚫 Sugary foods and drinks',
      '🚫 Alcohol',
      '🚫 Processed meats: sausage, bacon, hot dogs'
    ],
    sampleDay: {
      breakfast: 'Oatmeal with walnuts + berries + green tea',
      lunch: 'Grilled salmon + quinoa + steamed broccoli + salad',
      snack: 'Apple + handful of almonds',
      dinner: 'Lentil soup + whole wheat bread + mixed vegetable stir-fry in olive oil'
    },
    tip: '💡 The Mediterranean diet is proven to reduce heart disease risk. Focus on plants, fish, and olive oil.'
  },

  general: {
    title: '🥗 General Healthy Diet Plan',
    goal: 'Maintain overall health with a balanced, nutritious diet.',
    color: 'green',
    doEat: [
      '🥦 Vegetables: fill half your plate at every meal',
      '🍎 Fruits: 2–3 servings daily (whole fruit, not juice)',
      '🌾 Whole grains: brown rice, oats, whole wheat bread',
      '🐟 Lean proteins: fish, chicken, eggs, legumes',
      '🥛 Dairy or alternatives: milk, yogurt, fortified plant milk',
      '🥜 Healthy fats: nuts, seeds, olive oil, avocado',
      '💧 Water: 8+ glasses daily'
    ],
    avoid: [
      '🚫 Ultra-processed foods: chips, cookies, instant noodles',
      '🚫 Sugary drinks: soda, energy drinks, packaged juices',
      '🚫 Excessive salt and sugar',
      '🚫 Trans fats and fried foods',
      '🚫 Alcohol in excess'
    ],
    sampleDay: {
      breakfast: 'Whole grain cereal/oats + milk + banana + boiled egg',
      lunch: 'Rice/roti + dal/chicken + vegetables + salad + yogurt',
      snack: 'Fresh fruit + handful of nuts',
      dinner: 'Grilled protein + steamed vegetables + whole grain + soup'
    },
    tip: '💡 The 80/20 rule: eat healthy 80% of the time. Enjoy treats in moderation without guilt.'
  }
};

// ---- POST /diet ----
router.post('/', (req, res) => {
  const condition = req.body.condition?.toLowerCase().trim();

  if (!condition) {
    return res.status(400).json({ error: 'Please provide a condition.' });
  }

  // Map user input to diet plan keys
  let planKey = 'general';

  if (condition.includes('diabet') || condition.includes('blood sugar') || condition.includes('sugar')) {
    planKey = 'diabetes';
  } else if (condition.includes('blood pressure') || condition.includes('hypertension') || condition.includes('bp') || condition.includes('high bp')) {
    planKey = 'hypertension';
  } else if (condition.includes('weight loss') || condition.includes('lose weight') || condition.includes('overweight') || condition.includes('obese')) {
    planKey = 'weightloss';
  } else if (condition.includes('weight gain') || condition.includes('gain weight') || condition.includes('underweight') || condition.includes('thin')) {
    planKey = 'weightgain';
  } else if (condition.includes('heart') || condition.includes('cholesterol') || condition.includes('cardiac')) {
    planKey = 'heartdisease';
  }

  const plan = dietPlans[planKey];
  res.json({ ...plan, disclaimer: true });
});

module.exports = router;
