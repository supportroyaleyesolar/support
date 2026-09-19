/**
 * Royal Eye Solar Power (REX) — Website & Team Settings Manager
 * settings.js — CMS logic: load, edit, and save all portal settings without code.
 */

const SETTINGS_SESSION_KEY = 'REX_SETTINGS_SESSION';
const ADMIN_SESSION_KEY    = 'REX_ADMIN_SESSION';
const SETTINGS_KEY         = 'REX_SOLAR_SETTINGS_v1';
const COMPLAINTS_KEY       = 'REX_SOLAR_COMPLAINTS_v1';

// ── DEFAULT SETTINGS OBJECT ───────────────────────────────────────
const DEFAULT_SETTINGS = {
  company: {
    name: 'Royal Eye Solar Power',
    rex: 'REX',
    tagline: 'Powering Your Future With The Sun',
    subTagline: 'Cleaner Today, A Brighter Tomorrow',
    address: 'Edamuttam, Thrissur, Kerala - 680568',
    city: 'Thrissur',
    hours: '24/7 Support Available',
    helplines: ['+91 80758 73679', '+91 90745 72600'],
    whatsapp: '918075873679',
    email: ''
  },
  hero: {
    heading: 'Register Your Service Complaint Or Maintenance Request',
    desc: 'Quick resolution for Inverters, REX Lithium Batteries, Tubular Batteries, Rooftop Solar Plants, and Solar Water Heaters. Our Thrissur-based field engineers are ready for rapid on-site dispatch.',
    badge: 'Authorized Service & Warranty Support',
    metrics: [
      { value: '< 4 Hours', label: 'Emergency Response' },
      { value: '100%',      label: 'Genuine Spare Parts' },
      { value: 'Kerala-wide', label: 'Certified Technicians' }
    ]
  },
  partners: ['WAAREE', 'Vikram Solar', 'Adani Solar', 'EMMVEE', 'RenewSys', 'Eastman', 'EXIDE', 'MICROTEK'],
  products: [
    {
      id: 'inverters',
      name: 'Inverter',
      category: 'Inverters',
      description: 'Off-Grid, On-Grid, Hybrid & Home Inverters',
      issues: [
        'Inverter not turning ON / Complete Blackout',
        'Display Error Code (E01, E02, E04, Overload)',
        'Inverter tripping MCB breaker continuously',
        'Beeping sound / Continuous alarm alert',
        'Solar charging not working / Grid bypass fault',
        'Strange burning smell or unusual fan noise',
        'Periodic AMC / Scheduled Maintenance Check'
      ]
    },
    {
      id: 'battery',
      name: 'Tubular Battery',
      category: 'Battery',
      description: 'Lead-Acid, Tall Tubular & Solar Backup Batteries',
      issues: [
        'Backup dropped drastically (< 30 minutes)',
        'Electrolyte / Acid dry in tubular cells',
        'Severe white sulphation / terminal corrosion',
        'Battery overheating or swelling during charge',
        'Battery voltage drops below 10.5V under normal load',
        'Distilled water top-up request'
      ]
    },
    {
      id: 'lithium',
      name: 'Lithium Battery',
      category: 'Lithium Battery',
      description: 'REX LiFePO4 Smart Battery & Wallmount Systems',
      issues: [
        'REX Smart BMS Alarm / Red warning indicator',
        'SOC (State of Charge) percentage mismatch / jumps',
        'Inverter communication error (CAN / RS485 disconnect)',
        'Battery shuts down under peak power loads',
        'Cell voltage imbalance alert on display',
        'Firmware diagnostic checkup request'
      ]
    },
    {
      id: 'solar',
      name: 'Solar Service',
      category: 'Solar Service',
      description: 'Rooftop Solar, Low Generation, Wiring & AMC',
      issues: [
        'Solar electricity generation output dropped significantly',
        'Rooftop panel cleaning & mounting check',
        'Array Junction Box (AJB) / DC wire damage',
        'On-Grid Net Metering export stopped registering',
        'Solar inverter sync failure with KSEB grid',
        'Lightning surge / Earthing pit check'
      ]
    },
    {
      id: 'solar-water',
      name: 'Solar Water Service',
      category: 'Solar Water Service',
      description: 'Solar Water Heaters, Collector & Piping Service',
      issues: [
        'No hot water or only lukewarm during sunny weather',
        'Continuous water leakage from manifold / glass tubes',
        'Storage tank rust, scale accumulation & sediment clean',
        'Piping airlock / Low pressure water output',
        'Electric backup booster element not functioning'
      ]
    },
    {
      id: 'water-heater',
      name: 'Water Heater',
      category: 'Water Heater',
      description: 'Electric Geysers & Hybrid Heat Pump Heaters',
      issues: [
        'Electric geyser not heating water at all',
        'Thermostat tripping / water excessively boiling',
        'Earthing leakage / Electric shock sensation from tap',
        'Pressure safety relief valve continuously dripping',
        'Tank body corrosion / structural water leakage'
      ]
    }
  ],
  technicians: [
    { id: 'T1', name: 'Suresh Kumar',    zone: 'Central Thrissur & Ollur',     phone: '+91 94471 23456', status: 'Available' },
    { id: 'T2', name: 'Rajesh Varma',    zone: 'Edamuttam & Kodungallur Hub',  phone: '+91 98466 53834', status: 'Busy' },
    { id: 'T3', name: 'Anoop Narayanan', zone: 'Chalakudy & Angamaly',         phone: '+91 80758 73679', status: 'Available' },
    { id: 'T4', name: 'Midhun Chandran', zone: 'Guruvayur & Kunnamkulam',      phone: '+91 70340 22603', status: 'Available' },
    { id: 'T5', name: 'Vishnu K.',       zone: 'Palakkad & Shornur border',    phone: '+91 95678 12390', status: 'Available' }
  ],
  staffAccounts: {
    'rex.admin':   { password: 'RoyalEye@2026', displayName: 'REX Admin',            role: 'Super Admin' },
    'helpdesk1':   { password: 'Support#1234',   displayName: 'Helpdesk Executive 1', role: 'Support Staff' },
    'helpdesk2':   { password: 'Assist@5678',    displayName: 'Helpdesk Executive 2', role: 'Support Staff' },
    'supervisor':  { password: 'Supervisor@99',  displayName: 'Field Supervisor',     role: 'Supervisor' }
  }
};

