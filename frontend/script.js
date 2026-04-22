// ============================================
// MOZP-Curebot v2.0 - Complete Frontend Script
// ============================================

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://mozp-curebot-api.onrender.com';
let currentUnit = 'metric';
let selectedSymptoms = [];
let currentLang = 'en';
let messageCount = 0;
let topicCount = 0;
let symptomHistory = JSON.parse(localStorage.getItem('symptomHistory') || '[]');

// ============================================
// TAB SWITCHING
// ============================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ============================================
// LANGUAGE
// ============================================
function setLanguage(lang) {
  currentLang = lang;
  console.log('Language set to:', lang);
}

// ============================================
// CHAT
// ============================================
document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;
  
  input.value = '';
  addMessage(message, 'user');
  document.getElementById('suggestionChips').style.display = 'none';
  showTyping(true);
  showProgress(true);
  
  messageCount++;
  document.getElementById('statMessages').textContent = messageCount;
  
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, lang: currentLang })
    });
    const data = await response.json();
    showTyping(false);
    showProgress(false);
    addMessage(data.reply, 'bot');
    if (data.followUp) {
      setTimeout(() => addMessage(data.followUp, 'bot'), 1000);
    }
  } catch (error) {
    showTyping(false);
    showProgress(false);
    addMessage('⚠️ Could not connect to server. Make sure backend is running on port 3000.', 'bot');
  }
}

function sendQuickMessage(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function addMessage(text, sender) {
  const messagesDiv = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender === 'bot' ? 'bot-message' : 'user-message'}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  
  messageDiv.innerHTML = `
    <div class="message-avatar ${sender === 'bot' ? 'bot-avatar' : 'user-avatar'}">
      ${sender === 'bot' ? '🩺' : '👤'}
    </div>
    <div class="message-bubble">
      ${formattedText}
      ${sender === 'bot' ? '<button class="copy-btn" onclick="copyMessage(this)">Copy</button>' : ''}
    </div>
    <span class="message-time">${time}</span>
  `;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function copyMessage(btn) {
  const text = btn.parentElement.innerText.replace('Copy', '').trim();
  navigator.clipboard.writeText(text);
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = 'Copy', 2000);
}

function showTyping(show) {
  document.getElementById('typingIndicator').style.display = show ? 'flex' : 'none';
  if (show) {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

function showProgress(show) {
  const bar = document.getElementById('progressBar');
  bar.style.display = show ? 'block' : 'none';
  if (show) {
    document.getElementById('progressFill').style.width = '0%';
    setTimeout(() => document.getElementById('progressFill').style.width = '100%', 100);
  }
}

function toggleChatSearch() {
  const searchBar = document.getElementById('chatSearchBar');
  searchBar.style.display = searchBar.style.display === 'none' ? 'flex' : 'none';
  if (searchBar.style.display === 'flex') {
    document.getElementById('chatSearchInput').focus();
  }
}

function closeChatSearch() {
  document.getElementById('chatSearchBar').style.display = 'none';
  document.getElementById('chatSearchInput').value = '';
}

document.getElementById('chatSearchInput')?.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.message').forEach(msg => {
    const text = msg.textContent.toLowerCase();
    msg.style.display = text.includes(query) ? 'flex' : 'none';
  });
});

// ============================================
// SYMPTOM CHECKER
// ============================================
const commonSymptoms = [
  { label: '🌡️ Fever', value: 'fever' },
  { label: '😷 Cough', value: 'cough' },
  { label: '🤕 Headache', value: 'headache' },
  { label: '😴 Fatigue', value: 'fatigue' },
  { label: '🤧 Runny Nose', value: 'runny nose' },
  { label: '🤢 Nausea', value: 'nausea' },
  { label: '🤮 Vomiting', value: 'vomiting' },
  { label: '🫃 Stomach Pain', value: 'stomach pain' },
  { label: '💨 Shortness of Breath', value: 'shortness of breath' },
  { label: '💫 Dizziness', value: 'dizziness' },
  { label: '🦴 Body Ache', value: 'body ache' },
  { label: '😮 Sore Throat', value: 'sore throat' },
  { label: '🩹 Rash', value: 'rash' },
  { label: '❤️ Chest Pain', value: 'chest pain' },
  { label: '🥶 Chills', value: 'chills' },
  { label: '🦴 Back Pain', value: 'back pain' }
];

