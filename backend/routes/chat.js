// ============================================
// Chat Route - POST /chat  v2.0
// Enhanced with: medicine suggestions,
// ER guidance, follow-up questions,
// multi-language support (EN/HI/UR)
// ============================================

const express = require('express');
const router = express.Router();

// ---- Multi-language greetings ----
const langGreetings = {
  hi:  'नमस्ते! 👋 मैं Curebot हूँ, आपका AI मेडिकल असिस्टेंट। आप हिंदी में पूछ सकते हैं।',
  ur:  'السلام علیکم! 👋 میں Curebot ہوں، آپ کا AI طبی معاون۔ آپ اردو میں پوچھ سکتے ہیں۔',
  en:  "Hello! 👋 I'm Curebot, your AI medical assistant. How can I help you today?"
};

// ---- Responses Database ----
// Each entry: keywords, reply, medicine (optional), erAdvice (optional), followUp (optional)
const responses = [

  // ---- Greetings ----
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon'],
    reply: "Hello! 👋 I'm **Curebot**, your AI medical assistant.\n\nI can help with:\n• Health questions & symptoms\n• Medicine information\n• BMI & health calculators\n• First aid guides\n• Diet plans\n\nWhat can I help you with today?",
    followUp: null
  },
  // Hindi greeting
  {
    keywords: ['namaste', 'namaskar', 'नमस्ते', 'हेलो'],
    reply: "नमस्ते! 🙏 मैं **Curebot** हूँ। मैं आपके स्वास्थ्य संबंधी सवालों में मदद कर सकता हूँ।\n\nआप पूछ सकते हैं:\n• बुखार, खांसी, सिरदर्द\n• दवाइयों की जानकारी\n• BMI कैलकुलेटर\n\n⚠️ यह सामान्य जानकारी है, डॉक्टर की सलाह लें।",
    followUp: null
  },
  // Urdu greeting
  {
    keywords: ['salam', 'assalam', 'السلام', 'آداب'],
    reply: "السلام علیکم! 🌙 میں **Curebot** ہوں۔ میں آپ کی صحت سے متعلق سوالات میں مدد کر سکتا ہوں۔\n\nآپ پوچھ سکتے ہیں:\n• بخار، کھانسی، سر درد\n• دوائیوں کی معلومات\n• BMI کیلکولیٹر\n\n⚠️ یہ عام معلومات ہے، ڈاکٹر سے مشورہ کریں۔",
    followUp: null
  },

  // ---- Fever ----
  {
    keywords: ['fever', 'temperature', 'bukhar', 'بخار', 'बुखार'],
    reply: "🌡️ **Fever** is your body fighting an infection.\n\n**Home Care:**\n• Rest and drink plenty of fluids (water, ORS, coconut water)\n• Take **Paracetamol 500mg** every 4–6 hours (max 4 doses/day)\n• Use a cool damp cloth on forehead\n• Wear light clothing\n\n**💊 Medicine:** Paracetamol (Calpol, Crocin, Tylenol)\n\n**🏥 Go to ER if:**\n• Fever above **103°F (39.4°C)**\n• Lasts more than **3 days**\n• Accompanied by stiff neck, rash, or confusion\n• In infants under 3 months",
    followUp: "How long have you had the fever? (e.g. 1 day, 3 days)"
  },

  // ---- Cough ----
  {
    keywords: ['cough', 'coughing', 'khansi', 'کھانسی', 'खांसी'],
    reply: "😷 **Cough** can be caused by cold, allergies, or infection.\n\n**Home Care:**\n• Warm water with honey and lemon (natural remedy)\n• Steam inhalation 2x daily\n• Avoid cold drinks and dusty environments\n• Stay hydrated\n\n**💊 Medicine:**\n• Dry cough: **Dextromethorphan** (Benadryl, Robitussin)\n• Wet/productive cough: **Guaifenesin** (Mucinex) — helps loosen mucus\n• Sore throat + cough: **Strepsils** lozenges\n\n**🏥 Go to ER if:**\n• Coughing blood\n• Difficulty breathing\n• Cough lasting more than **3 weeks**\n• High fever with cough",
    followUp: "Is your cough dry or do you have mucus/phlegm?"
  },

  // ---- Headache ----
  {
    keywords: ['headache', 'head pain', 'migraine', 'sir dard', 'سر درد', 'सिरदर्द'],
    reply: "🤕 **Headache** — most are tension headaches or migraines.\n\n**Home Care:**\n• Drink water (dehydration is a common cause)\n• Rest in a quiet, dark room\n• Apply cold or warm compress to forehead/neck\n• Gentle neck stretches\n\n**💊 Medicine:**\n• **Paracetamol 500–1000mg** for general headache\n• **Ibuprofen 400mg** for tension headache (take with food)\n• **Sumatriptan** for migraines (prescription needed)\n\n**🏥 Go to ER if:**\n• Sudden severe 'thunderclap' headache (worst of your life)\n• Headache with fever + stiff neck (meningitis risk)\n• Headache after head injury\n• Vision changes or weakness with headache",
    followUp: "Is this a new headache or do you get them regularly?"
  },

  // ---- Cold / Runny Nose ----
  {
    keywords: ['cold', 'runny nose', 'sneezing', 'stuffy nose', 'nasal', 'zukam', 'زکام', 'जुकाम'],
    reply: "🤧 **Common Cold** — caused by viruses, usually resolves in 7–10 days.\n\n**Home Care:**\n• Rest and drink warm fluids\n• Saline nasal spray or steam inhalation\n• Honey + ginger + lemon tea\n• Gargle with warm salt water\n\n**💊 Medicine:**\n• **Cetirizine 10mg** once daily for runny nose/sneezing\n• **Pseudoephedrine** for nasal congestion (decongestant)\n• **Paracetamol** if fever is present\n• **Vitamin C 500mg** daily to support immunity\n\n**🏥 Go to ER if:**\n• Symptoms worsen after 10 days\n• High fever (above 103°F)\n• Difficulty breathing",
    followUp: null
  },

  // ---- Stomach Pain ----
  {
    keywords: ['stomach', 'stomach ache', 'abdominal pain', 'belly pain', 'tummy', 'pet dard', 'پیٹ درد', 'पेट दर्द'],
    reply: "🫃 **Stomach Pain** — can be indigestion, gas, or infection.\n\n**Home Care:**\n• Drink warm water or ginger tea\n• Avoid spicy, oily, and heavy foods\n• Rest and apply warm compress to abdomen\n• Eat small, bland meals (rice, banana, toast)\n\n**💊 Medicine:**\n• **Antacid** (Gelusil, Digene, Tums) for acidity/heartburn\n• **Omeprazole 20mg** for acid reflux (before meals)\n• **Buscopan (Hyoscine)** for cramps/spasms\n• **ORS** if diarrhea is also present\n\n**🏥 Go to ER if:**\n• Severe sudden pain (could be appendicitis)\n• Pain in lower right abdomen with fever\n• Vomiting blood or black stools\n• Pain lasting more than 2 days",
    followUp: "Where exactly is the pain? (upper, lower, left, right side?)"
  },

  // ---- Nausea / Vomiting ----
  {
    keywords: ['vomit', 'vomiting', 'nausea', 'nauseous', 'ulti', 'قے', 'उल्टी'],
    reply: "🤢 **Nausea & Vomiting** — often caused by food poisoning, infections, or motion sickness.\n\n**Home Care:**\n• Sip clear fluids slowly (water, ORS, ginger ale)\n• Avoid solid food for 2–4 hours\n• Eat bland foods when ready (BRAT diet: Banana, Rice, Applesauce, Toast)\n• Rest with head elevated\n\n**💊 Medicine:**\n• **Domperidone (Motilium)** 10mg before meals — anti-nausea\n• **Ondansetron (Zofran)** — stronger anti-nausea (prescription)\n• **ORS** to prevent dehydration\n• **Ginger capsules** — natural remedy\n\n**🏥 Go to ER if:**\n• Vomiting blood\n• Signs of dehydration (no urination, dry mouth, dizziness)\n• Vomiting for more than 24 hours\n• Severe abdominal pain with vomiting",
    followUp: null
  },

  // ---- Diarrhea ----
  {
    keywords: ['diarrhea', 'loose stool', 'loose motion', 'dast', 'دست', 'दस्त'],
    reply: "💧 **Diarrhea** — most cases resolve in 2–3 days with proper care.\n\n**Home Care:**\n• **ORS (Oral Rehydration Solution)** — most important step\n• BRAT diet: Banana, Rice, Applesauce, Toast\n• Avoid dairy, fatty foods, caffeine\n• Wash hands frequently\n\n**💊 Medicine:**\n• **ORS sachets** (Electral, Pedialyte) — replace lost fluids\n• **Loperamide (Imodium)** — slows diarrhea (not for bloody diarrhea)\n• **Probiotics** (Lactobacillus) — restore gut bacteria\n• **Zinc supplements** — especially for children\n\n**🏥 Go to ER if:**\n• Blood or mucus in stool\n• Diarrhea lasting more than **2 days** in adults, **1 day** in children\n• Signs of severe dehydration\n• High fever with diarrhea",
    followUp: null
  },

  // ---- Back Pain ----
  {
    keywords: ['back pain', 'backache', 'lower back', 'kamar dard', 'کمر درد', 'कमर दर्द'],
    reply: "🦴 **Back Pain** — usually caused by muscle strain or poor posture.\n\n**Home Care:**\n• Apply warm compress for 15–20 minutes (chronic pain)\n• Apply ice pack for first 48 hours (acute injury)\n• Gentle stretching and walking\n• Avoid prolonged sitting — take breaks every 30 minutes\n• Sleep on a firm mattress\n\n**💊 Medicine:**\n• **Ibuprofen 400mg** with food (anti-inflammatory)\n• **Paracetamol 500mg** for pain relief\n• **Diclofenac gel** applied topically to the area\n• **Muscle relaxants** (Methocarbamol) — prescription needed\n\n**🏥 Go to ER if:**\n• Pain radiates down the leg (sciatica)\n• Numbness or weakness in legs\n• Loss of bladder/bowel control\n• Back pain after a fall or accident",
    followUp: null
  },

  // ---- Chest Pain ----
  {
    keywords: ['chest pain', 'chest tightness', 'seene mein dard', 'سینے میں درد', 'सीने में दर्द'],
    reply: "❤️ **Chest Pain — TAKE SERIOUSLY**\n\n**🚨 CALL 911 IMMEDIATELY if you have:**\n• Sudden crushing/squeezing chest pain\n• Pain spreading to left arm, jaw, or back\n• Shortness of breath + chest pain\n• Cold sweats, nausea with chest pain\n• These are signs of a **HEART ATTACK**\n\n**Less urgent causes:**\n• Acid reflux (burning sensation) → Antacid\n• Muscle strain → Rest + Ibuprofen\n• Anxiety/panic attack → Deep breathing\n\n**💊 If heart attack suspected:**\n• Chew **Aspirin 325mg** immediately (if not allergic)\n• Call emergency services — do NOT drive yourself\n\n**🏥 ALWAYS go to ER for unexplained chest pain.**",
    followUp: "Is the pain sharp/stabbing or crushing/squeezing? Does it spread to your arm or jaw?"
  },

  // ---- Fatigue ----
  {
    keywords: ['tired', 'fatigue', 'exhausted', 'weakness', 'weak', 'thakan', 'تھکاوٹ', 'थकान'],
    reply: "😴 **Fatigue & Weakness** — many possible causes.\n\n**Common Causes:**\n• Lack of sleep (aim for 7–9 hours)\n• Iron deficiency anemia\n• Vitamin D or B12 deficiency\n• Thyroid problems\n• Dehydration\n• Stress or depression\n\n**Home Care:**\n• Ensure 7–9 hours of quality sleep\n• Eat iron-rich foods (spinach, lentils, red meat)\n• Stay hydrated\n• Light exercise (paradoxically boosts energy)\n\n**💊 Supplements to consider:**\n• **Iron + Folic Acid** (if anemic)\n• **Vitamin D3** (if deficient)\n• **Vitamin B12** (especially vegetarians)\n• **Multivitamin** as general support\n\n**🏥 See a Doctor if:**\n• Fatigue persists more than 2 weeks\n• Accompanied by weight loss, fever, or night sweats\n• Extreme weakness affecting daily life",
    followUp: "How long have you been feeling tired? Do you have any other symptoms?"
  },

  // ---- Skin / Rash ----
  {
    keywords: ['skin', 'rash', 'itching', 'itch', 'allergy', 'khujli', 'کھجلی', 'खुजली'],
    reply: "🩹 **Skin Rash & Itching** — usually allergic or heat-related.\n\n**Home Care:**\n• Avoid scratching (causes infection)\n• Apply cool compress to reduce itching\n• Use fragrance-free soap and moisturizer\n• Wear loose, cotton clothing\n• Identify and avoid the trigger (food, soap, fabric)\n\n**💊 Medicine:**\n• **Cetirizine 10mg** once daily (antihistamine for allergy)\n• **Calamine lotion** — apply directly to rash\n• **Hydrocortisone 1% cream** — for mild inflammation\n• **Chlorphenamine (Piriton)** — stronger antihistamine (causes drowsiness)\n\n**🏥 Go to ER if:**\n• Rash with difficulty breathing or throat swelling (anaphylaxis)\n• Rash spreading rapidly all over body\n• Blistering rash with fever\n• Rash after starting a new medication",
    followUp: null
  },

  // ---- Diabetes ----
  {
    keywords: ['diabetes', 'blood sugar', 'sugar', 'diabetic', 'shakar', 'شوگر', 'शुगर'],
    reply: "🩸 **Diabetes Management**\n\n**Type 2 Diabetes — Key Points:**\n• Monitor blood sugar regularly (target: 80–130 mg/dL fasting)\n• HbA1c target: below 7%\n• Follow a low-glycemic diet (avoid white rice, sugar, sweets)\n• Exercise 30 minutes daily\n\n**💊 Common Medicines (Prescription Required):**\n• **Metformin** — first-line medication for Type 2\n• **Glipizide/Glibenclamide** — stimulates insulin\n• **Insulin** — for Type 1 and advanced Type 2\n\n**⚠️ Low Blood Sugar (Hypoglycemia) Emergency:**\n• Symptoms: shaking, sweating, confusion\n• Immediately eat: 15g sugar (3 glucose tablets, ½ cup juice, 1 tbsp honey)\n\n**🏥 See Doctor if:**\n• Blood sugar consistently above 200 mg/dL\n• Symptoms of low blood sugar\n• Foot wounds that don't heal",
    followUp: null
  },

  // ---- Blood Pressure ----
  {
    keywords: ['blood pressure', 'hypertension', 'bp', 'high bp', 'بلڈ پریشر', 'ब्लड प्रेशर'],
    reply: "💊 **Blood Pressure Management**\n\n**Normal BP:** Below 120/80 mmHg\n**High BP (Hypertension):** 130/80 or above\n\n**Lifestyle Changes (Very Effective):**\n• Reduce salt intake (less than 1 tsp/day)\n• DASH diet: fruits, vegetables, whole grains\n• Exercise 30 min/day\n• Quit smoking and limit alcohol\n• Manage stress (meditation, yoga)\n\n**💊 Common Medicines (Prescription Required):**\n• **Amlodipine** — calcium channel blocker\n• **Lisinopril/Enalapril** — ACE inhibitors\n• **Losartan** — ARB (good for diabetics)\n• **Atenolol** — beta blocker\n\n**🏥 Go to ER if:**\n• BP above **180/120** (hypertensive crisis)\n• Severe headache + high BP\n• Chest pain or vision changes with high BP",
    followUp: null
  },

  // ---- Sleep ----
  {
    keywords: ['sleep', 'insomnia', 'cant sleep', "can't sleep", 'neend', 'نیند', 'नींद'],
    reply: "🌙 **Sleep Problems & Insomnia**\n\n**Sleep Hygiene Tips:**\n• Keep a consistent sleep schedule (same time every day)\n• Avoid screens 1 hour before bed (blue light disrupts melatonin)\n• Keep bedroom dark, cool (18–20°C), and quiet\n• Avoid caffeine after 2 PM\n• No heavy meals within 2 hours of bedtime\n• Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s\n\n**💊 Sleep Aids:**\n• **Melatonin 0.5–5mg** — natural hormone, safe for short-term use\n• **Antihistamines** (Diphenhydramine/Benadryl) — OTC sleep aid\n• **Prescription sleep medicines** — only if doctor recommends\n\n**🏥 See Doctor if:**\n• Insomnia lasting more than 3 weeks\n• Snoring loudly + daytime sleepiness (sleep apnea)\n• Sleep problems affecting work/daily life",
    followUp: null
  },

  // ---- Mental Health ----
  {
    keywords: ['stress', 'anxiety', 'worried', 'mental health', 'depression', 'sad', 'tension', 'pareshan', 'پریشان', 'तनाव'],
    reply: "🧠 **Mental Health Matters**\n\nYou're not alone — mental health issues are very common and treatable.\n\n**Self-Help Strategies:**\n• **Deep breathing:** 4 counts in, hold 4, out 4\n• **Exercise** — 30 min/day reduces anxiety and depression significantly\n• **Talk to someone** you trust\n• **Journaling** — write down your thoughts\n• **Limit social media** and news\n• **Maintain routine** — sleep, meals, exercise\n\n**💊 Medicines (Prescription Required):**\n• **SSRIs** (Sertraline, Fluoxetine) — for depression/anxiety\n• **Buspirone** — for anxiety\n• **Benzodiazepines** — short-term anxiety (habit-forming, use carefully)\n\n**🏥 Seek Help if:**\n• Feelings of hopelessness or worthlessness\n• Thoughts of self-harm\n• Anxiety interfering with daily life\n• Please call a mental health helpline if in crisis",
    followUp: null
  },

  // ---- Eye ----
  {
    keywords: ['eye', 'eyes', 'eye pain', 'red eye', 'blurry', 'aankhein', 'آنکھ', 'आंख'],
    reply: "👁️ **Eye Problems**\n\n**Common Issues & Care:**\n\n**Red/Irritated Eyes:**\n• Rinse with clean water or saline eye drops\n• Avoid rubbing\n• **Artificial tears** (Systane, Refresh) for dryness\n\n**Conjunctivitis (Pink Eye):**\n• Bacterial: **Antibiotic eye drops** (Chloramphenicol) — prescription\n• Viral: Resolves on its own in 1–2 weeks\n• Allergic: **Antihistamine eye drops** (Ketotifen)\n\n**Eye Strain (from screens):**\n• Follow 20-20-20 rule: every 20 min, look 20 feet away for 20 seconds\n• Reduce screen brightness\n\n**🏥 Go to ER if:**\n• Sudden vision loss\n• Eye injury or chemical splash\n• Severe eye pain\n• Seeing flashes of light or floaters suddenly",
    followUp: null
  },

  // ---- First Aid ----
  {
    keywords: ['first aid', 'emergency', 'burn', 'cut', 'choking', 'fracture', 'bleeding'],
    reply: "🏥 **First Aid Guide**\n\nCheck the **First Aid** tab for detailed step-by-step guides on:\n• 🔥 Burns\n• 🩹 Cuts & Wounds\n• 🫁 Choking\n• 🦴 Fractures\n• 🩸 Nosebleed\n• 😵 Fainting\n• 🚨 Allergic Reaction\n• ❤️ CPR\n\n**🚨 For life-threatening emergencies: Call 911 immediately!**",
    followUp: null
  },

  // ---- Medicine Info ----
  {
    keywords: ['medicine', 'drug', 'tablet', 'paracetamol', 'ibuprofen', 'antibiotic', 'dawa', 'دوا', 'दवा'],
    reply: "💊 **Medicine Information**\n\nCheck the **Medicine Info** tab to search any medicine and get:\n• What it's used for\n• Correct dosage\n• Side effects\n• Important warnings\n\n**Common medicines I know about:**\nParacetamol, Ibuprofen, Aspirin, Amoxicillin, Cetirizine, Omeprazole, Metformin, Amlodipine, Vitamin C, Vitamin D, ORS, and more!\n\n⚠️ Always follow your doctor's prescription.",
    followUp: null
  },

  // ---- Diet ----
  {
    keywords: ['diet', 'nutrition', 'food', 'eat', 'eating', 'khana', 'کھانا', 'खाना'],
    reply: "🥗 **Diet & Nutrition**\n\nCheck the **Diet Planner** tab for personalized meal plans for:\n• 🩸 Diabetes\n• 💊 High Blood Pressure\n• ⚖️ Weight Loss\n• 💪 Weight Gain\n• ❤️ Heart Disease\n• 🥗 General Healthy Eating\n\n**Quick Tips:**\n• Fill half your plate with vegetables\n• Drink 8+ glasses of water daily\n• Avoid processed and fried foods\n• Eat 3 main meals + 2 healthy snacks",
    followUp: null
  },

  // ---- BMI ----
  {
    keywords: ['bmi', 'weight', 'overweight', 'obese', 'underweight', 'wazn', 'وزن', 'वजन'],
    reply: "⚖️ **BMI & Weight**\n\nUse the **BMI Calculator** tab to:\n• Calculate your BMI\n• Check your weight category\n• Get your ideal weight range\n• Calculate BMR (calorie needs)\n• Waist-to-height ratio\n\n**BMI Categories:**\n• Below 18.5 → Underweight\n• 18.5–24.9 → Normal ✅\n• 25–29.9 → Overweight\n• 30+ → Obese",
    followUp: null
  },

  // ---- Blood Test ----
  {
    keywords: ['blood test', 'cbc', 'hba1c', 'cholesterol', 'thyroid', 'khoon', 'خون', 'खून'],
    reply: "🩸 **Blood Tests**\n\nCheck the **Blood Tests** tab to understand common tests:\n• CBC (Complete Blood Count)\n• HbA1c (Diabetes)\n• Lipid Profile (Cholesterol)\n• TSH (Thyroid)\n• Fasting Glucose\n• Liver Function (LFT)\n• Kidney Function (KFT)\n• Vitamin D & Iron\n\nEach test shows: what it measures, normal ranges, and what high/low results mean.",
    followUp: null
  },

  // ---- Vaccine ----
  {
    keywords: ['vaccine', 'vaccination', 'immunization', 'tikka', 'ٹیکہ', 'टीका'],
    reply: "💉 **Vaccines & Immunization**\n\nVaccines are safe, effective, and save millions of lives.\n\n**Key Adult Vaccines:**\n• **Flu vaccine** — annually\n• **Tetanus (Td/Tdap)** — every 10 years\n• **COVID-19** — as per current guidelines\n• **Hepatitis B** — 3-dose series\n• **Pneumococcal** — for 65+ or high-risk\n\n**For Children:**\nFollow your national immunization schedule. Consult your pediatrician.\n\n⚠️ Vaccines do NOT cause autism — this has been thoroughly debunked by science.",
    followUp: null
  },

  // ---- Thank you ----
  {
    keywords: ['thank', 'thanks', 'thank you', 'shukriya', 'شکریہ', 'धन्यवाद'],
    reply: "😊 You're welcome! Stay healthy and take care.\n\nRemember: I provide general health information only. Always consult a qualified doctor for medical advice.\n\n🩺 **MOZP-Curebot** — Your health companion.",
    followUp: null
  },

  // ---- Goodbye ----
  {
    keywords: ['bye', 'goodbye', 'see you', 'khuda hafiz', 'خدا حافظ', 'अलविदा'],
    reply: "👋 Goodbye! Take care of yourself and stay healthy.\n\nCome back anytime you have health questions. 🩺",
    followUp: null
  },

  // ---- Help ----
  {
    keywords: ['help', 'what can you do', 'features', 'tabs', 'sections'],
    reply: "🤖 **What I can help with:**\n\n💬 **Chat** — Ask any health question\n🔍 **Symptoms** — Check symptoms with body map\n⚖️ **BMI** — BMI + BMR + Waist ratio\n💡 **Health Tips** — Daily wellness advice\n💊 **Medicine Info** — Search any medicine\n🏥 **First Aid** — Emergency guides\n🍎 **Diet Planner** — Condition-based meal plans\n🩸 **Blood Tests** — Understand your reports\n\nJust type your question or use the tabs above!",
    followUp: null
  }
];

// ---- POST /chat ----
router.post('/', (req, res) => {
  const userMessage = req.body.message?.toLowerCase().trim();
  const lang = req.body.lang || 'en'; // language preference

  if (!userMessage) {
    return res.status(400).json({ reply: "Please type a message!" });
  }

  // Search for a matching response
  let matched = null;
  for (const item of responses) {
    if (item.keywords.some(kw => userMessage.includes(kw))) {
      matched = item;
      break;
    }
  }

  if (!matched) {
    return res.json({
      reply: "🤔 I'm not sure about that specific question. I can help with common health topics like fever, cough, headache, diabetes, blood pressure, medicines, first aid, and more.\n\nTry asking about a specific symptom or use the tabs above for Symptom Checker, BMI Calculator, Medicine Info, and more!",
      followUp: "What health topic would you like to know about?"
    });
  }

  res.json({
    reply: matched.reply,
    followUp: matched.followUp || null
  });
});

module.exports = router;