// ── LIVE SETTINGS STATE ───────────────────────────────────────────
let settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)); // deep clone
let activeProductIndex = 0;

// ── AUTH ──────────────────────────────────────────────────────────
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  const stored = localStorage.getItem(SETTINGS_KEY);
  const savedSettings = stored ? JSON.parse(stored) : null;
  const customAccounts = (savedSettings && savedSettings.staffAccounts) ? savedSettings.staffAccounts : {};
  const accounts = { ...DEFAULT_SETTINGS.staffAccounts, ...customAccounts };

  // Case-insensitive username search
  let matchedAccount = null;
  let matchedUsername = username;
  for (const [key, acc] of Object.entries(accounts)) {
    if (key.trim().toLowerCase() === username) {
      matchedAccount = acc;
      matchedUsername = key;
      break;
    }
  }

  const isMatch = matchedAccount && (
    matchedAccount.password === password ||
    String(matchedAccount.password).trim() === password.trim()
  );

  if (isMatch) {
    const sessionData = JSON.stringify({
      username: matchedUsername,
      displayName: matchedAccount.displayName || matchedUsername,
      role: matchedAccount.role || 'Support Staff',
      loginTime: new Date().toISOString()
    });
    sessionStorage.setItem(SETTINGS_SESSION_KEY, sessionData);
    sessionStorage.setItem(ADMIN_SESSION_KEY, sessionData);
    errorEl.classList.remove('visible');
    bootSettingsApp();
  } else {
    errorEl.classList.add('visible');
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function handleLogout() {
  // Clear settings session immediately without modal confirm block
  sessionStorage.removeItem(SETTINGS_SESSION_KEY);
  // Note: We preserve ADMIN_SESSION_KEY so the staff helpdesk site continues functioning
  document.getElementById('settings-app').classList.remove('visible');
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  showToast('Signed out of Settings Manager. Team Helpdesk session remains active.', 'info');
  lucide.createIcons();
}

function checkExistingSession() {
  const sSession = sessionStorage.getItem(SETTINGS_SESSION_KEY);
  if (sSession) {
    try { JSON.parse(sSession); bootSettingsApp(); return true; }
    catch (e) { sessionStorage.removeItem(SETTINGS_SESSION_KEY); }
  }
  // Auto-connect if already signed into Staff Helpdesk
  const aSession = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (aSession) {
    try {
      JSON.parse(aSession);
      sessionStorage.setItem(SETTINGS_SESSION_KEY, aSession);
      bootSettingsApp();
      return true;
    } catch (e) {}
  }
  return false;
}

async function bootSettingsApp() {
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('settings-app').classList.add('visible');
  await loadSettings();
  renderAllPanels();
  lucide.createIcons();
}

// ── LOAD / SAVE SETTINGS ─────────────────────────────────────────
async function loadSettings() {
  try {
    let localParsed = null;
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      localParsed = JSON.parse(stored);
    }

    let effective = localParsed;
    if (window.RexApi && typeof window.RexApi.getSettings === 'function') {
      const cloudSettings = await window.RexApi.getSettings(localParsed);
      if (cloudSettings && Object.keys(cloudSettings).length > 0) {
        effective = cloudSettings;
      }
    }

    if (effective) {
      if (effective.company && Array.isArray(effective.company.helplines)) {
        effective.company.helplines = effective.company.helplines.filter(num => !num.includes('98466') && !num.includes('70340'));
        if (!effective.company.helplines.some(n => n.includes('80758'))) effective.company.helplines.unshift('+91 80758 73679');
        if (!effective.company.helplines.some(n => n.includes('90745'))) effective.company.helplines.push('+91 90745 72600');
      }
      if (effective.company && effective.company.whatsapp === '919846653834') {
        effective.company.whatsapp = '918075873679';
      }
      settings = deepMerge(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), effective);
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
    } else {
      settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
  } catch (e) {
    settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }
}