const bodyPartSymptoms = {
  head: ['headache', 'dizziness'],
  chest: ['chest pain', 'shortness of breath', 'cough'],
  abdomen: ['stomach pain', 'nausea', 'vomiting'],
  arms: ['body ache'],
  legs: ['body ache']
};

function renderSymptomGrid() {
  const grid = document.getElementById('symptomGrid');
  grid.innerHTML = '';
  commonSymptoms.forEach(symptom => {
    const btn = document.createElement('button');
    btn.className = 'symptom-chip';
    btn.textContent = symptom.label;
    btn.dataset.value = symptom.value;
    btn.addEventListener('click', () => toggleSymptom(symptom.value, btn));
    grid.appendChild(btn);
  });
}

function addBodyPartSymptoms(part) {
  const symptoms = bodyPartSymptoms[part] || [];
  symptoms.forEach(symptom => {
    if (!selectedSymptoms.includes(symptom)) {
      selectedSymptoms.push(symptom);
      document.querySelectorAll('.symptom-chip').forEach(btn => {
        if (btn.dataset.value === symptom) btn.classList.add('selected');
      });
    }
  });
  updateSelectedDisplay();
}

function toggleSymptom(value, btn) {
  if (selectedSymptoms.includes(value)) {
    selectedSymptoms = selectedSymptoms.filter(s => s !== value);
    btn.classList.remove('selected');
  } else {
    selectedSymptoms.push(value);
    btn.classList.add('selected');
  }
  updateSelectedDisplay();
}

function addCustomSymptom() {
  const input = document.getElementById('customSymptomInput');
  const value = input.value.trim().toLowerCase();
  if (!value || selectedSymptoms.includes(value)) {
    input.value = '';
    return;
  }
  selectedSymptoms.push(value);
  input.value = '';
  updateSelectedDisplay();
}

document.getElementById('customSymptomInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addCustomSymptom();
});

function updateSelectedDisplay() {
  const display = document.getElementById('selectedSymptomsDisplay');
  const chipsContainer = document.getElementById('selectedChips');
  if (selectedSymptoms.length === 0) {
    display.style.display = 'none';
    return;
  }
  display.style.display = 'block';
  chipsContainer.innerHTML = '';
  selectedSymptoms.forEach(symptom => {
    const tag = document.createElement('div');
    tag.className = 'selected-chip-tag';
    tag.innerHTML = `${symptom} <button class="remove-chip" onclick="removeSymptom('${symptom}')">✕</button>`;
    chipsContainer.appendChild(tag);
  });
}

function removeSymptom(value) {
  selectedSymptoms = selectedSymptoms.filter(s => s !== value);
  document.querySelectorAll('.symptom-chip').forEach(btn => {
    if (btn.dataset.value === value) btn.classList.remove('selected');
  });
  updateSelectedDisplay();
}

