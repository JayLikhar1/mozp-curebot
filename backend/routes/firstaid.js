// ============================================
// First Aid Route - GET /firstaid
// Returns first aid guides for emergencies
// ============================================

const express = require('express');
const router = express.Router();

// ---- First Aid Data ----
const firstAidGuides = [
  {
    id: 'burns',
    title: 'Burns',
    emoji: '🔥',
    severity: 'Moderate',
    color: 'orange',
    steps: [
      'Cool the burn immediately under cool (not cold/icy) running water for 10–20 minutes.',
      'Remove jewelry or tight items near the burn area before swelling starts.',
      'Cover loosely with a clean non-fluffy material (cling film or clean plastic bag).',
      'Take paracetamol or ibuprofen for pain relief.',
      'Do NOT apply butter, toothpaste, ice, or any creams.',
      'Do NOT burst any blisters — this increases infection risk.'
    ],
    goToER: 'Burns larger than 3cm, burns on face/hands/genitals/joints, chemical or electrical burns, burns in children or elderly.',
    tip: '💡 Remember: Cool, Cover, Call. Never use ice — it damages tissue.'
  },
  {
    id: 'cuts',
    title: 'Cuts & Wounds',
    emoji: '🩹',
    severity: 'Mild',
    color: 'yellow',
    steps: [
      'Wash your hands before touching the wound.',
      'Apply gentle pressure with a clean cloth or bandage to stop bleeding.',
      'Once bleeding stops, rinse the wound under clean running water for 5 minutes.',
      'Clean around the wound with soap — avoid getting soap inside.',
      'Apply antiseptic cream (like Betadine or Savlon) and cover with a bandage.',
      'Change the dressing daily and keep the wound dry.'
    ],
    goToER: 'Deep or gaping wounds, wounds that won\'t stop bleeding after 10 minutes, wounds from rusty/dirty objects (tetanus risk), animal bites.',
    tip: '💡 Check your tetanus vaccination status — update every 10 years.'
  },
  {
    id: 'choking',
    title: 'Choking',
    emoji: '🫁',
    severity: 'Emergency',
    color: 'red',
    steps: [
      'Ask "Are you choking?" — if they can cough, encourage them to keep coughing.',
      'If they cannot cough/speak/breathe: Stand behind them, lean them forward.',
      'Give up to 5 firm back blows between shoulder blades with heel of your hand.',
      'If back blows don\'t work: Give up to 5 abdominal thrusts (Heimlich maneuver).',
      'Abdominal thrust: Stand behind, make a fist above navel, pull sharply inward and upward.',
      'Alternate 5 back blows and 5 abdominal thrusts until object is dislodged or help arrives.',
      'If person becomes unconscious: Call 911 and start CPR.'
    ],
    goToER: 'Always seek medical attention after choking, even if the object is dislodged. Abdominal thrusts can cause internal injury.',
    tip: '💡 For infants under 1 year: Use 5 back blows + 5 chest thrusts (NOT abdominal thrusts).'
  },
  {
    id: 'fracture',
    title: 'Fractures (Broken Bones)',
    emoji: '🦴',
    severity: 'Moderate–Emergency',
    color: 'orange',
    steps: [
      'Keep the person still — do not try to straighten the bone.',
      'Immobilize the injured area using a splint (rolled newspaper, stick) and bandage.',
      'Apply an ice pack wrapped in cloth to reduce swelling — 20 minutes on, 20 off.',
      'Elevate the injured limb if possible to reduce swelling.',
      'Give paracetamol for pain (avoid ibuprofen initially as it may slow healing).',
      'Call for emergency help or transport carefully to hospital.'
    ],
    goToER: 'All suspected fractures need X-ray. Go immediately if: bone is visible, limb is deformed, severe swelling, numbness, or spine/neck/hip fracture.',
    tip: '💡 Signs of fracture: pain, swelling, bruising, deformity, inability to use the limb.'
  },
  {
    id: 'nosebleed',
    title: 'Nosebleed',
    emoji: '🩸',
    severity: 'Mild',
    color: 'yellow',
    steps: [
      'Sit upright and lean slightly forward (not backward — blood may go to throat).',
      'Pinch the soft part of your nose (just below the bony bridge) firmly.',
      'Breathe through your mouth and hold for 10–15 minutes without releasing.',
      'Apply a cold compress or ice pack to the bridge of the nose.',
      'Do NOT tilt head back, stuff tissue deep into nose, or blow nose immediately after.'
    ],
    goToER: 'Nosebleed lasting more than 20 minutes, after a head injury, very heavy bleeding, or if you are on blood thinners.',
    tip: '💡 Most nosebleeds are harmless. Dry air and nose picking are common causes.'
  },
  {
    id: 'fainting',
    title: 'Fainting / Unconsciousness',
    emoji: '😵',
    severity: 'Moderate',
    color: 'orange',
    steps: [
      'If person feels faint: Help them sit or lie down immediately to prevent falling.',
      'Lay them on their back and elevate their legs 30cm (12 inches) above heart level.',
      'Loosen tight clothing around neck and waist.',
      'Ensure fresh air — open windows, fan them gently.',
      'If unconscious but breathing: Place in recovery position (on their side).',
      'Check breathing and pulse. If no pulse: Start CPR and call 911 immediately.'
    ],
    goToER: 'First-time fainting, fainting with chest pain or palpitations, fainting after head injury, person doesn\'t regain consciousness within 1 minute.',
    tip: '💡 Common causes: standing too fast, heat, dehydration, low blood sugar, emotional shock.'
  },
  {
    id: 'allergic',
    title: 'Severe Allergic Reaction (Anaphylaxis)',
    emoji: '🚨',
    severity: 'Emergency',
    color: 'red',
    steps: [
      'Call 911 / emergency services IMMEDIATELY.',
      'Use epinephrine auto-injector (EpiPen) if available — inject into outer thigh.',
      'Lay the person flat with legs elevated (unless breathing is difficult — then sit up).',
      'If they stop breathing: Begin CPR.',
      'A second EpiPen dose can be given after 5–15 minutes if no improvement.',
      'Even if symptoms improve, go to ER — reactions can return hours later.'
    ],
    goToER: 'ALWAYS. Anaphylaxis is life-threatening. Signs: throat swelling, difficulty breathing, rapid pulse, dizziness, hives all over body.',
    tip: '💡 If you have known severe allergies, always carry an EpiPen and wear a medical alert bracelet.'
  },
  {
    id: 'heatstroke',
    title: 'Heat Stroke / Heat Exhaustion',
    emoji: '🌡️',
    severity: 'Emergency',
    color: 'red',
    steps: [
      'Move the person to a cool, shaded area immediately.',
      'Remove excess clothing.',
      'Cool them rapidly: apply cold wet cloths to neck, armpits, and groin.',
      'Fan them while misting with cool water.',
      'Give cool water to drink if they are conscious and can swallow.',
      'Do NOT give fluids if unconscious.',
      'Call 911 if temperature is above 104°F (40°C) or person is confused/unconscious.'
    ],
    goToER: 'Heat stroke (hot dry skin, confusion, no sweating) is a medical emergency. Call 911 immediately.',
    tip: '💡 Heat exhaustion (heavy sweating, weakness) can progress to heat stroke. Act fast.'
  },
  {
    id: 'cpr',
    title: 'CPR (Cardiac Arrest)',
    emoji: '❤️',
    severity: 'Emergency',
    color: 'red',
    steps: [
      'Check for safety — make sure the area is safe for you and the victim.',
      'Check responsiveness: Tap shoulders firmly and shout "Are you OK?"',
      'Call 911 immediately (or ask someone else to call while you start CPR).',
      'Position: Lay person on their back on a firm surface.',
      'Chest compressions: Place heel of hand on center of chest. Push hard and fast — 100–120 compressions per minute, 5–6cm deep.',
      'Rescue breaths (if trained): After 30 compressions, give 2 rescue breaths.',
      'Continue 30:2 ratio until help arrives or person recovers.',
      'Use AED (defibrillator) if available — turn it on and follow voice instructions.'
    ],
    goToER: 'ALWAYS. Call 911 first. Every minute without CPR reduces survival by 10%.',
    tip: '💡 Hands-only CPR (no rescue breaths) is effective for adults. Push hard, push fast, don\'t stop.'
  },
  {
    id: 'poisoning',
    title: 'Poisoning / Overdose',
    emoji: '☠️',
    severity: 'Emergency',
    color: 'red',
    steps: [
      'Call Poison Control (1-800-222-1222 in US) or 911 immediately.',
      'Do NOT induce vomiting unless specifically told to by Poison Control.',
      'If poison is on skin: Remove contaminated clothing, rinse skin with water for 15–20 minutes.',
      'If poison is in eyes: Rinse eyes with clean water for 15–20 minutes.',
      'Keep the person calm and still.',
      'Collect the container/substance to show medical staff.',
      'If unconscious and breathing: Place in recovery position.'
    ],
    goToER: 'ALWAYS for suspected poisoning or overdose. Time is critical.',
    tip: '💡 Keep all medicines locked away from children. Never take medicines in the dark.'
  }
];

// ---- GET /firstaid ----
// Returns all first aid guides
router.get('/', (req, res) => {
  // Return just the summary (id, title, emoji, severity, color)
  const summary = firstAidGuides.map(({ id, title, emoji, severity, color }) => ({
    id, title, emoji, severity, color
  }));
  res.json({ guides: summary });
});

// ---- GET /firstaid/:id ----
// Returns a specific first aid guide
router.get('/:id', (req, res) => {
  const guide = firstAidGuides.find(g => g.id === req.params.id);
  if (!guide) {
    return res.status(404).json({ error: 'Guide not found.' });
  }
  res.json(guide);
});

module.exports = router;