async function saveAllSettings() {
  // Collect all form values into settings object
  collectCompanyPanel();
  collectHeroPanel();
  collectPartnersPanel();
  collectProductsPanel();
  collectTechniciansPanel();
  collectStaffPanel();

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (window.RexApi && typeof window.RexApi.saveSettings === 'function') {
      await window.RexApi.saveSettings(settings);
    }
    const staffCount = Object.keys(settings.staffAccounts || {}).length;
    showToast(`All settings saved successfully! ${staffCount} staff account(s) ready for login.`, 'success');
    const hint = document.getElementById('save-hint-text');
    if (hint) hint.textContent = 'Settings saved at ' + new Date().toLocaleTimeString('en-IN');
  } catch (e) {
    showToast('Error saving settings. Storage may be full.', 'error');
  }
}

function reloadDefaults() {
  if (!confirm('Discard unsaved changes and reload saved settings?')) return;
  loadSettings();
  renderAllPanels();
  showToast('Reverted to last saved state.', 'success');
}

function resetSettings(type) {
  const msgs = {
    content: 'Reset all website content to factory defaults?',
    technicians: 'Reset all field technicians to default team?',
    staff: 'Reset all staff accounts to default credentials?',
    all: '⚠ FULL RESET: This will delete ALL complaints, settings, and accounts. Are you absolutely sure?'
  };
  if (!confirm(msgs[type])) return;

  if (type === 'content' || type === 'all') {
    settings.company   = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.company));
    settings.hero      = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.hero));
    settings.partners  = [...DEFAULT_SETTINGS.partners];
    settings.products  = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.products));
  }
  if (type === 'technicians' || type === 'all') {
    settings.technicians = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.technicians));
  }
  if (type === 'staff' || type === 'all') {
    settings.staffAccounts = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.staffAccounts));
  }
  if (type === 'all') {
    localStorage.removeItem(COMPLAINTS_KEY);
  }

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  renderAllPanels();
  showToast('Reset complete!', 'success');
}

// ── PANEL NAVIGATION ─────────────────────────────────────────────
function showPanel(panelName) {
  document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + panelName).classList.add('active');
  document.getElementById('nav-' + panelName).classList.add('active');
  lucide.createIcons();
}

// ── RENDER ALL PANELS ─────────────────────────────────────────────
function renderAllPanels() {
  renderCompanyPanel();
  renderHeroPanel();
  renderPartnersPanel();
  renderProductsPanel();
  renderTechniciansPanel();
  renderStaffPanel();
  lucide.createIcons();
}