async function checkSymptoms() {
  if (selectedSymptoms.length === 0) {
    showSymptomResult({
      condition: '⚠️ No Symptoms Selected',
      severity: '',
      riskLevel: 0,
      advice: 'Please select at least one symptom.',
      color: 'gray'
    });
    return;
  }
  
  const age = document.getElementById('symptomAge').value;
  const gender = document.getElementById('symptomGender').value;
  const duration = document.getElementById('symptomDuration').value;
  
  try {
    const response = await fetch(`${API_URL}/symptom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms: selectedSymptoms, age, gender, duration })
    });
    const data = await response.json();
    showSymptomResult(data);
    saveSymptomHistory(data);
  } catch (error) {
    showSymptomResult({
      condition: '🔴 Server Offline',
      severity: 'Unknown',
      riskLevel: 0,
      advice: 'Could not connect to server.',
      color: 'gray'
    });
  }
}

function showSymptomResult(data) {
  const resultDiv = document.getElementById('symptomResult');
  resultDiv.style.display = 'block';
  resultDiv.className = `result-card ${data.color || ''}`;
  
  let severityClass = 'severity-mild';
  if (data.severity?.toLowerCase().includes('emergency')) severityClass = 'severity-emergency';
  else if (data.severity?.toLowerCase().includes('moderate')) severityClass = 'severity-moderate';
  
  let riskMeter = '';
  if (data.riskLevel) {
    riskMeter = '<div class="risk-meter">';
    for (let i = 1; i <= 5; i++) {
      riskMeter += `<div class="risk-dot ${i <= data.riskLevel ? 'active' : ''}"></div>`;
    }
    riskMeter += `</div><p style="font-size:12px;color:#8E8E93;margin-bottom:12px;">Risk Level: ${data.riskLevel}/5</p>`;
  }
  
  resultDiv.innerHTML = `
    <div class="result-condition">${data.condition}</div>
    ${data.severity ? `<span class="result-severity ${severityClass}">${data.severity}</span>` : ''}
    ${riskMeter}
    <p class="result-advice">${data.advice}</p>
    ${data.medicines ? `<p style="margin-bottom:12px;"><strong>💊 Medicines:</strong> ${data.medicines}</p>` : ''}
    ${data.erAdvice ? `<p style="margin-bottom:12px;"><strong>🏥 ER Advice:</strong> ${data.erAdvice}</p>` : ''}
    ${data.disclaimer ? '<p class="result-disclaimer">⚠️ This is general information only. Consult a doctor for proper diagnosis.</p>' : ''}
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveSymptomHistory(data) {
  const entry = {
    date: new Date().toLocaleDateString(),
    symptoms: selectedSymptoms.join(', '),
    condition: data.condition
  };
  symptomHistory.unshift(entry);
  symptomHistory = symptomHistory.slice(0, 5);
  localStorage.setItem('symptomHistory', JSON.stringify(symptomHistory));
  renderSymptomHistory();
}

function renderSymptomHistory() {
  const section = document.getElementById('symptomHistorySection');
  const list = document.getElementById('symptomHistoryList');
  if (symptomHistory.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';
  list.innerHTML = symptomHistory.map(entry => `
    <div class="history-item">
      <strong>${entry.date}</strong>: ${entry.symptoms} → ${entry.condition}
    </div>
  `).join('');
}

function clearSymptomHistory() {
  symptomHistory = [];
  localStorage.removeItem('symptomHistory');
  renderSymptomHistory();
}


// ============================================
// BMI CALCULATOR
// ============================================
function setUnit(unit) {
  currentUnit = unit;
  document.getElementById('metricBtn').classList.toggle('active', unit === 'metric');
  document.getElementById('imperialBtn').classList.toggle('active', unit === 'imperial');
  document.getElementById('heightLabel').textContent = unit === 'metric' ? 'Height (cm)' : 'Height (inches)';
  document.getElementById('weightLabel').textContent = unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)';
  document.getElementById('waistLabel').textContent = unit === 'metric' ? 'Waist (cm) optional' : 'Waist (inches) optional';
  document.getElementById('heightInput').placeholder = unit === 'metric' ? 'e.g. 170' : 'e.g. 67';
  document.getElementById('weightInput').placeholder = unit === 'metric' ? 'e.g. 65' : 'e.g. 143';
  document.getElementById('bmiResult').style.display = 'none';
  document.getElementById('bmiGaugeWrap').style.display = 'none';
}

async function calculateBMI() {
  const height = document.getElementById('heightInput').value;
  const weight = document.getElementById('weightInput').value;
  const age = document.getElementById('bmiAge').value;
  const gender = document.getElementById('bmiGender').value;
  const waist = document.getElementById('waistInput').value;
  const activityLevel = document.getElementById('activityLevel').value;
  
  if (!height || !weight) {
    alert('Please enter both height and weight.');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/bmi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ height, weight, unit: currentUnit, age, gender, waist, activityLevel })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      showBMIResult(data);
    }
  } catch (error) {
    alert('Could not connect to server.');
  }
}

