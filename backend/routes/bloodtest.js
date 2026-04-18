// ============================================
// Blood Test Guide Route - GET /bloodtest
// Explains common blood tests in simple terms
// ============================================

const express = require('express');
const router = express.Router();

const bloodTests = [
  {
    id: 'cbc',
    name: 'CBC – Complete Blood Count',
    emoji: '🩸',
    category: 'General',
    whatItMeasures: 'Red blood cells (RBC), White blood cells (WBC), Hemoglobin, Hematocrit, Platelets.',
    whyDone: 'Screens for anemia, infections, immune disorders, clotting problems, and blood cancers.',
    normalRanges: [
      'Hemoglobin: Men 13.5–17.5 g/dL | Women 12–15.5 g/dL',
      'WBC: 4,500–11,000 cells/μL',
      'Platelets: 150,000–400,000/μL',
      'RBC: Men 4.5–5.9 million/μL | Women 4.1–5.1 million/μL'
    ],
    highMeans: 'High WBC may indicate infection or inflammation. High RBC may indicate dehydration.',
    lowMeans: 'Low hemoglobin = anemia. Low WBC = weakened immunity. Low platelets = bleeding risk.',
    tip: '💡 CBC is the most common blood test — often the first test ordered for any health concern.'
  },
  {
    id: 'hba1c',
    name: 'HbA1c – Glycated Hemoglobin',
    emoji: '🍬',
    category: 'Diabetes',
    whatItMeasures: 'Average blood sugar level over the past 2–3 months.',
    whyDone: 'Diagnoses and monitors diabetes and pre-diabetes.',
    normalRanges: [
      'Normal: Below 5.7%',
      'Pre-diabetes: 5.7% – 6.4%',
      'Diabetes: 6.5% or above',
      'Well-controlled diabetes target: Below 7%'
    ],
    highMeans: 'High HbA1c means blood sugar has been consistently high — indicates poor diabetes control.',
    lowMeans: 'Very low HbA1c may indicate hypoglycemia (low blood sugar) risk.',
    tip: '💡 Unlike fasting glucose, HbA1c doesn\'t require fasting. It gives a 3-month average picture.'
  },
  {
    id: 'lipid',
    name: 'Lipid Profile (Cholesterol Test)',
    emoji: '🫀',
    category: 'Heart Health',
    whatItMeasures: 'Total cholesterol, LDL (bad), HDL (good), Triglycerides.',
    whyDone: 'Assesses risk of heart disease, stroke, and atherosclerosis.',
    normalRanges: [
      'Total Cholesterol: Below 200 mg/dL (desirable)',
      'LDL (bad): Below 100 mg/dL (optimal)',
      'HDL (good): Above 60 mg/dL (protective)',
      'Triglycerides: Below 150 mg/dL'
    ],
    highMeans: 'High LDL and triglycerides increase risk of heart attack and stroke.',
    lowMeans: 'Low HDL increases heart disease risk. Low total cholesterol is rarely a concern.',
    tip: '💡 Fast for 9–12 hours before this test. Exercise and diet significantly affect results.'
  },
  {
    id: 'thyroid',
    name: 'TSH – Thyroid Stimulating Hormone',
    emoji: '🦋',
    category: 'Thyroid',
    whatItMeasures: 'How well your thyroid gland is working.',
    whyDone: 'Diagnoses hypothyroidism (underactive) and hyperthyroidism (overactive) thyroid.',
    normalRanges: [
      'Normal TSH: 0.4 – 4.0 mIU/L',
      'Hypothyroidism: TSH above 4.0',
      'Hyperthyroidism: TSH below 0.4'
    ],
    highMeans: 'High TSH = hypothyroidism (sluggish thyroid). Symptoms: fatigue, weight gain, cold intolerance.',
    lowMeans: 'Low TSH = hyperthyroidism (overactive thyroid). Symptoms: weight loss, rapid heartbeat, anxiety.',
    tip: '💡 Thyroid issues are very common, especially in women. A simple blood test can diagnose them.'
  },
  {
    id: 'glucose',
    name: 'Fasting Blood Glucose (FBG)',
    emoji: '🍭',
    category: 'Diabetes',
    whatItMeasures: 'Blood sugar level after fasting for 8–12 hours.',
    whyDone: 'Screens for diabetes and pre-diabetes.',
    normalRanges: [
      'Normal: 70–99 mg/dL',
      'Pre-diabetes: 100–125 mg/dL',
      'Diabetes: 126 mg/dL or above (on two separate tests)'
    ],
    highMeans: 'High fasting glucose indicates diabetes or pre-diabetes.',
    lowMeans: 'Below 70 mg/dL = hypoglycemia (low blood sugar). Can cause dizziness, sweating, confusion.',
    tip: '💡 Fast for at least 8 hours before this test. Drink only water during fasting.'
  },
  {
    id: 'liver',
    name: 'LFT – Liver Function Test',
    emoji: '🫀',
    category: 'Liver Health',
    whatItMeasures: 'ALT, AST, ALP, Bilirubin, Albumin, Total Protein.',
    whyDone: 'Checks liver health. Used to detect liver disease, monitor medications, and check for jaundice.',
    normalRanges: [
      'ALT: 7–56 U/L',
      'AST: 10–40 U/L',
      'ALP: 44–147 U/L',
      'Bilirubin (total): 0.1–1.2 mg/dL',
      'Albumin: 3.5–5.0 g/dL'
    ],
    highMeans: 'High ALT/AST = liver inflammation or damage (hepatitis, fatty liver, alcohol damage).',
    lowMeans: 'Low albumin may indicate liver disease, malnutrition, or kidney disease.',
    tip: '💡 Avoid alcohol for 24 hours before the test. Some medications can affect liver enzymes.'
  },
  {
    id: 'kidney',
    name: 'KFT – Kidney Function Test (Creatinine/BUN)',
    emoji: '🫘',
    category: 'Kidney Health',
    whatItMeasures: 'Creatinine, Blood Urea Nitrogen (BUN), eGFR (estimated filtration rate).',
    whyDone: 'Evaluates kidney function. Monitors kidney disease, diabetes complications, and medication effects.',
    normalRanges: [
      'Creatinine: Men 0.7–1.3 mg/dL | Women 0.6–1.1 mg/dL',
      'BUN: 7–20 mg/dL',
      'eGFR: Above 60 mL/min/1.73m² (normal)'
    ],
    highMeans: 'High creatinine/BUN = kidneys not filtering properly. May indicate kidney disease.',
    lowMeans: 'Low creatinine may indicate low muscle mass or malnutrition.',
    tip: '💡 Stay well hydrated before the test. Avoid heavy exercise the day before.'
  },
  {
    id: 'vitd',
    name: 'Vitamin D (25-OH Vitamin D)',
    emoji: '☀️',
    category: 'Vitamins',
    whatItMeasures: 'Level of Vitamin D in your blood.',
    whyDone: 'Diagnoses Vitamin D deficiency, which affects bones, immunity, and mood.',
    normalRanges: [
      'Deficient: Below 20 ng/mL',
      'Insufficient: 20–29 ng/mL',
      'Sufficient: 30–100 ng/mL',
      'Toxic: Above 100 ng/mL'
    ],
    highMeans: 'Very high Vitamin D (from supplements) can cause toxicity — nausea, kidney damage.',
    lowMeans: 'Low Vitamin D causes weak bones, fatigue, depression, frequent infections.',
    tip: '💡 Vitamin D deficiency is extremely common worldwide. Sunlight is the best natural source.'
  },
  {
    id: 'iron',
    name: 'Iron Studies (Serum Iron / Ferritin)',
    emoji: '⚙️',
    category: 'Anemia',
    whatItMeasures: 'Serum iron, Ferritin (iron stores), TIBC (Total Iron Binding Capacity).',
    whyDone: 'Diagnoses iron deficiency anemia and iron overload conditions.',
    normalRanges: [
      'Serum Iron: 60–170 μg/dL',
      'Ferritin: Men 12–300 ng/mL | Women 12–150 ng/mL',
      'TIBC: 240–450 μg/dL'
    ],
    highMeans: 'High ferritin may indicate iron overload (hemochromatosis) or inflammation.',
    lowMeans: 'Low ferritin = iron deficiency. Causes fatigue, pale skin, hair loss, shortness of breath.',
    tip: '💡 Iron deficiency is the most common nutritional deficiency worldwide, especially in women.'
  }
];

// ---- GET /bloodtest ----
// Returns all blood test summaries
router.get('/', (req, res) => {
  const summary = bloodTests.map(({ id, name, emoji, category, whyDone }) => ({
    id, name, emoji, category, whyDone
  }));
  res.json({ tests: summary });
});

// ---- GET /bloodtest/:id ----
// Returns a specific blood test detail
router.get('/:id', (req, res) => {
  const test = bloodTests.find(t => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Blood test not found.' });
  }
  res.json(test);
});

module.exports = router;
