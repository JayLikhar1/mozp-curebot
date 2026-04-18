// ============================================
// MOZP-Curebot Backend Server v2.0
// Main entry point - starts our Express app
// ============================================

const express = require('express');
const cors = require('cors');

// ---- Import all route files ----
const chatRoutes     = require('./routes/chat');
const symptomRoutes  = require('./routes/symptom');
const bmiRoutes      = require('./routes/bmi');
const medicineRoutes = require('./routes/medicine');
const firstaidRoutes = require('./routes/firstaid');
const dietRoutes     = require('./routes/diet');
const bloodtestRoutes= require('./routes/bloodtest');

const app = express();
const PORT = 3000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Routes ----
app.use('/chat',      chatRoutes);
app.use('/symptom',   symptomRoutes);
app.use('/bmi',       bmiRoutes);
app.use('/medicine',  medicineRoutes);
app.use('/firstaid',  firstaidRoutes);
app.use('/diet',      dietRoutes);
app.use('/bloodtest', bloodtestRoutes);

// ---- Root Route ----
app.get('/', (req, res) => {
  res.json({
    message: 'MOZP-Curebot API v2.0 is running!',
    routes: ['/chat', '/symptom', '/bmi', '/medicine', '/firstaid', '/diet', '/bloodtest']
  });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`✅ MOZP-Curebot v2.0 running at http://localhost:${PORT}`);
});