function showBMIResult(data) {
  const resultDiv = document.getElementById('bmiResult');
  resultDiv.style.display = 'block';
  
  const colorMap = { blue: '#007AFF', green: '#34C759', orange: '#FF9500', red: '#FF3B30', darkred: '#C0392B' };
  const bmiColor = colorMap[data.color] || '#007AFF';
  
  let bmrSection = '';
  if (data.bmr && data.tdee && data.calorieGoal) {
    bmrSection = `
      <div style="background:#F2F2F7;padding:14px;border-radius:10px;margin-bottom:12px;">
        <p style="font-size:13px;margin-bottom:6px;"><strong>BMR (Basal Metabolic Rate):</strong> ${data.bmr} cal/day</p>
        <p style="font-size:13px;margin-bottom:6px;"><strong>TDEE (Total Daily Energy):</strong> ${data.tdee} cal/day</p>
        <p style="font-size:13px;margin-bottom:6px;"><strong>To maintain weight:</strong> ${data.calorieGoal.maintain} cal/day</p>
        <p style="font-size:13px;margin-bottom:6px;"><strong>To lose weight:</strong> ${data.calorieGoal.loseWeight} cal/day</p>
        <p style="font-size:13px;"><strong>To gain weight:</strong> ${data.calorieGoal.gainWeight} cal/day</p>
      </div>
    `;
  }
  
  let waistSection = '';
  if (data.waistRatio) {
    waistSection = `
      <div style="background:#F2F2F7;padding:14px;border-radius:10px;margin-bottom:12px;">
        <p style="font-size:13px;margin-bottom:6px;"><strong>Waist-to-Height Ratio:</strong> ${data.waistRatio.ratio}</p>
        <p style="font-size:13px;color:${colorMap[data.waistRatio.color]};">${data.waistRatio.category}</p>
      </div>
    `;
  }
  
  let weightGoal = '';
  if (data.weightDiff) {
    if (data.weightDiff.direction === 'lose') {
      weightGoal = `<p style="font-size:13px;color:#3C3C43;margin-bottom:12px;">To reach ideal weight: <strong>Lose ${data.weightDiff.value} ${data.weightDiff.unit}</strong></p>`;
    } else if (data.weightDiff.direction === 'gain') {
      weightGoal = `<p style="font-size:13px;color:#3C3C43;margin-bottom:12px;">To reach ideal weight: <strong>Gain ${data.weightDiff.value} ${data.weightDiff.unit}</strong></p>`;
    }
  }
  
  resultDiv.innerHTML = `
    <div class="bmi-number" style="color: ${bmiColor}">${data.bmi}</div>
    <div class="bmi-category" style="color: ${bmiColor}">${data.emoji} ${data.category}</div>
    <div class="bmi-ideal">Ideal weight: <strong>${data.idealWeightRange.min}–${data.idealWeightRange.max} ${data.idealWeightRange.unit}</strong></div>
    ${weightGoal}
    ${bmrSection}
    ${waistSection}
    <div class="bmi-advice-text">${data.advice}</div>
    <p class="result-disclaimer">⚠️ BMI is a general screening tool. Consult a doctor for complete assessment.</p>
  `;
  
  drawBMIGauge(data.bmi, bmiColor);
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function drawBMIGauge(bmi, color) {
  const wrap = document.getElementById('bmiGaugeWrap');
  wrap.style.display = 'block';
  const canvas = document.getElementById('bmiGauge');
  const ctx = canvas.getContext('2d');
  const centerX = 140;
  const centerY = 120;
  const radius = 100;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw gauge arc
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  
  // Background arc
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineWidth = 20;
  ctx.strokeStyle = '#E5E5EA';
  ctx.stroke();
  
  // Color segments
  const segments = [
    { start: 0, end: 0.185, color: '#007AFF' },    // Underweight
    { start: 0.185, end: 0.5, color: '#34C759' },  // Normal
    { start: 0.5, end: 0.75, color: '#FF9500' },   // Overweight
    { start: 0.75, end: 1, color: '#FF3B30' }      // Obese
  ];
  
  segments.forEach(seg => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle + (seg.start * Math.PI), startAngle + (seg.end * Math.PI));
    ctx.lineWidth = 20;
    ctx.strokeStyle = seg.color;
    ctx.stroke();
  });
  
  // Draw needle
  const bmiAngle = Math.min(Math.max(bmi, 10), 40);
  const needleAngle = startAngle + ((bmiAngle - 10) / 30) * Math.PI;
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + (radius - 10) * Math.cos(needleAngle),
    centerY + (radius - 10) * Math.sin(needleAngle)
  );
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.stroke();
  
  // Center dot
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  
  document.getElementById('gaugeLabel').textContent = `Your BMI: ${bmi}`;
}

