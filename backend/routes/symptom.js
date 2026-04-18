// ============================================
// Symptom Route - POST /symptom  v2.0
// Enhanced with: age, gender, duration inputs
// for more relevant suggestions + risk level
// ============================================

const express = require('express');
const router = express.Router();

const symptomRules = [
  // ---- Emergency ----
  {
    symptoms: ['chest pain', 'shortness of breath', 'sweating'],
    condition: '🚨 Possible Heart Attack',
    severity: 'Emergency',
    riskLevel: 5,
    advice: 'Call emergency services (911) immediately! Do not drive yourself. Chew an aspirin (325mg) if not allergic while waiting for help.',
    medicines: 'Aspirin 325mg (chew immediately if not allergic)',
    erAdvice: '🚨 GO TO ER IMMEDIATELY — This is a life-threatening emergency.',
    color: 'red'
  },
  {
    symptoms: ['severe headache', 'stiff neck', 'fever', 'sensitivity to light'],
    condition: '🚨 Possible Meningitis',
    severity: 'Emergency',
    riskLevel: 5,
    advice: 'Seek emergency medical care immediately. Meningitis is a serious infection of the brain lining.',
    medicines: 'Requires IV antibiotics — hospital treatment only.',
    erAdvice: '🚨 GO TO ER IMMEDIATELY.',
    color: 'red'
  },
  {
    symptoms: ['chest pain', 'shortness of breath'],
    condition: '🚨 Possible Cardiac or Pulmonary Emergency',
    severity: 'Emergency',
    riskLevel: 5,
    advice: 'Chest pain with breathing difficulty is always serious. Call emergency services immediately.',
    medicines: 'Aspirin 325mg if heart attack suspected.',
    erAdvice: '🚨 GO TO ER IMMEDIATELY.',
    color: 'red'
  },

  // ---- Respiratory ----
  {
    symptoms: ['fever', 'cough', 'shortness of breath', 'fatigue'],
    condition: '🫁 Possible Pneumonia or Severe Flu',
    severity: 'Moderate – See a Doctor',
    riskLevel: 3,
    advice: 'Rest, stay hydrated, and see a doctor soon. You may need a chest X-ray and antibiotics.',
    medicines: 'Paracetamol for fever. Antibiotics if bacterial (prescription needed).',
    erAdvice: 'See a doctor within 24 hours. Go to ER if breathing becomes very difficult.',
    color: 'orange'
  },
  {
    symptoms: ['fever', 'cough', 'sore throat', 'runny nose'],
    condition: '🤧 Likely Common Cold or Flu',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Rest at home, drink warm fluids, take paracetamol for fever. See a doctor if symptoms worsen after 5 days.',
    medicines: 'Paracetamol 500mg for fever. Cetirizine 10mg for runny nose. Honey + lemon for cough.',
    erAdvice: 'Home care is sufficient. See a doctor if fever exceeds 103°F or lasts more than 3 days.',
    color: 'yellow'
  },
  {
    symptoms: ['cough', 'wheezing', 'shortness of breath'],
    condition: '💨 Possible Asthma or Bronchitis',
    severity: 'Moderate – See a Doctor',
    riskLevel: 3,
    advice: 'Avoid triggers like dust and smoke. Use your inhaler if prescribed. See a doctor for proper diagnosis.',
    medicines: 'Bronchodilator inhaler (Salbutamol) if prescribed. See doctor for diagnosis.',
    erAdvice: 'Go to ER if breathing is severely labored or lips turn blue.',
    color: 'orange'
  },
  {
    symptoms: ['fever', 'cough'],
    condition: '🤒 Possible Respiratory Infection',
    severity: 'Mild to Moderate',
    riskLevel: 2,
    advice: 'Rest, stay hydrated, and monitor your temperature. See a doctor if fever exceeds 103°F or lasts more than 3 days.',
    medicines: 'Paracetamol 500mg every 6 hours. Warm fluids and steam inhalation.',
    erAdvice: 'See a doctor if fever is very high or symptoms worsen.',
    color: 'yellow'
  },

  // ---- Digestive ----
  {
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach pain'],
    condition: '🦠 Possible Food Poisoning or Gastroenteritis',
    severity: 'Moderate',
    riskLevel: 3,
    advice: 'Stay hydrated with ORS solution. Eat bland foods (rice, bananas, toast). See a doctor if symptoms last more than 2 days.',
    medicines: 'ORS sachets for hydration. Domperidone 10mg for nausea. Loperamide for diarrhea (not if bloody).',
    erAdvice: 'Go to ER if severely dehydrated, blood in stool, or symptoms last more than 2 days.',
    color: 'orange'
  },
  {
    symptoms: ['stomach pain', 'bloating', 'gas'],
    condition: '🫃 Likely Indigestion or IBS',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Avoid spicy and fatty foods. Eat smaller meals. Try antacids. See a doctor if pain is severe or recurring.',
    medicines: 'Antacid (Gelusil, Tums) after meals. Omeprazole 20mg before breakfast for acid reflux.',
    erAdvice: 'Home care usually sufficient. See doctor if pain is severe or recurring.',
    color: 'yellow'
  },
  {
    symptoms: ['nausea', 'vomiting'],
    condition: '🤢 Possible Gastritis or Motion Sickness',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Sip clear fluids slowly. Avoid solid food for a few hours. Rest. See a doctor if vomiting is persistent.',
    medicines: 'Domperidone 10mg before meals. ORS to prevent dehydration. Ginger tea as natural remedy.',
    erAdvice: 'See doctor if vomiting persists more than 24 hours or you cannot keep fluids down.',
    color: 'yellow'
  },

  // ---- Infections ----
  {
    symptoms: ['fever', 'body ache', 'fatigue', 'headache'],
    condition: '🦠 Likely Viral Fever or Flu',
    severity: 'Mild to Moderate',
    riskLevel: 2,
    advice: 'Rest, drink plenty of fluids, take paracetamol. See a doctor if fever is very high or lasts more than 3 days.',
    medicines: 'Paracetamol 500mg every 6 hours. Vitamin C 500mg daily. ORS if sweating heavily.',
    erAdvice: 'See doctor if fever exceeds 103°F, lasts more than 3 days, or you have difficulty breathing.',
    color: 'yellow'
  },
  {
    symptoms: ['fever', 'rash', 'joint pain'],
    condition: '🦟 Possible Dengue or Viral Infection',
    severity: 'Moderate – See a Doctor',
    riskLevel: 4,
    advice: 'See a doctor immediately for blood tests (CBC, dengue NS1). Stay hydrated. Avoid aspirin or ibuprofen.',
    medicines: 'Paracetamol ONLY for fever (NOT aspirin or ibuprofen — increases bleeding risk in dengue).',
    erAdvice: 'See doctor within 24 hours for blood tests. Go to ER if bleeding, severe abdominal pain, or persistent vomiting.',
    color: 'orange'
  },
  {
    symptoms: ['sore throat', 'fever', 'swollen glands'],
    condition: '😮 Possible Strep Throat or Tonsillitis',
    severity: 'Moderate',
    riskLevel: 2,
    advice: 'See a doctor for a throat swab. You may need antibiotics. Gargle with warm salt water for relief.',
    medicines: 'Paracetamol for pain/fever. Strepsils lozenges. Antibiotics if bacterial (prescription needed).',
    erAdvice: 'See doctor if difficulty swallowing, drooling, or throat is severely swollen.',
    color: 'orange'
  },

  // ---- Neurological ----
  {
    symptoms: ['headache', 'dizziness', 'nausea'],
    condition: '🤕 Possible Migraine or Vertigo',
    severity: 'Mild to Moderate',
    riskLevel: 2,
    advice: 'Rest in a quiet, dark room. Stay hydrated. Take a mild painkiller. See a doctor if headaches are frequent.',
    medicines: 'Paracetamol 1000mg or Ibuprofen 400mg. Domperidone for nausea. Betahistine for vertigo (prescription).',
    erAdvice: 'Go to ER if sudden severe headache, headache with fever + stiff neck, or headache after head injury.',
    color: 'yellow'
  },
  {
    symptoms: ['headache', 'fever'],
    condition: '🤒 Possible Viral Infection',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Rest, drink fluids, and take paracetamol. Monitor your temperature. See a doctor if symptoms worsen.',
    medicines: 'Paracetamol 500mg every 6 hours. Cool compress on forehead.',
    erAdvice: 'See doctor if fever exceeds 103°F or headache is very severe.',
    color: 'yellow'
  },

  // ---- Skin ----
  {
    symptoms: ['rash', 'itching', 'swelling'],
    condition: '🩹 Possible Allergic Reaction',
    severity: 'Mild to Moderate',
    riskLevel: 2,
    advice: 'Take an antihistamine. Avoid the suspected allergen. Apply calamine lotion. See a doctor if swelling is near throat or face.',
    medicines: 'Cetirizine 10mg once daily. Calamine lotion topically. Hydrocortisone 1% cream for inflammation.',
    erAdvice: 'Go to ER IMMEDIATELY if throat swelling, difficulty breathing, or widespread hives (anaphylaxis).',
    color: 'yellow'
  },

  // ---- Single Symptoms ----
  {
    symptoms: ['fever'],
    condition: '🌡️ Fever',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Rest, drink plenty of water, and take paracetamol. See a doctor if fever exceeds 103°F or lasts more than 3 days.',
    medicines: 'Paracetamol 500mg every 4–6 hours (max 4 doses/day). Cool compress on forehead.',
    erAdvice: 'See doctor if fever exceeds 103°F, lasts more than 3 days, or infant under 3 months has any fever.',
    color: 'yellow'
  },
  {
    symptoms: ['cough'],
    condition: '😷 Cough',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Try warm water with honey. Avoid cold drinks. See a doctor if cough persists more than 2 weeks.',
    medicines: 'Honey + lemon in warm water. Dextromethorphan for dry cough. Guaifenesin for wet cough.',
    erAdvice: 'See doctor if coughing blood, difficulty breathing, or cough lasts more than 3 weeks.',
    color: 'yellow'
  },
  {
    symptoms: ['headache'],
    condition: '🤕 Headache',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Drink water, rest, and take a mild painkiller. If headaches are frequent or very severe, see a doctor.',
    medicines: 'Paracetamol 500–1000mg or Ibuprofen 400mg (with food). Stay hydrated.',
    erAdvice: 'Go to ER for sudden severe headache, headache with fever + stiff neck, or after head injury.',
    color: 'yellow'
  },
  {
    symptoms: ['fatigue'],
    condition: '😴 Fatigue',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Ensure 7–8 hours of sleep, eat balanced meals, and stay hydrated. If fatigue persists, get a blood test.',
    medicines: 'Iron + Folic Acid if anemic. Vitamin D3 if deficient. Multivitamin as general support.',
    erAdvice: 'See doctor if fatigue is severe, persistent (more than 2 weeks), or with weight loss/fever.',
    color: 'yellow'
  },
  {
    symptoms: ['dizziness'],
    condition: '💫 Dizziness',
    severity: 'Mild',
    riskLevel: 1,
    advice: 'Sit or lie down immediately. Drink water. Avoid sudden movements. See a doctor if dizziness is frequent.',
    medicines: 'Betahistine for vertigo (prescription). ORS if dehydrated. Avoid sudden position changes.',
    erAdvice: 'Go to ER if dizziness with chest pain, severe headache, vision changes, or difficulty speaking.',
    color: 'yellow'
  }
];