// ── COMPANY PANEL ─────────────────────────────────────────────────
function renderCompanyPanel() {
  const c = settings.company;
  setValue('co-name',       c.name);
  setValue('co-rex',        c.rex);
  setValue('co-tagline',    c.tagline);
  setValue('co-sub-tagline',c.subTagline);
  setValue('co-address',    c.address);
  setValue('co-city',       c.city);
  setValue('co-hours',      c.hours);
  setValue('co-whatsapp',   c.whatsapp);
  setValue('co-email',      c.email || '');

  // Helplines
  const container = document.getElementById('helplines-container');
  container.innerHTML = '';
  (c.helplines || []).forEach((num, idx) => {
    container.appendChild(buildHelplineRow(num, idx));
  });
}

function buildHelplineRow(value, idx) {
  const row = document.createElement('div');
  row.className = 'helpline-row';
  row.id = `helpline-row-${idx}`;
  row.innerHTML = `
    <input type="text" class="sform-input helpline-input" value="${escHtml(value)}" placeholder="+91 80758 73679">
    <button class="btn-remove" onclick="removeHelplineRow(${idx})" title="Remove"><i data-lucide="trash-2"></i></button>
  `;
  return row;
}

function addHelplineRow() {
  const container = document.getElementById('helplines-container');
  const idx = container.children.length;
  container.appendChild(buildHelplineRow('', idx));
  lucide.createIcons();
}

function removeHelplineRow(idx) {
  document.getElementById(`helpline-row-${idx}`)?.remove();
  // Re-index
  document.querySelectorAll('.helpline-row').forEach((row, i) => { row.id = `helpline-row-${i}`; });
}

function collectCompanyPanel() {
  settings.company.name       = getValue('co-name');
  settings.company.rex        = getValue('co-rex');
  settings.company.tagline    = getValue('co-tagline');
  settings.company.subTagline = getValue('co-sub-tagline');
  settings.company.address    = getValue('co-address');
  settings.company.city       = getValue('co-city');
  settings.company.hours      = getValue('co-hours');
  settings.company.whatsapp   = getValue('co-whatsapp');
  settings.company.email      = getValue('co-email');

  const inputs = document.querySelectorAll('.helpline-input');
  settings.company.helplines = Array.from(inputs).map(i => i.value.trim()).filter(v => v);
}