// ============================================
// MEDICINE INFO
// ============================================
async function searchMedicine() {
  const input = document.getElementById('medicineInput');
  const name = input.value.trim();
  if (!name) {
    alert('Please enter a medicine name.');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/medicine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await response.json();
    showMedicineResult(data);
  } catch (error) {
    alert('Could not connect to server.');
  }
}

function quickMedSearch(name) {
  document.getElementById('medicineInput').value = name;
  searchMedicine();
}

function showMedicineResult(data) {
  const resultDiv = document.getElementById('medicineResult');
  resultDiv.style.display = 'block';
  
  if (!data.found) {
    resultDiv.innerHTML = `<div class="result-card gray"><p>${data.message}</p></div>`;
    return;
  }
  
  resultDiv.innerHTML = `
    <div class="result-card ${data.color}">
      <h3 style="font-size:20px;margin-bottom:8px;">${data.emoji} ${data.generic}</h3>
      <span class="result-severity severity-mild">${data.category}</span>
      
      <div style="margin-top:16px;">
        <p style="font-size:14px;margin-bottom:12px;"><strong>✅ Use:</strong> ${data.use}</p>
        <p style="font-size:14px;margin-bottom:12px;"><strong>💊 Dosage:</strong> ${data.dosage}</p>
        <p style="font-size:14px;margin-bottom:12px;"><strong>⚠️ Side Effects:</strong> ${data.sideEffects}</p>
        <p style="font-size:14px;margin-bottom:12px;"><strong>🚨 Warnings:</strong> ${data.warnings}</p>
      </div>
      
      ${data.disclaimer ? '<p class="result-disclaimer">⚠️ Always follow your doctor\'s prescription. Do not self-medicate.</p>' : ''}
    </div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('medicineInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchMedicine();
});


// ============================================
// FIRST AID
// ============================================
async function loadFirstAid() {
  try {
    const response = await fetch(`${API_URL}/firstaid`);
    const data = await response.json();
    renderFirstAidGrid(data.guides);
  } catch (error) {
    console.error('Could not load first aid guides');
  }
}

function renderFirstAidGrid(guides) {
  const grid = document.getElementById('firstaidGrid');
  grid.innerHTML = guides.map(guide => `
    <div class="firstaid-card" onclick="openFirstAidModal('${guide.id}')">
      <div class="firstaid-icon" style="background:${guide.color === 'red' ? '#FFE5E5' : guide.color === 'orange' ? '#FFF3E0' : '#E8F2FF'}">
        ${guide.emoji}
      </div>
      <div class="firstaid-content">
        <div class="firstaid-title">${guide.title}</div>
        <span class="firstaid-severity" style="background:${guide.color === 'red' ? '#FFE5E5' : guide.color === 'orange' ? '#FFF3E0' : '#E8F2FF'};color:${guide.color === 'red' ? '#FF3B30' : guide.color === 'orange' ? '#FF9500' : '#007AFF'}">
          ${guide.severity}
        </span>
      </div>
    </div>
  `).join('');
}

async function openFirstAidModal(id) {
  try {
    const response = await fetch(`${API_URL}/firstaid/${id}`);
    const guide = await response.json();
    
    const modal = document.getElementById('firstaidModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
      <h2 style="font-size:24px;margin-bottom:8px;">${guide.emoji} ${guide.title}</h2>
      <span class="result-severity ${guide.severity.includes('Emergency') ? 'severity-emergency' : 'severity-moderate'}">${guide.severity}</span>
      
      <div style="margin-top:20px;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:12px;">📋 Steps:</h3>
        <ol style="padding-left:20px;line-height:1.8;">
          ${guide.steps.map(step => `<li style="margin-bottom:8px;">${step}</li>`).join('')}
        </ol>
      </div>
      
      <div style="margin-top:20px;padding:14px;background:#FFE5E5;border-radius:10px;border-left:4px solid #FF3B30;">
        <p style="font-size:14px;font-weight:700;margin-bottom:6px;">🚨 When to go to ER:</p>
        <p style="font-size:14px;">${guide.goToER}</p>
      </div>
      
      <div style="margin-top:16px;padding:12px;background:rgba(0,122,255,0.1);border-radius:10px;">
        <p style="font-size:13px;color:#007AFF;">${guide.tip}</p>
      </div>
    `;
    
    modal.style.display = 'flex';
  } catch (error) {
    alert('Could not load guide details.');
  }
}