// ---- Risk level modifiers based on age/gender/duration ----
function adjustRisk(baseRisk, age, gender, duration) {
  let risk = baseRisk;

  // Age adjustments
  if (age) {
    const ageNum = parseInt(age);
    if (ageNum < 5 || ageNum > 65) risk = Math.min(5, risk + 1); // Very young or elderly = higher risk
  }

  // Duration adjustments
  if (duration) {
    const days = parseInt(duration);
    if (days > 7) risk = Math.min(5, risk + 1);  // Symptoms lasting more than a week
    if (days > 14) risk = Math.min(5, risk + 1); // More than 2 weeks
  }

  return risk;
}

// ---- POST /symptom ----
router.post('/', (req, res) => {
  const { symptoms: inputSymptoms, age, gender, duration } = req.body;

  if (!inputSymptoms || !Array.isArray(inputSymptoms) || inputSymptoms.length === 0) {
    return res.status(400).json({ error: 'Please provide at least one symptom.' });
  }

  const normalizedInput = inputSymptoms.map(s => s.toLowerCase().trim());

  let bestMatch = null;
  let bestMatchCount = 0;

  // Find best exact match first
  for (const rule of symptomRules) {
    const matchCount = rule.symptoms.filter(s => normalizedInput.includes(s)).length;
    if (matchCount === rule.symptoms.length && matchCount > bestMatchCount) {
      bestMatch = rule;
      bestMatchCount = matchCount;
    }
  }

  // Partial match fallback
  if (!bestMatch) {
    for (const rule of symptomRules) {
      const matchCount = rule.symptoms.filter(s => normalizedInput.includes(s)).length;
      if (matchCount > bestMatchCount) {
        bestMatch = rule;
        bestMatchCount = matchCount;
      }
    }
  }

  if (!bestMatch) {
    return res.json({
      condition: '❓ Unknown',
      severity: 'Unknown',
      riskLevel: 0,
      advice: 'I could not identify a condition based on these symptoms. Please consult a doctor for proper diagnosis.',
      medicines: 'Please consult a doctor.',
      erAdvice: 'If symptoms are severe or worsening, seek medical attention.',
      color: 'gray',
      disclaimer: true
    });
  }

  // Adjust risk based on patient profile
  const adjustedRisk = adjustRisk(bestMatch.riskLevel, age, gender, duration);

  // Build context-aware advice additions
  let contextNote = '';
  if (age && parseInt(age) < 5) {
    contextNote += '\n\n👶 **Note for young children:** Symptoms in children under 5 can worsen quickly. Consult a pediatrician promptly.';
  }
  if (age && parseInt(age) > 65) {
    contextNote += '\n\n👴 **Note for elderly patients:** Older adults may have atypical symptoms. Lower threshold for seeking medical care.';
  }
  if (gender === 'female' && (normalizedInput.includes('chest pain') || normalizedInput.includes('fatigue'))) {
    contextNote += '\n\n👩 **Note:** Women may experience heart attack symptoms differently — fatigue, nausea, and jaw pain without classic chest pain.';
  }
  if (duration && parseInt(duration) > 7) {
    contextNote += `\n\n⏱️ **Duration note:** Symptoms lasting ${duration} days warrant a doctor visit even if mild.`;
  }

  res.json({
    condition: bestMatch.condition,
    severity: bestMatch.severity,
    riskLevel: adjustedRisk,
    advice: bestMatch.advice + contextNote,
    medicines: bestMatch.medicines,
    erAdvice: bestMatch.erAdvice,
    color: bestMatch.color,
    matchedSymptoms: bestMatch.symptoms.filter(s => normalizedInput.includes(s)),
    disclaimer: true
  });
});

module.exports = router;