// ── HERO PANEL ───────────────────────────────────────────────────
function renderHeroPanel() {
  const h = settings.hero;
  setValue('hero-heading', h.heading);
  setValue('hero-desc',    h.desc);
  setValue('hero-badge',   h.badge);

  const container = document.getElementById('metrics-container');
  container.innerHTML = '';
  (h.metrics || []).forEach((m, idx) => {
    const row = document.createElement('div');
    row.className = 'metric-edit-row';
    row.id = `metric-row-${idx}`;
    row.innerHTML = `
      <div class="sform-group" style="margin:0;">
        <label>Value / Number</label>
        <input type="text" class="sform-input metric-value" value="${escHtml(m.value)}" placeholder="e.g. 4 Hours, 100%, Kerala-wide">
      </div>
      <div class="sform-group" style="margin:0;">
        <label>Label Text</label>
        <input type="text" class="sform-input metric-label" value="${escHtml(m.label)}" placeholder="e.g. Emergency Response">
      </div>
      <button class="btn-remove" onclick="removeMetricRow(${idx})" title="Remove"><i data-lucide="trash-2"></i></button>
    `;
    container.appendChild(row);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'btn-add-row';
  addBtn.id = 'add-metric-btn';
  addBtn.onclick = addMetricRow;
  addBtn.innerHTML = '<i data-lucide="plus-circle"></i> Add Metric Card';
  container.appendChild(addBtn);
}

function addMetricRow() {
  const container = document.getElementById('metrics-container');
  const addBtn    = document.getElementById('add-metric-btn');
  const idx       = container.querySelectorAll('.metric-edit-row').length;

  const row = document.createElement('div');
  row.className = 'metric-edit-row';
  row.id = `metric-row-${idx}`;
  row.innerHTML = `
    <div class="sform-group" style="margin:0;">
      <label>Value / Number</label>
      <input type="text" class="sform-input metric-value" placeholder="e.g. 4 Hours">
    </div>
    <div class="sform-group" style="margin:0;">
      <label>Label Text</label>
      <input type="text" class="sform-input metric-label" placeholder="e.g. Emergency Response">
    </div>
    <button class="btn-remove" onclick="removeMetricRow(${idx})" title="Remove"><i data-lucide="trash-2"></i></button>
  `;
  container.insertBefore(row, addBtn);
  lucide.createIcons();
}

function removeMetricRow(idx) {
  document.getElementById(`metric-row-${idx}`)?.remove();
}

function collectHeroPanel() {
  settings.hero.heading = getValue('hero-heading');
  settings.hero.desc    = getValue('hero-desc');
  settings.hero.badge   = getValue('hero-badge');

  const rows = document.querySelectorAll('.metric-edit-row');
  settings.hero.metrics = Array.from(rows).map(row => ({
    value: row.querySelector('.metric-value')?.value.trim() || '',
    label: row.querySelector('.metric-label')?.value.trim() || ''
  })).filter(m => m.value);
}

// ── PARTNERS PANEL ────────────────────────────────────────────────
function renderPartnersPanel() {
  const container = document.getElementById('partners-tags-container');
  container.innerHTML = '';
  (settings.partners || []).forEach((brand, idx) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.innerHTML = `${escHtml(brand)}<button onclick="removePartner(${idx})" title="Remove">&times;</button>`;
    container.appendChild(pill);
  });
}

function addPartnerTag() {
  const input = document.getElementById('new-partner-input');
  const val   = input.value.trim();
  if (!val) return;
  if (settings.partners.includes(val)) { showToast('Brand already exists.', 'error'); return; }
  settings.partners.push(val);
  renderPartnersPanel();
  input.value = '';
}

function removePartner(idx) {
  settings.partners.splice(idx, 1);
  renderPartnersPanel();
}

function collectPartnersPanel() {
  // Already maintained live via addPartnerTag / removePartner
}

// ── PRODUCTS PANEL ────────────────────────────────────────────────
function renderProductsPanel() {
  const tabNav  = document.getElementById('product-tab-nav');
  tabNav.innerHTML = '';

  settings.products.forEach((prod, idx) => {
    const btn = document.createElement('button');
    btn.className = 'product-tab-btn' + (idx === activeProductIndex ? ' active' : '');
    btn.textContent = prod.name;
    btn.onclick = () => { activeProductIndex = idx; renderProductsPanel(); };
    tabNav.appendChild(btn);
  });

  const editArea = document.getElementById('product-edit-area');
  const prod = settings.products[activeProductIndex];
  if (!prod) return;

  editArea.innerHTML = `
    <div class="sform-grid-2" style="margin-bottom:14px;">
      <div class="sform-group">
        <label>Product Display Name</label>
        <input type="text" class="sform-input" id="prod-name" value="${escHtml(prod.name)}" placeholder="e.g. Lithium Battery">
      </div>
      <div class="sform-group">
        <label>Category Key (used internally)</label>
        <input type="text" class="sform-input" id="prod-category" value="${escHtml(prod.category)}" placeholder="e.g. Lithium Battery">
      </div>
    </div>
    <div class="sform-group" style="margin-bottom:18px;">
      <label>Short Description (shown below product card)</label>
      <input type="text" class="sform-input" id="prod-desc" value="${escHtml(prod.description)}" placeholder="e.g. REX LiFePO4 Smart Battery & Wallmount Systems">
    </div>
    <div class="sform-group">
      <label>Common Fault / Issue Presets (customers select from this list)</label>
      <div class="issue-list" id="issues-list">
        ${prod.issues.map((issue, i) => `
          <div class="issue-row" id="issue-row-${i}">
            <input type="text" class="sform-input issue-input" value="${escHtml(issue)}" placeholder="Describe the fault or symptom...">
            <button class="btn-remove" onclick="removeIssue(${i})" title="Remove"><i data-lucide="trash-2"></i></button>
          </div>
        `).join('')}
      </div>
      <button class="btn-add-row" onclick="addIssueRow()" style="margin-top:8px;">
        <i data-lucide="plus-circle"></i> Add Fault / Issue Preset
      </button>
    </div>
    <div style="margin-top:14px;text-align:right;">
      <button class="btn-primary" onclick="saveCurrentProduct()">
        <i data-lucide="check"></i> Apply Product Changes
      </button>
    </div>
  `;
  lucide.createIcons();
}

function addIssueRow() {
  const list  = document.getElementById('issues-list');
  const idx   = list.children.length;
  const row   = document.createElement('div');
  row.className = 'issue-row';
  row.id = `issue-row-${idx}`;
  row.innerHTML = `
    <input type="text" class="sform-input issue-input" placeholder="Describe the fault or symptom...">
    <button class="btn-remove" onclick="removeIssue(${idx})" title="Remove"><i data-lucide="trash-2"></i></button>
  `;
  list.appendChild(row);
  lucide.createIcons();
}

function removeIssue(idx) {
  document.getElementById(`issue-row-${idx}`)?.remove();
}

function saveCurrentProduct() {
  const prod = settings.products[activeProductIndex];
  if (!prod) return;
  prod.name        = getValue('prod-name');
  prod.category    = getValue('prod-category');
  prod.description = getValue('prod-desc');
  prod.issues = Array.from(document.querySelectorAll('.issue-input'))
    .map(i => i.value.trim()).filter(v => v);
  showToast(`"${prod.name}" updated. Click Save All to persist.`, 'success');
  renderProductsPanel();
}

function collectProductsPanel() {
  // Products are collected individually via saveCurrentProduct
}

// ── TECHNICIANS PANEL ─────────────────────────────────────────────
function renderTechniciansPanel() {
  const tbody = document.getElementById('technicians-tbody');
  tbody.innerHTML = '';

  settings.technicians.forEach((tech, idx) => {
    const tr = document.createElement('tr');
    tr.id = `tech-row-${idx}`;
    tr.innerHTML = `
      <td style="color:var(--text-muted);font-weight:700;">${idx + 1}</td>
      <td><input type="text" class="tech-name" value="${escHtml(tech.name)}" placeholder="Engineer Full Name"></td>
      <td><input type="text" class="tech-zone" value="${escHtml(tech.zone)}" placeholder="Service Zone / Area"></td>
      <td><input type="tel" class="tech-phone" value="${escHtml(tech.phone)}" placeholder="+91 94471 23456"></td>
      <td>
        <button class="status-toggle ${tech.status === 'Available' ? 'status-available' : 'status-busy'}"
          onclick="toggleTechStatus(${idx})" id="tech-status-btn-${idx}">
          ● ${tech.status}
        </button>
      </td>
      <td>
        <button class="btn-remove" onclick="removeTechnician(${idx})" title="Remove Engineer">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  lucide.createIcons();
}

function addTechnicianRow() {
  settings.technicians.push({
    id: 'T' + (settings.technicians.length + 1),
    name: '', zone: '', phone: '', status: 'Available'
  });
  renderTechniciansPanel();
}

function removeTechnician(idx) {
  if (settings.technicians.length <= 1) { showToast('At least one technician must exist.', 'error'); return; }
  settings.technicians.splice(idx, 1);
  renderTechniciansPanel();
}

function toggleTechStatus(idx) {
  settings.technicians[idx].status = settings.technicians[idx].status === 'Available' ? 'Busy' : 'Available';
  const btn = document.getElementById(`tech-status-btn-${idx}`);
  if (btn) {
    btn.textContent = '● ' + settings.technicians[idx].status;
    btn.className = 'status-toggle ' + (settings.technicians[idx].status === 'Available' ? 'status-available' : 'status-busy');
  }
}

function collectTechniciansPanel() {
  const rows = document.querySelectorAll('#technicians-tbody tr');
  rows.forEach((row, idx) => {
    if (settings.technicians[idx]) {
      settings.technicians[idx].name  = row.querySelector('.tech-name')?.value.trim()  || '';
      settings.technicians[idx].zone  = row.querySelector('.tech-zone')?.value.trim()  || '';
      settings.technicians[idx].phone = row.querySelector('.tech-phone')?.value.trim() || '';
    }
  });
  settings.technicians = settings.technicians.filter(t => t.name);
}

// ── STAFF ACCOUNTS PANEL ──────────────────────────────────────────
function renderStaffPanel() {
  const tbody = document.getElementById('staff-tbody');
  tbody.innerHTML = '';

  const accounts = settings.staffAccounts || {};
  Object.entries(accounts).forEach(([username, acc]) => {
    const roleBadgeClass = acc.role === 'Super Admin' ? 'role-superadmin' : acc.role === 'Supervisor' ? 'role-supervisor' : 'role-staff';
    const tr = document.createElement('tr');
    tr.setAttribute('data-username', username);
    tr.innerHTML = `
      <td><input type="text" class="staff-username" value="${escHtml(username)}" placeholder="username"></td>
      <td><input type="text" class="staff-displayname" value="${escHtml(acc.displayName)}" placeholder="Full Name"></td>
      <td><input type="password" class="staff-password" value="${escHtml(acc.password)}" placeholder="New password" autocomplete="new-password"></td>
      <td>
        <select class="staff-role" style="background:var(--bg-input);border:1px solid var(--border-subtle);color:#fff;padding:6px 10px;border-radius:6px;">
          <option value="Super Admin" ${acc.role === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
          <option value="Supervisor"  ${acc.role === 'Supervisor'  ? 'selected' : ''}>Supervisor</option>
          <option value="Support Staff" ${acc.role === 'Support Staff' ? 'selected' : ''}>Support Staff</option>
        </select>
      </td>
      <td>
        <button class="btn-remove" onclick="removeStaff('${username}')" title="Remove Account">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  lucide.createIcons();
}

function addStaffRow() {
  const tbody = document.getElementById('staff-tbody');
  const tr = document.createElement('tr');
  tr.setAttribute('data-username', '__new__');
  tr.innerHTML = `
    <td><input type="text" class="staff-username" placeholder="username (e.g. helpdesk3)"></td>
    <td><input type="text" class="staff-displayname" placeholder="Full Name (optional)"></td>
    <td><input type="password" class="staff-password" placeholder="Set password" autocomplete="new-password"></td>
    <td>
      <select class="staff-role" style="background:var(--bg-input);border:1px solid var(--border-subtle);color:#fff;padding:6px 10px;border-radius:6px;">
        <option value="Support Staff">Support Staff</option>
        <option value="Supervisor">Supervisor</option>
        <option value="Super Admin">Super Admin</option>
      </select>
    </td>
    <td>
      <button class="btn-remove" onclick="this.closest('tr').remove()" title="Cancel">
        <i data-lucide="trash-2"></i>
      </button>
    </td>
  `;
  tbody.appendChild(tr);
  lucide.createIcons();
  const uInput = tr.querySelector('.staff-username');
  if (uInput) uInput.focus();
  showToast('Added new staff row. Enter username & password, then click Save!', 'info');
}

function removeStaff(username) {
  if (Object.keys(settings.staffAccounts).length <= 1) {
    showToast('At least one staff account must remain.', 'error'); return;
  }
  if (!confirm(`Remove account "${username}"?`)) return;
  delete settings.staffAccounts[username];
  renderStaffPanel();
}

function collectStaffPanel() {
  const rows = document.querySelectorAll('#staff-tbody tr');
  const newAccounts = {};
  let invalidRows = 0;

  rows.forEach(row => {
    const username    = row.querySelector('.staff-username')?.value.trim().toLowerCase();
    const displayName = row.querySelector('.staff-displayname')?.value.trim();
    const password    = row.querySelector('.staff-password')?.value.trim();
    const role        = row.querySelector('.staff-role')?.value || 'Support Staff';

    if (username && password) {
      newAccounts[username] = {
        password,
        displayName: displayName || username,
        role
      };
    } else if (username || password) {
      invalidRows++;
    }
  });

  if (invalidRows > 0) {
    showToast(`${invalidRows} staff row(s) missing either username or password.`, 'error');
  }

  if (Object.keys(newAccounts).length > 0) {
    settings.staffAccounts = newAccounts;
  }
}

// ── UTILITIES ─────────────────────────────────────────────────────
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle-2' : 'alert-triangle'}" style="width:18px;height:18px;"></i><span>${msg}</span>`;
  container.appendChild(toast);
  lucide.createIcons();
  setTimeout(() => {
    toast.style.cssText += 'opacity:0;transform:translateX(100%);transition:all 0.3s ease;';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  checkExistingSession();
});