function closeModal() {
  document.getElementById('firstaidModal').style.display = 'none';
}

// ============================================
// DIET PLANNER
// ============================================
async function loadDietPlan(condition) {
  try {
    const response = await fetch(`${API_URL}/diet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ condition })
    });
    const data = await response.json();
    showDietResult(data);
  } catch (error) {
    alert('Could not connect to server.');
  }
}

function showDietResult(data) {
  const resultDiv = document.getElementById('dietResult');
  resultDiv.style.display = 'block';
  
  resultDiv.innerHTML = `
    <div class="result-card ${data.color}">
      <h3 style="font-size:20px;margin-bottom:8px;">${data.title}</h3>
      <p style="font-size:14px;color:#3C3C43;margin-bottom:16px;"><strong>Goal:</strong> ${data.goal}</p>
      
      <div style="margin-bottom:16px;">
        <h4 style="font-size:16px;font-weight:700;margin-bottom:8px;">✅ Foods to Eat:</h4>
        <ul style="padding-left:20px;line-height:1.8;">
          ${data.doEat.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div style="margin-bottom:16px;">
        <h4 style="font-size:16px;font-weight:700;margin-bottom:8px;">🚫 Foods to Avoid:</h4>
        <ul style="padding-left:20px;line-height:1.8;">
          ${data.avoid.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background:#F2F2F7;padding:14px;border-radius:10px;margin-bottom:16px;">
        <h4 style="font-size:16px;font-weight:700;margin-bottom:12px;">🍽️ Sample Day:</h4>
        <p style="font-size:14px;margin-bottom:6px;"><strong>Breakfast:</strong> ${data.sampleDay.breakfast}</p>
        <p style="font-size:14px;margin-bottom:6px;"><strong>Lunch:</strong> ${data.sampleDay.lunch}</p>
        <p style="font-size:14px;margin-bottom:6px;"><strong>Snack:</strong> ${data.sampleDay.snack}</p>
        <p style="font-size:14px;"><strong>Dinner:</strong> ${data.sampleDay.dinner}</p>
      </div>
      
      <div style="padding:12px;background:rgba(0,122,255,0.1);border-radius:10px;margin-bottom:12px;">
        <p style="font-size:13px;color:#007AFF;">${data.tip}</p>
      </div>
      
      ${data.disclaimer ? '<p class="result-disclaimer">⚠️ Consult a nutritionist or doctor for a personalized diet plan.</p>' : ''}
    </div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// BLOOD TESTS
// ============================================
async function loadBloodTests() {
  try {
    const response = await fetch(`${API_URL}/bloodtest`);
    const data = await response.json();
    renderBloodTestGrid(data.tests);
  } catch (error) {
    console.error('Could not load blood tests');
  }
}

function renderBloodTestGrid(tests) {
  const grid = document.getElementById('bloodtestGrid');
  grid.innerHTML = tests.map(test => `
    <div class="bloodtest-card" onclick="openBloodTestModal('${test.id}')">
      <div class="bloodtest-icon" style="background:#E8F2FF">${test.emoji}</div>
      <div class="bloodtest-content">
        <div class="bloodtest-title">${test.name}</div>
        <div class="bloodtest-category">${test.category}</div>
      </div>
    </div>
  `).join('');
}

async function openBloodTestModal(id) {
  try {
    const response = await fetch(`${API_URL}/bloodtest/${id}`);
    const test = await response.json();
    
    const modal = document.getElementById('bloodtestModal');
    const content = document.getElementById('bloodModalContent');
    
    content.innerHTML = `
      <h2 style="font-size:24px;margin-bottom:8px;">${test.emoji} ${test.name}</h2>
      <span class="result-severity severity-mild">${test.category}</span>
      
      <div style="margin-top:20px;">
        <p style="font-size:14px;margin-bottom:12px;"><strong>🔬 What it measures:</strong> ${test.whatItMeasures}</p>
        <p style="font-size:14px;margin-bottom:12px;"><strong>📋 Why done:</strong> ${test.whyDone}</p>
      </div>
      
      <div style="background:#F2F2F7;padding:14px;border-radius:10px;margin:16px 0;">
        <h4 style="font-size:16px;font-weight:700;margin-bottom:8px;">📊 Normal Ranges:</h4>
        <ul style="padding-left:20px;line-height:1.8;">
          ${test.normalRanges.map(range => `<li>${range}</li>`).join('')}
        </ul>
      </div>
      
      <p style="font-size:14px;margin-bottom:12px;"><strong>🔴 High means:</strong> ${test.highMeans}</p>
      <p style="font-size:14px;margin-bottom:12px;"><strong>🔵 Low means:</strong> ${test.lowMeans}</p>
      
      <div style="padding:12px;background:rgba(0,122,255,0.1);border-radius:10px;margin-top:16px;">
        <p style="font-size:13px;color:#007AFF;">${test.tip}</p>
      </div>
    `;
    
    modal.style.display = 'flex';
  } catch (error) {
    alert('Could not load test details.');
  }
}

function closeBloodModal() {
  document.getElementById('bloodtestModal').style.display = 'none';
}

// ============================================
// HEALTH TIPS
// ============================================
const healthTips = [
  { icon: '💧', color: '#E8F2FF', title: 'Stay Hydrated', desc: 'Drink at least 8 glasses (2 liters) of water daily. Proper hydration improves energy, skin health, and digestion.' },
  { icon: '🥗', color: '#E8F8EE', title: 'Eat a Balanced Diet', desc: 'Include fruits, vegetables, whole grains, lean proteins, and healthy fats. Avoid processed and junk food.' },
  { icon: '🏃', color: '#FFF3E0', title: 'Exercise Regularly', desc: 'Aim for 30 minutes of moderate exercise at least 5 days a week. Walking, cycling, or yoga are great.' },
  { icon: '😴', color: '#F3E8FF', title: 'Get Enough Sleep', desc: 'Adults need 7–9 hours of quality sleep per night. Good sleep boosts immunity, mood, and cognitive function.' },
  { icon: '🧘', color: '#E8F8EE', title: 'Manage Stress', desc: 'Practice deep breathing, meditation, or journaling. Chronic stress weakens your immune system.' },
  { icon: '🚭', color: '#FFE5E5', title: 'Avoid Smoking & Alcohol', desc: 'Smoking and excessive alcohol increase risk of cancer, heart disease, and liver damage.' },
  { icon: '🦷', color: '#E8F2FF', title: 'Maintain Oral Hygiene', desc: 'Brush twice daily, floss regularly, and visit a dentist every 6 months.' },
  { icon: '☀️', color: '#FFF8EC', title: 'Get Some Sunlight', desc: 'Spend 15–20 minutes in morning sunlight daily. It boosts Vitamin D and improves mood.' },
  { icon: '🤝', color: '#E8F8EE', title: 'Stay Socially Connected', desc: 'Maintain healthy relationships. Social connection reduces stress and improves mental wellbeing.' },
  { icon: '🩺', color: '#E8F2FF', title: 'Regular Health Checkups', desc: 'Visit your doctor for annual checkups even when healthy. Early detection leads to better outcomes.' }
];

function renderHealthTips() {
  const grid = document.getElementById('tipsGrid');
  grid.innerHTML = healthTips.map((tip, index) => `
    <div class="tip-card" style="animation-delay:${index * 0.05}s">
      <div class="tip-icon" style="background:${tip.color}">${tip.icon}</div>
      <div class="tip-content">
        <div class="tip-title">${tip.title}</div>
        <div class="tip-desc">${tip.desc}</div>
      </div>
    </div>
  `).join('');
}

// ============================================
// MEDICATION REMINDER
// ============================================
function setMedicationReminder(medicine, time) {
  const reminderTime = new Date(time).getTime();
  const now = Date.now();
  const delay = reminderTime - now;
  
  if (delay > 0) {
    setTimeout(() => {
      showReminderToast(`💊 Time to take ${medicine}`);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('MOZP-Curebot Reminder', {
          body: `Time to take ${medicine}`,
          icon: '🩺'
        });
      }
    }, delay);
  }
}

function showReminderToast(text) {
  const toast = document.getElementById('reminderToast');
  document.getElementById('reminderText').textContent = text;
  toast.style.display = 'flex';
}

function dismissReminder() {
  document.getElementById('reminderToast').style.display = 'none';
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderSymptomGrid();
  renderHealthTips();
  renderSymptomHistory();
  loadFirstAid();
  loadBloodTests();
  console.log('? MOZP-Curebot v2.0 loaded successfully!');
});

