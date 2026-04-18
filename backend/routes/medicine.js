// ============================================
// Medicine Info Route - POST /medicine
// Search a medicine name → get use, dosage,
// side effects using simple if-else data
// ============================================

const express = require('express');
const router = express.Router();

// ---- Medicine Database ----
// Each entry has: name, aliases, use, dosage, sideEffects, warnings
const medicines = [
  {
    names: ['paracetamol', 'acetaminophen', 'tylenol', 'calpol', 'panadol'],
    generic: 'Paracetamol (Acetaminophen)',
    emoji: '💊',
    category: 'Painkiller / Fever Reducer',
    use: 'Relieves mild to moderate pain (headache, toothache, body ache) and reduces fever.',
    dosage: 'Adults: 500mg–1000mg every 4–6 hours. Max 4000mg per day. Children: as per weight (consult doctor).',
    sideEffects: 'Rare at normal doses. Overdose can cause serious liver damage.',
    warnings: '⚠️ Do NOT exceed recommended dose. Avoid alcohol. Do not use if you have liver disease.',
    color: 'blue'
  },
  {
    names: ['ibuprofen', 'advil', 'brufen', 'nurofen', 'motrin'],
    generic: 'Ibuprofen',
    emoji: '💊',
    category: 'NSAID – Anti-inflammatory / Painkiller',
    use: 'Reduces pain, fever, and inflammation. Used for headaches, muscle pain, arthritis, menstrual cramps.',
    dosage: 'Adults: 200mg–400mg every 4–6 hours with food. Max 1200mg per day (OTC).',
    sideEffects: 'Stomach upset, nausea, heartburn. Rarely: stomach ulcers, kidney issues.',
    warnings: '⚠️ Take with food. Avoid if you have stomach ulcers, kidney disease, or are pregnant. Do not use with blood thinners.',
    color: 'blue'
  },
  {
    names: ['aspirin', 'disprin', 'ecosprin'],
    generic: 'Aspirin (Acetylsalicylic Acid)',
    emoji: '💊',
    category: 'NSAID / Blood Thinner',
    use: 'Relieves pain and fever. Low-dose aspirin is used to prevent heart attacks and strokes.',
    dosage: 'Pain/Fever: 325mg–650mg every 4–6 hours. Heart protection: 75mg–100mg daily (doctor prescribed).',
    sideEffects: 'Stomach irritation, bleeding risk, tinnitus (ringing in ears) at high doses.',
    warnings: '⚠️ Do NOT give to children under 16 (risk of Reye\'s syndrome). Avoid if you have bleeding disorders.',
    color: 'orange'
  },
  {
    names: ['amoxicillin', 'amoxil', 'trimox'],
    generic: 'Amoxicillin',
    emoji: '💊',
    category: 'Antibiotic (Penicillin group)',
    use: 'Treats bacterial infections: ear infections, throat infections, pneumonia, UTI, skin infections.',
    dosage: 'Adults: 250mg–500mg every 8 hours or 500mg–875mg every 12 hours. Complete the full course!',
    sideEffects: 'Diarrhea, nausea, rash. Rarely: allergic reaction.',
    warnings: '⚠️ PRESCRIPTION REQUIRED. Tell your doctor if you are allergic to penicillin. Complete the full course even if you feel better.',
    color: 'orange'
  },
  {
    names: ['cetirizine', 'zyrtec', 'reactine', 'cetzine'],
    generic: 'Cetirizine',
    emoji: '💊',
    category: 'Antihistamine (Allergy Medicine)',
    use: 'Relieves allergy symptoms: runny nose, sneezing, itchy eyes, skin rashes, hives.',
    dosage: 'Adults & children 6+: 10mg once daily. Children 2–6: 5mg once daily.',
    sideEffects: 'Drowsiness (less than older antihistamines), dry mouth, headache.',
    warnings: '⚠️ May cause drowsiness. Avoid driving or operating machinery. Avoid alcohol.',
    color: 'green'
  },
  {
    names: ['omeprazole', 'prilosec', 'losec', 'omez'],
    generic: 'Omeprazole',
    emoji: '💊',
    category: 'Proton Pump Inhibitor (Antacid)',
    use: 'Reduces stomach acid. Used for heartburn, acid reflux (GERD), stomach ulcers.',
    dosage: 'Adults: 20mg–40mg once daily before meals. Take for 4–8 weeks as directed.',
    sideEffects: 'Headache, nausea, diarrhea, stomach pain. Long-term use may affect magnesium/B12 levels.',
    warnings: '⚠️ Not for immediate heartburn relief. Long-term use should be supervised by a doctor.',
    color: 'green'
  },
  {
    names: ['metformin', 'glucophage', 'glycomet'],
    generic: 'Metformin',
    emoji: '💊',
    category: 'Antidiabetic (Type 2 Diabetes)',
    use: 'Controls blood sugar levels in Type 2 diabetes. Also used for PCOS.',
    dosage: 'Starting: 500mg twice daily with meals. Gradually increased by doctor. Max: 2550mg/day.',
    sideEffects: 'Nausea, diarrhea, stomach upset (usually improves over time). Rarely: lactic acidosis.',
    warnings: '⚠️ PRESCRIPTION REQUIRED. Take with food. Inform doctor before any surgery or CT scan with contrast dye.',
    color: 'orange'
  },
  {
    names: ['amlodipine', 'norvasc', 'amlong'],
    generic: 'Amlodipine',
    emoji: '💊',
    category: 'Calcium Channel Blocker (Blood Pressure)',
    use: 'Treats high blood pressure (hypertension) and chest pain (angina).',
    dosage: 'Adults: 5mg–10mg once daily. Dose adjusted by doctor.',
    sideEffects: 'Ankle swelling, flushing, headache, dizziness.',
    warnings: '⚠️ PRESCRIPTION REQUIRED. Do not stop suddenly. Monitor blood pressure regularly.',
    color: 'orange'
  },
  {
    names: ['azithromycin', 'zithromax', 'azee', 'z-pack'],
    generic: 'Azithromycin',
    emoji: '💊',
    category: 'Antibiotic (Macrolide)',
    use: 'Treats respiratory infections, ear infections, skin infections, STIs caused by bacteria.',
    dosage: 'Adults: 500mg on day 1, then 250mg daily for 4 days (Z-pack). Or as prescribed.',
    sideEffects: 'Nausea, diarrhea, stomach pain, vomiting.',
    warnings: '⚠️ PRESCRIPTION REQUIRED. Tell doctor about heart conditions. Complete the full course.',
    color: 'orange'
  },
  {
    names: ['loratadine', 'claritin', 'clarityn'],
    generic: 'Loratadine',
    emoji: '💊',
    category: 'Non-drowsy Antihistamine',
    use: 'Relieves allergy symptoms: hay fever, runny nose, sneezing, itchy eyes and skin.',
    dosage: 'Adults & children 6+: 10mg once daily.',
    sideEffects: 'Headache, dry mouth. Very rarely causes drowsiness.',
    warnings: '⚠️ Generally safe. Consult doctor if pregnant or breastfeeding.',
    color: 'green'
  },
  {
    names: ['vitamin c', 'ascorbic acid', 'celin'],
    generic: 'Vitamin C (Ascorbic Acid)',
    emoji: '🍊',
    category: 'Vitamin / Supplement',
    use: 'Boosts immune system, helps wound healing, acts as antioxidant. Prevents scurvy.',
    dosage: 'Adults: 500mg–1000mg daily. Dietary sources: oranges, lemons, guava, bell peppers.',
    sideEffects: 'High doses (>2000mg/day) may cause diarrhea, kidney stones.',
    warnings: '⚠️ Generally safe. Avoid mega-doses. Consult doctor if you have kidney stones.',
    color: 'green'
  },
  {
    names: ['vitamin d', 'cholecalciferol', 'calcirol'],
    generic: 'Vitamin D3 (Cholecalciferol)',
    emoji: '☀️',
    category: 'Vitamin / Supplement',
    use: 'Essential for bone health, immune function, and mood. Treats Vitamin D deficiency.',
    dosage: 'General: 600–2000 IU daily. Deficiency treatment: as prescribed by doctor.',
    sideEffects: 'Overdose can cause nausea, weakness, kidney damage. Rare at normal doses.',
    warnings: '⚠️ Get blood test before high-dose supplementation. Best source is sunlight (15–20 min/day).',
    color: 'green'
  },
  {
    names: ['ors', 'oral rehydration', 'electral', 'pedialyte'],
    generic: 'ORS (Oral Rehydration Solution)',
    emoji: '💧',
    category: 'Rehydration Solution',
    use: 'Replaces fluids and electrolytes lost due to diarrhea, vomiting, or dehydration.',
    dosage: 'Dissolve 1 sachet in 1 liter of clean water. Sip slowly throughout the day.',
    sideEffects: 'Very safe. Rarely: nausea if taken too fast.',
    warnings: '⚠️ Use clean/boiled water. Do not add extra sugar or salt. See doctor if dehydration is severe.',
    color: 'blue'
  },
  {
    names: ['antacid', 'gelusil', 'digene', 'tums', 'maalox'],
    generic: 'Antacid (Aluminum/Magnesium Hydroxide)',
    emoji: '💊',
    category: 'Antacid',
    use: 'Provides quick relief from heartburn, acid indigestion, and stomach upset.',
    dosage: 'Adults: 1–2 tablets or 10–20ml liquid after meals and at bedtime.',
    sideEffects: 'Constipation (aluminum-based) or diarrhea (magnesium-based).',
    warnings: '⚠️ Do not use for more than 2 weeks without doctor advice. May interfere with other medications.',
    color: 'green'
  }
];

// ---- POST /medicine ----
router.post('/', (req, res) => {
  const query = req.body.name?.toLowerCase().trim();

  if (!query) {
    return res.status(400).json({ error: 'Please provide a medicine name.' });
  }

  // Search for the medicine
  const found = medicines.find(med =>
    med.names.some(name => name.includes(query) || query.includes(name))
  );

  if (!found) {
    return res.json({
      found: false,
      message: `❓ Medicine "${req.body.name}" not found in our database. Please consult a pharmacist or doctor for information about this medicine.`
    });
  }

  res.json({
    found: true,
    generic: found.generic,
    emoji: found.emoji,
    category: found.category,
    use: found.use,
    dosage: found.dosage,
    sideEffects: found.sideEffects,
    warnings: found.warnings,
    color: found.color,
    disclaimer: true
  });
});

module.exports = router;
