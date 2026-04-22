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
const PORT = process.env.PORT || 3000;

// ---- CORS ----
// Allow requests from the frontend origin (set via env var) + localhost for dev
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',   // Live Server (VS Code)
  'https://mozp-curebot.vercel.app', // production frontend (hardcoded fallback)
  process.env.FRONTEND_URL,  // override via Render env var
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Log blocked origin for debugging, but don't crash
    console.warn('CORS blocked origin:', origin);
    callback(null, false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

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
  console.log(`✅ MOZP-Curebot v2.0 running on port ${PORT}`);
  console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
});
