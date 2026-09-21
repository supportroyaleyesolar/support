const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const COMPLAINTS_FILE = path.join(DATA_DIR, 'complaints.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper functions for data read/write
function readJsonFile(filePath, fallbackValue) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallbackValue;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Initial default seed data for Complaints
const INITIAL_SEEDS = [
  {
    id: 'REX-2026-1001',
    date: '2026-09-17 08:30 AM',
    timestamp: Date.now() - 3600000 * 2,
    customerName: 'K. R. Narayanan',
    phone: '9846653834',
    altPhone: '9447100011',
    ksebConsumer: '48291',
    ksebBranch: 'Kaipamangalam',
    product: 'Lithium Battery',
    brandModel: 'REX 5.12kWh LiFePO4 Smart Pack',
    installationType: 'Residential (Home)',
    priority: 'Emergency',
    district: 'Thrissur',
    address: 'Narayana Nivas, Near Edamuttam High School',
    landmark: 'Edamuttam Jn, 680568',
    issuePreset: 'REX Smart BMS Alarm / Red warning indicator',
    issueDescription: 'BMS is beeping with Error code 03. The battery does not supply power to inverter during evening power cuts.',
    photoUrl: null,
    status: 'In Progress',
    assignedTech: 'Rajesh Varma',
    techPhone: '+91 80758 73679',
    resolutionNotes: 'Technician on-site inspecting BMS communication cable and cell balancing.'
  },
  {
    id: 'REX-2026-1002',
    date: '2026-09-17 09:15 AM',
    timestamp: Date.now() - 3600000 * 1,
    customerName: 'Dr. Abdul Sathar',
    phone: '9447123456',
    altPhone: '',
    ksebConsumer: '10928',
    ksebBranch: 'Chavakkad',
    product: 'Inverters',
    brandModel: 'Rex Hybrid 5kVA MPPT Inverter',
    installationType: 'Commercial / Business',
    priority: 'High',
    district: 'Thrissur',
    address: 'Sathar Hospital Road, Chavakkad',
    landmark: 'Opp. New Bus Stand',
    issuePreset: 'Inverter tripping MCB breaker continuously',
    issueDescription: 'Whenever solar grid power switches, the main MCB trips instantly.',
    photoUrl: null,
    status: 'Pending Assignment',
    assignedTech: '',
    techPhone: '',
    resolutionNotes: ''
  }
];

// Initialize seed data if files don't exist
if (!fs.existsSync(COMPLAINTS_FILE)) {
  writeJsonFile(COMPLAINTS_FILE, INITIAL_SEEDS);
}

// ── REST API ENDPOINTS ──────────────────────────────────────────

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Royal Eye Solar Backend API & Render Data Storage'
  });
});

// GET all complaints
app.get('/api/complaints', (req, res) => {
  const complaints = readJsonFile(COMPLAINTS_FILE, INITIAL_SEEDS);
  res.json(complaints);
});

// POST / Save Complaints (bulk update or add single)
app.post('/api/complaints', (req, res) => {
  const payload = req.body;
  
  if (Array.isArray(payload)) {
    // Bulk replace
    writeJsonFile(COMPLAINTS_FILE, payload);
    return res.json({ success: true, count: payload.length, data: payload });
  } else if (payload && typeof payload === 'object' && payload.id) {
    // Single complaint submission
    let current = readJsonFile(COMPLAINTS_FILE, []);
    const existingIndex = current.findIndex(item => item.id === payload.id);
    if (existingIndex !== -1) {
      current[existingIndex] = payload;
    } else {
      current.unshift(payload);
    }
    writeJsonFile(COMPLAINTS_FILE, current);
    return res.json({ success: true, item: payload, data: current });
  }

  res.status(400).json({ error: 'Invalid payload structure' });
});

// PUT update single complaint by ID
app.put('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  let current = readJsonFile(COMPLAINTS_FILE, []);
  
  const idx = current.findIndex(item => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  current[idx] = { ...current[idx], ...updates };
  writeJsonFile(COMPLAINTS_FILE, current);
  res.json({ success: true, item: current[idx], data: current });
});

// DELETE single complaint by ID
app.delete('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  let current = readJsonFile(COMPLAINTS_FILE, []);
  
  const updated = current.filter(item => item.id !== id);
  writeJsonFile(COMPLAINTS_FILE, updated);
  res.json({ success: true, deletedId: id, count: updated.length });
});

// GET settings
app.get('/api/settings', (req, res) => {
  const settings = readJsonFile(SETTINGS_FILE, null);
  res.json(settings || {});
});

// POST settings
app.post('/api/settings', (req, res) => {
  const settingsData = req.body;
  if (!settingsData || typeof settingsData !== 'object') {
    return res.status(400).json({ error: 'Invalid settings payload' });
  }
  writeJsonFile(SETTINGS_FILE, settingsData);
  res.json({ success: true, data: settingsData });
});

// ── STATIC FILES SERVING ───────────────────────────────────────
app.use(express.static(__dirname));

// ── NAMED PORTAL ROUTES (clean URLs) ───────────────────────────
// Customer Portal
app.get('/portal', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin / Helpdesk Dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Settings / CMS Manager
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'settings.html'));
});

// Fallback: serve index.html for any unknown non-API path
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Royal Eye Solar Power Portal Server Listening on Port ${PORT}`);
  console.log(`Render REST API: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
