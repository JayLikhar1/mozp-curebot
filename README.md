# 🩺 MOZP-Curebot v2.0 – AI Medical Assistant

> Complete medical chatbot with medicine info, first aid guides, diet plans, blood test explanations, and more!

---

## ✨ Features

### 💬 **Chat**
- Medicine suggestions with dosage
- ER guidance (when to go to emergency)
- Follow-up questions
- Multi-language support (English, Hindi, Urdu)
- Chat search & copy messages
- Animated stats dashboard

### 🔍 **Symptom Checker**
- Interactive body map (tap body parts)
- Age, gender, duration inputs
- Risk level meter (1-5)
- Medicine recommendations
- Symptom history (saved locally)

### ⚖️ **BMI Calculator**
- BMI calculation
- BMR (Basal Metabolic Rate)
- TDEE (Total Daily Energy Expenditure)
- Calorie goals (maintain/lose/gain weight)
- Waist-to-height ratio
- Visual BMI gauge

### 💊 **Medicine Info**
- 14 common medicines database
- Use, dosage, side effects, warnings
- Search by brand or generic name
- Quick access chips

### 🏥 **First Aid Guide**
- 10 emergency guides with step-by-step instructions
- Burns, CPR, Choking, Fractures, etc.
- When to go to ER advice
- Expandable modal cards

### 🍎 **Diet Planner**
- 6 condition-based meal plans
- Diabetes, High BP, Weight Loss/Gain, Heart Disease, General
- Foods to eat/avoid
- Sample daily meal plan

### 🩸 **Blood Test Guide**
- 9 common blood tests explained
- CBC, HbA1c, Lipid Profile, Thyroid, etc.
- Normal ranges
- What high/low results mean

### 💡 **Health Tips**
- 10 daily wellness tips
- Hydration, diet, exercise, sleep, stress management

---

## 📁 Project Structure

```
mozp-curebot/
├── backend/
│   ├── server.js           ← Express server (7 routes)
│   ├── package.json
│   └── routes/
│       ├── chat.js         ← Enhanced with medicine suggestions, ER advice, multi-lang
│       ├── symptom.js      ← Enhanced with age/gender/duration, risk level
│       ├── bmi.js          ← Enhanced with BMR, TDEE, waist ratio
│       ├── medicine.js     ← NEW: 14 medicines database
│       ├── firstaid.js     ← NEW: 10 emergency guides
│       ├── diet.js         ← NEW: 6 diet plans
│       └── bloodtest.js    ← NEW: 9 blood tests
│
├── frontend/
│   ├── index.html          ← 8 tabs, body map, modals
│   ├── style.css           ← Apple/iOS design
│   └── script.js           ← Complete frontend logic
│
└── README.md
```

---

## 🚀 How to Run

### Step 1: Install Dependencies
```bash
cd mozp-curebot/backend
npm install
```

### Step 2: Start Backend
```bash
npm start
```
You should see: `✅ MOZP-Curebot v2.0 running at http://localhost:3000`

### Step 3: Open Frontend
Open `mozp-curebot/frontend/index.html` in your browser.

> **Tip:** Use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension for best experience.

---

## 🧪 Test the APIs

### Chat API
```bash
curl -X POST http://localhost:3000/chat -H "Content-Type: application/json" -d "{\"message\":\"I have a fever\"}"
```

### Medicine API
```bash
curl -X POST http://localhost:3000/medicine -H "Content-Type: application/json" -d "{\"name\":\"paracetamol\"}"
```

### Symptom API
```bash
curl -X POST http://localhost:3000/symptom -H "Content-Type: application/json" -d "{\"symptoms\":[\"fever\",\"cough\"],\"age\":\"25\",\"gender\":\"male\",\"duration\":\"2\"}"
```

### BMI API
```bash
curl -X POST http://localhost:3000/bmi -H "Content-Type: application/json" -d "{\"height\":\"170\",\"weight\":\"65\",\"unit\":\"metric\",\"age\":\"25\",\"gender\":\"male\",\"waist\":\"80\",\"activityLevel\":\"moderate\"}"
```

### First Aid API
```bash
curl http://localhost:3000/firstaid
curl http://localhost:3000/firstaid/burns
```

### Diet API
```bash
curl -X POST http://localhost:3000/diet -H "Content-Type: application/json" -d "{\"condition\":\"diabetes\"}"
```

### Blood Test API
```bash
curl http://localhost:3000/bloodtest
curl http://localhost:3000/bloodtest/cbc
```

---

## 🎨 UI Features

- **Apple/iOS Design** – Clean, minimal, rounded corners
- **Responsive** – Works on mobile, tablet, desktop
- **Dark Mode Ready** – Easy to add (CSS variables)
- **Animations** – Smooth transitions, typing indicator, progress bar
- **Modals** – First aid and blood test details
- **Body Map** – Interactive symptom selection
- **BMI Gauge** – Visual canvas chart
- **Language Selector** – EN/HI/UR support
- **Local Storage** – Symptom history saved
- **Notifications** – Medication reminders (browser notifications)

---

## 💊 Medicine Database

Paracetamol, Ibuprofen, Aspirin, Amoxicillin, Cetirizine, Omeprazole, Metformin, Amlodipine, Azithromycin, Loratadine, Vitamin C, Vitamin D, ORS, Antacids

---

## 🏥 First Aid Guides

Burns, Cuts & Wounds, Choking, Fractures, Nosebleed, Fainting, Allergic Reaction (Anaphylaxis), Heat Stroke, CPR, Poisoning

---

## 🍎 Diet Plans

Diabetes, Hypertension (High BP), Weight Loss, Weight Gain, Heart Disease, General Healthy Diet

---

## 🩸 Blood Tests

CBC, HbA1c, Lipid Profile, TSH (Thyroid), Fasting Glucose, Liver Function (LFT), Kidney Function (KFT), Vitamin D, Iron Studies

---

## ⚠️ Disclaimer

**This chatbot is for informational purposes only and does NOT replace professional medical advice. Always consult a qualified doctor for medical concerns.**

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** None (all data in-memory)
- **Design:** Apple/iOS inspired, Inter font

---

## 📊 Stats

- **Backend Routes:** 7
- **Frontend Tabs:** 8
- **Medicines:** 14
- **First Aid Guides:** 10
- **Diet Plans:** 6
- **Blood Tests:** 9
- **Health Tips:** 10
- **Symptom Rules:** 25+
- **Chat Responses:** 30+
- **Languages:** 3 (EN/HI/UR)

---

## 🎯 Perfect For

- First-year students learning web development
- Medical informatics projects
- Health tech portfolios
- Beginner-friendly AI chatbot example

---

*MOZP-Curebot v2.0 – Your complete health companion. Built with ❤️ for learning.*
