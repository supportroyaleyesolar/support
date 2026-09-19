/**
 * Royal Eye Solar Power (REX) — Staff Helpdesk Dashboard
 * admin.js — All helpdesk logic, login/logout, and ticket management.
 * This file is loaded ONLY by admin.html — customers never load it.
 */

const STORAGE_KEY  = 'REX_SOLAR_COMPLAINTS_v1';
const SESSION_KEY  = 'REX_ADMIN_SESSION';
const SETTINGS_KEY = 'REX_SOLAR_SETTINGS_v1';

function getEffectiveSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// ── STAFF CREDENTIALS ──────────────────────────────────────────────
// To add more staff accounts, simply add entries to this object or edit via settings.html
const STAFF_ACCOUNTS = {
  'rex.admin':    { password: 'RoyalEye@2026', displayName: 'REX Admin', role: 'Super Admin' },
  'helpdesk1':   { password: 'Support#1234',   displayName: 'Helpdesk Executive 1', role: 'Support Staff' },
  'helpdesk2':   { password: 'Assist@5678',    displayName: 'Helpdesk Executive 2', role: 'Support Staff' },
  'supervisor':  { password: 'Supervisor@99',  displayName: 'Field Supervisor', role: 'Supervisor' }
};

// ── SHARED DATA ────────────────────────────────────────────────────
let PRODUCT_ISSUES = {
  'Inverters': [
    'Inverter not turning ON / Complete Blackout',
    'Display Error Code (E01, E02, E04, Overload)',
    'Inverter tripping MCB breaker continuously',
    'Beeping sound / Continuous alarm alert',
    'Solar charging not working / Grid bypass fault',
    'Strange burning smell or unusual fan noise',
    'Periodic AMC / Scheduled Maintenance Check'
  ],
  'Battery': [
    'Backup dropped drastically (< 30 minutes)',
    'Electrolyte / Acid dry in tubular cells',
    'Severe white sulphation / terminal corrosion',
    'Battery overheating or swelling during charge',
    'Battery voltage drops below 10.5V under normal load',
    'Distilled water top-up request'
  ],
  'Lithium Battery': [
    'REX Smart BMS Alarm / Red warning indicator',
    'SOC (State of Charge) percentage mismatch / jumps',
    'Inverter communication error (CAN / RS485 disconnect)',
    'Battery shuts down under peak power loads',
    'Cell voltage imbalance alert on display',
    'Firmware diagnostic checkup request'
  ],
  'Solar Service': [
    'Solar electricity generation output dropped significantly',
    'Rooftop panel cleaning & mounting check',
    'Array Junction Box (AJB) / DC wire damage',
    'On-Grid Net Metering export stopped registering',
    'Solar inverter sync failure with KSEB grid',
    'Lightning surge / Earthing pit check'
  ],
  'Solar Water Service': [
    'No hot water or only lukewarm during sunny weather',
    'Continuous water leakage from manifold / glass tubes',
    'Storage tank rust, scale accumulation & sediment clean',
    'Piping airlock / Low pressure water output',
    'Electric backup booster element not functioning'
  ],
  'Water Heater': [
    'Electric geyser not heating water at all',
    'Thermostat tripping / water excessively boiling',
    'Earthing leakage / Electric shock sensation from tap',
    'Pressure safety relief valve continuously dripping',
    'Tank body corrosion / structural water leakage'
  ]
};

let TECHNICIANS = [
  { id: 'T1', name: 'Suresh Kumar',    zone: 'Central Thrissur & Ollur',     phone: '+91 94471 23456', status: 'Available' },
  { id: 'T2', name: 'Rajesh Varma',    zone: 'Edamuttam & Kodungallur Hub',  phone: '+91 98466 53834', status: 'Busy' },
  { id: 'T3', name: 'Anoop Narayanan', zone: 'Chalakudy & Angamaly',         phone: '+91 80758 73679', status: 'Available' },
  { id: 'T4', name: 'Midhun Chandran', zone: 'Guruvayur & Kunnamkulam',      phone: '+91 70340 22603', status: 'Available' },
  { id: 'T5', name: 'Vishnu K.',       zone: 'Palakkad & Shornur border',    phone: '+91 95678 12390', status: 'Available' }
];

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
    issueDescription: 'BMS beeping with Error code 03. Battery does not supply power to inverter during power cuts.',
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
    customerName: 'Dr. Elizabeth Mathew',
    phone: '8075873679',
    altPhone: '',
    ksebConsumer: '10255',
    ksebBranch: 'Fort',
    product: 'Inverters',
    brandModel: 'Microtek 5kVA Solar Hybrid',
    installationType: 'Commercial (Office / Clinic)',
    priority: 'High',
    district: 'Thrissur',
    address: 'Care Dental Clinic, Round West',
    landmark: 'Opposite Town Hall, Thrissur',
    issuePreset: 'Inverter tripping MCB breaker continuously',
    issueDescription: 'Whenever grid power cuts off, the inverter trips the main breaker immediately.',
    photoUrl: null,
    status: 'Assigned',
    assignedTech: 'Suresh Kumar',
    techPhone: '+91 94471 23456',
    resolutionNotes: 'Dispatched for 11:30 AM appointment.'
  },
  {
    id: 'REX-2026-1003',
    date: '2026-09-16 04:45 PM',
    timestamp: Date.now() - 3600000 * 18,
    customerName: 'Shaji Abdul Rahman',
    phone: '7034022603',
    altPhone: '9847012345',
    ksebConsumer: '88341',
    ksebBranch: 'North Parur',
    product: 'Solar Water Service',
    brandModel: 'Royal Eye 200 LPD Solar Water Heater',
    installationType: 'Residential (Home)',
    priority: 'Normal',
    district: 'Ernakulam',
    address: 'Baitul Aman, North Paravur',
    landmark: 'Near Municipal Park',
    issuePreset: 'Continuous water leakage from manifold / glass tubes',
    issueDescription: 'Water steadily dripping from the top gasket joint onto the terrace roof.',
    photoUrl: null,
    status: 'Open',
    assignedTech: 'Unassigned',
    techPhone: '',
    resolutionNotes: ''
  },
  {
    id: 'REX-2026-1004',
    date: '2026-09-16 11:20 AM',
    timestamp: Date.now() - 3600000 * 24,
    customerName: 'Gopinathan Nair',
    phone: '9447551234',
    altPhone: '',
    ksebConsumer: '72600',
    ksebBranch: 'Chalakkudy',
    product: 'Solar Service',
    brandModel: 'Waaree 6kW Rooftop Plant',
    installationType: 'Residential (Home)',
    priority: 'Normal',
    district: 'Thrissur',
    address: 'Souparnika, Chalakudy',
    landmark: 'Near Railway Station',
    issuePreset: 'Solar electricity generation output dropped significantly',
    issueDescription: 'Generating only 12 units compared to usual 28 units. Heavy dust layer on panels.',
    photoUrl: null,
    status: 'Resolved',
    assignedTech: 'Anoop Narayanan',
    techPhone: '+91 80758 73679',
    resolutionNotes: 'Panel cleaning performed and tightened DC string connector. Generation restored to 27 units.'
  }
];

// ── STATE ──────────────────────────────────────────────────────────
let tickets = [];
let activeFilterStatus = 'ALL';
let activeFilterPriority = 'ALL';

// ── AUTH FUNCTIONS ─────────────────────────────────────────────────
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  const customSettings = getEffectiveSettings();
  const customAccounts = (customSettings && customSettings.staffAccounts) ? customSettings.staffAccounts : {};
  const accounts = { ...STAFF_ACCOUNTS, ...customAccounts };

  // Robust case-insensitive username lookup
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
    // Store session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      username: matchedUsername,
      displayName: matchedAccount.displayName || matchedUsername,
      role: matchedAccount.role || 'Support Staff',
      loginTime: new Date().toISOString()
    }));
    errorEl.classList.remove('visible');
    bootAdminDashboard(matchedAccount.displayName || matchedUsername);
  } else {
    errorEl.classList.add('visible');
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem('REX_ADMIN_SESSION');
  sessionStorage.removeItem('REX_SETTINGS_SESSION');
  document.getElementById('admin-app').classList.remove('visible');
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  showToast('You have been signed out of Helpdesk.', 'info');
  lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkExistingSession() {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session) {
    try {
      const parsed = JSON.parse(session);
      bootAdminDashboard(parsed.displayName);
      return true;
    } catch (e) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }
  return false;
}

async function bootAdminDashboard(displayName) {
  // Sync custom technicians & product issues from Settings CMS
  const customSettings = getEffectiveSettings();
  if (customSettings) {
    if (Array.isArray(customSettings.technicians) && customSettings.technicians.length > 0) {
      TECHNICIANS = customSettings.technicians;
    }
    if (Array.isArray(customSettings.products)) {
      customSettings.products.forEach(p => {
        const key = p.category || p.name;
        if (key && Array.isArray(p.issues)) {
          PRODUCT_ISSUES[key] = p.issues;
        }
      });
    }
  }

  // Populate KSEB branches datalist if loaded
  if (typeof populateKsebDatalist === 'function') {
    populateKsebDatalist('kseb-branches-list');
  }

  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('admin-app').classList.add('visible');
  document.getElementById('staff-user-name').textContent = displayName;
  await loadTickets();
  updateStats();
  renderAdminTickets();
  renderProductBreakdown();
  renderTechnicianList();
  lucide.createIcons();
  showToast(`Welcome, ${displayName}! Helpdesk ready.`, 'success');
}

// ── DATA MANAGEMENT ────────────────────────────────────────────────
async function loadTickets() {
  try {
    let localData = [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      localData = JSON.parse(raw);
    } else {
      localData = JSON.parse(JSON.stringify(INITIAL_SEEDS));
    }

    if (window.RexApi && typeof window.RexApi.getComplaints === 'function') {
      const cloudData = await window.RexApi.getComplaints(localData);
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        tickets = cloudData;
        saveTicketsLocal();
        return;
      }
    }
    tickets = localData;
  } catch (e) {
    tickets = JSON.parse(JSON.stringify(INITIAL_SEEDS));
  }
}

function saveTicketsLocal() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets)); } catch (e) {}
}

async function saveTickets() {
  saveTicketsLocal();
  if (window.RexApi && typeof window.RexApi.saveComplaints === 'function') {
    await window.RexApi.saveComplaints(tickets);
  }
}

// ── KPI STATS ──────────────────────────────────────────────────────
function updateStats() {
  const total     = tickets.length;
  const open      = tickets.filter(t => t.status === 'Open').length;
  const assigned  = tickets.filter(t => t.status === 'Assigned').length;
  const progress  = tickets.filter(t => t.status === 'In Progress').length;
  const resolved  = tickets.filter(t => t.status === 'Resolved').length;
  const emergency = tickets.filter(t => t.priority === 'Emergency' && t.status !== 'Resolved').length;

  document.getElementById('kpi-total').textContent     = total;
  document.getElementById('kpi-open').textContent      = open;
  document.getElementById('kpi-assigned').textContent  = assigned;
  document.getElementById('kpi-progress').textContent  = progress;
  document.getElementById('kpi-resolved').textContent  = resolved;
  document.getElementById('kpi-emergency').textContent = emergency;
}

// ── FILTER HELPERS ─────────────────────────────────────────────────
function setFilterStatus(status) {
  activeFilterStatus = status;
  const sel = document.getElementById('filter-status');
  if (sel) sel.value = status;
  renderAdminTickets();
}

function setFilterPriority(priority) {
  activeFilterPriority = priority;
  const sel = document.getElementById('filter-priority');
  if (sel) sel.value = priority;
  renderAdminTickets();
}

function resetAdminFilters() {
  activeFilterStatus = 'ALL';
  activeFilterPriority = 'ALL';
  document.getElementById('filter-product').value = 'ALL';
  document.getElementById('filter-status').value  = 'ALL';
  document.getElementById('filter-priority').value = 'ALL';
  document.getElementById('admin-search-input').value = '';
  renderAdminTickets();
}

// ── RENDER TICKETS TABLE ───────────────────────────────────────────
function renderAdminTickets() {
  const query      = document.getElementById('admin-search-input')?.value.trim().toLowerCase() || '';
  const filterProd = document.getElementById('filter-product')?.value || 'ALL';
  const filterStat = document.getElementById('filter-status')?.value  || 'ALL';
  const filterPrio = document.getElementById('filter-priority')?.value || 'ALL';

  const filtered = tickets.filter(t => {
    const matchQuery = !query ||
      t.id.toLowerCase().includes(query) ||
      t.customerName.toLowerCase().includes(query) ||
      t.phone.includes(query) ||
      t.district.toLowerCase().includes(query) ||
      (t.ksebConsumer && t.ksebConsumer.includes(query)) ||
      (t.ksebBranch && t.ksebBranch.toLowerCase().includes(query)) ||
      (t.assignedTech && t.assignedTech.toLowerCase().includes(query));

    const matchProd = filterProd === 'ALL' || t.product === filterProd;
    const matchStat = filterStat === 'ALL' || t.status === filterStat;
    const matchPrio = filterPrio === 'ALL' || t.priority === filterPrio;

    return matchQuery && matchProd && matchStat && matchPrio;
  });

  const tbody      = document.getElementById('tickets-tbody');
  const emptyState = document.getElementById('empty-state');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  const techOptions = TECHNICIANS.map(tech => {
    const zoneName = tech.zone ? (tech.zone.split('&')[0] || tech.zone).trim() : 'Service Hub';
    return `<option value="${tech.name}">${tech.name} (${zoneName})</option>`;
  }).join('');

  tbody.innerHTML = filtered.map(ticket => {
    const selectedTech = TECHNICIANS.map(tech =>
      `<option value="${tech.name}" ${ticket.assignedTech === tech.name ? 'selected' : ''}>${tech.name}</option>`
    ).join('');

    return `
      <tr>
        <td><span class="ticket-cell-id" onclick="openTicketDetail('${ticket.id}')">${ticket.id}</span></td>
        <td style="font-size:0.8rem;color:var(--text-muted);">${ticket.date}</td>
        <td class="ticket-cust-cell">
          <strong>${ticket.customerName}</strong>
          <span>${ticket.phone}</span> &bull; <span>${ticket.district}</span>
          ${ticket.ksebConsumer ? `<div style="font-size:0.75rem;color:var(--secondary-gold);margin-top:2px;"><i data-lucide="zap" style="width:11px;height:11px;display:inline-block;vertical-align:middle;"></i> KSEB: <strong>${ticket.ksebConsumer}</strong> (${ticket.ksebBranch || 'Section'})</div>` : ''}
        </td>
        <td><span class="ticket-product-pill">${ticket.product}</span></td>
        <td style="max-width:220px;">
          <div style="font-weight:600;font-size:0.83rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${ticket.issuePreset}">${ticket.issuePreset}</div>
          <div style="font-size:0.76rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${ticket.issueDescription}">${ticket.issueDescription}</div>
        </td>
        <td><span class="badge-priority priority-${ticket.priority}">${ticket.priority}</span></td>
        <td>
          <select class="admin-select" style="padding:4px 8px;font-size:0.8rem;width:150px;" onchange="assignTechnician('${ticket.id}', this.value)">
            <option value="Unassigned" ${ticket.assignedTech === 'Unassigned' ? 'selected' : ''}>Assign...</option>
            ${selectedTech}
          </select>
        </td>
        <td>
          <select class="admin-select" style="padding:4px 8px;font-size:0.8rem;" onchange="updateTicketStatus('${ticket.id}', this.value)">
            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="Assigned" ${ticket.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-action-icon" title="View Details" onclick="openTicketDetail('${ticket.id}')">
              <i data-lucide="eye"></i>
            </button>
            <a href="tel:${ticket.phone}" class="btn-action-icon" title="Call Customer">
              <i data-lucide="phone"></i>
            </a>
            <a href="https://wa.me/91${ticket.phone}?text=Hello%20${encodeURIComponent(ticket.customerName)},%20regarding%20your%20Royal%20Eye%20Solar%20service%20ticket%20${ticket.id}" target="_blank" class="btn-action-icon" title="WhatsApp">
              <i data-lucide="message-circle"></i>
            </a>
            <button class="btn-action-icon" title="Print Job Card" onclick="printJobCard('${ticket.id}')">
              <i data-lucide="printer"></i>
            </button>
            <button class="btn-action-icon btn-action-delete" title="Delete Complaint" onclick="openDeleteTicketModal('${ticket.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

// ── ASSIGN & STATUS ────────────────────────────────────────────────
function assignTechnician(ticketId, techName) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  ticket.assignedTech = techName;
  const tech = TECHNICIANS.find(t => t.name === techName);
  ticket.techPhone = tech ? tech.phone : '';
  if (techName !== 'Unassigned' && ticket.status === 'Open') ticket.status = 'Assigned';
  saveTickets();
  updateStats();
  renderAdminTickets();
  showToast(`Assigned ${techName} to ${ticket.id}`, 'success');
}

function updateTicketStatus(ticketId, newStatus) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  ticket.status = newStatus;
  saveTickets();
  updateStats();
  renderAdminTickets();
  showToast(`Ticket ${ticketId} → ${newStatus}`, 'success');
}

// ── TICKET DETAIL MODAL ────────────────────────────────────────────
function openTicketDetail(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const modal = document.getElementById('ticket-detail-modal');
  const card  = document.getElementById('ticket-detail-card');

  const selectedTech = TECHNICIANS.map(tech =>
    `<option value="${tech.name}" ${ticket.assignedTech === tech.name ? 'selected' : ''}>${tech.name} (${tech.zone})</option>`
  ).join('');

  card.innerHTML = `
    <div class="modal-header">
      <div class="modal-title-wrap">
        <i data-lucide="file-text"></i>
        <h3>Service Ticket: <span style="color:var(--primary-red);">${ticket.id}</span></h3>
        <span class="badge-status status-${ticket.status.replace(/\s+/g,'')}">${ticket.status}</span>
      </div>
      <button class="modal-close" onclick="closeTicketDetail()">&times;</button>
    </div>

    <div class="detail-meta-grid">
      <div><div class="info-item-label">Customer Name</div><div class="info-item-val">${ticket.customerName}</div></div>
      <div><div class="info-item-label">Primary Mobile</div><div class="info-item-val">${ticket.phone}${ticket.altPhone ? ` / ${ticket.altPhone}` : ''}</div></div>
      <div><div class="info-item-label">KSEB Consumer #</div><div class="info-item-val" style="color:var(--secondary-gold);font-weight:700;">${ticket.ksebConsumer || 'Not Provided'}</div></div>
      <div><div class="info-item-label">KSEB Electrical Section</div><div class="info-item-val">${ticket.ksebBranch || 'General'}</div></div>
      <div><div class="info-item-label">Registered Date</div><div class="info-item-val">${ticket.date}</div></div>
      <div><div class="info-item-label">Equipment</div><div class="info-item-val">${ticket.product}</div></div>
      <div><div class="info-item-label">Brand / Model</div><div class="info-item-val">${ticket.brandModel || 'Standard'}</div></div>
      <div><div class="info-item-label">Priority</div><div class="info-item-val"><span class="badge-priority priority-${ticket.priority}">${ticket.priority}</span></div></div>
    </div>

    <div style="margin-bottom:16px;">
      <div class="info-item-label">Service Location</div>
      <div style="background:rgba(0,0,0,0.2);padding:10px 14px;border-radius:8px;font-size:0.92rem;">
        <i data-lucide="map-pin" style="width:14px;height:14px;display:inline;color:var(--primary-red);"></i>
        <strong>${ticket.address}</strong> &bull; ${ticket.landmark} &bull; District: <strong>${ticket.district}</strong>
      </div>
    </div>

    <div class="detail-section-title">Reported Fault & Symptoms</div>
    <div class="detail-issue-box">
      <strong style="color:var(--secondary-gold);">${ticket.issuePreset}</strong>
      <p style="margin-top:6px;">${ticket.issueDescription}</p>
      ${ticket.photoUrl ? `<img src="${ticket.photoUrl}" alt="Attachment" style="max-width:220px;border-radius:8px;margin-top:12px;border:1px solid var(--border-subtle);">` : ''}
    </div>

    <div class="quick-comm-actions">
      <a href="tel:${ticket.phone}" class="btn-primary" style="padding:8px 16px;">
        <i data-lucide="phone"></i> Call Customer
      </a>
      <a href="https://wa.me/91${ticket.phone}?text=Hello%20${encodeURIComponent(ticket.customerName)},%20this%20is%20Royal%20Eye%20Solar%20Power%20Service%20Team%20regarding%20ticket%20${ticket.id}." target="_blank" class="btn-whatsapp" style="padding:8px 16px;">
        <i data-lucide="message-circle"></i> WhatsApp
      </a>
      <button class="btn-secondary" onclick="printJobCard('${ticket.id}')">
        <i data-lucide="printer"></i> Print Job Card
      </button>
    </div>

    <div class="tech-assign-controls">
      <h4 style="margin-bottom:12px;font-size:0.95rem;color:#fff;">Technician Dispatch &amp; Service Update</h4>
      <div class="form-grid-2">
        <div class="form-group" style="margin-bottom:8px;">
          <label>Assign Engineer</label>
          <select id="detail-tech-select" class="form-control">
            <option value="Unassigned">Unassigned</option>
            ${selectedTech}
          </select>
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label>Service Status</label>
          <select id="detail-status-select" class="form-control">
            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="Assigned" ${ticket.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </div>
      </div>
      <div class="form-group" style="margin-bottom:8px;">
        <label>Technician Remarks / Resolution Notes</label>
        <textarea id="detail-remarks" class="form-control" rows="2" placeholder="Parts replaced, fault found, resolution steps...">${ticket.resolutionNotes || ''}</textarea>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <button type="button" class="btn-secondary" style="color:#ef4444;border-color:rgba(239,68,68,0.35);background:rgba(239,68,68,0.08);" onclick="openDeleteTicketModal('${ticket.id}', true)">
          <i data-lucide="trash-2"></i> Delete Ticket
        </button>
        <button class="btn-primary" onclick="saveTicketDetailChanges('${ticket.id}')">
          <i data-lucide="save"></i> Save Updates
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeTicketDetail() {
  document.getElementById('ticket-detail-modal').classList.add('hidden');
}

function saveTicketDetailChanges(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const techName = document.getElementById('detail-tech-select').value;
  const status   = document.getElementById('detail-status-select').value;
  const remarks  = document.getElementById('detail-remarks').value.trim();

  ticket.assignedTech = techName;
  const techObj = TECHNICIANS.find(t => t.name === techName);
  ticket.techPhone = techObj ? techObj.phone : '';
  ticket.status = status;
  ticket.resolutionNotes = remarks;

  saveTickets();
  updateStats();
  renderAdminTickets();
  renderTechnicianList();
  closeTicketDetail();
  showToast(`Ticket ${ticketId} updated successfully.`, 'success');
}

// ── DELETE CUSTOMER SERVICE COMPLAINTS ─────────────────────────────
let pendingDeleteContext = null;

function openDeleteTicketModal(ticketId, closeDetailAfter = false) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  pendingDeleteContext = { type: 'single', ticketId, closeDetailAfter };
  document.getElementById('delete-modal-title').textContent = `Delete ${ticketId}?`;
  document.getElementById('delete-modal-desc').textContent = `Are you sure you want to permanently delete complaint ${ticketId} registered by "${ticket.customerName}"? This customer service record will be removed permanently.`;
  document.getElementById('delete-confirm-modal').classList.remove('hidden');
  lucide.createIcons();
}

function openDeleteAllModal(mode = 'resolved') {
  if (mode === 'resolved') {
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
    if (resolvedCount === 0) {
      showToast('No resolved complaints found to clear.', 'error');
      return;
    }
    pendingDeleteContext = { type: 'resolved' };
    document.getElementById('delete-modal-title').textContent = `Delete ${resolvedCount} Resolved Complaints?`;
    document.getElementById('delete-modal-desc').textContent = `Permanently delete all ${resolvedCount} resolved and closed customer service tickets from the database.`;
  } else {
    if (tickets.length === 0) {
      showToast('No complaints found to delete.', 'error');
      return;
    }
    pendingDeleteContext = { type: 'all' };
    document.getElementById('delete-modal-title').textContent = '⚠ Delete ALL Complaints Data?';
    document.getElementById('delete-modal-desc').textContent = `This will permanently delete all ${tickets.length} complaints from the customer service database.`;
  }
  document.getElementById('delete-confirm-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeDeleteModal() {
  document.getElementById('delete-confirm-modal').classList.add('hidden');
  pendingDeleteContext = null;
}

function executeDeleteAction() {
  if (!pendingDeleteContext) return;

  if (pendingDeleteContext.type === 'single') {
    const { ticketId, closeDetailAfter } = pendingDeleteContext;
    tickets = tickets.filter(t => t.id !== ticketId);
    saveTickets();
    updateStats();
    renderAdminTickets();
    renderProductBreakdown();
    renderTechnicianList();
    if (closeDetailAfter) {
      closeTicketDetail();
    }
    closeDeleteModal();
    showToast(`Complaint ${ticketId} permanently deleted.`, 'success');
  } else if (pendingDeleteContext.type === 'resolved') {
    const prevCount = tickets.length;
    tickets = tickets.filter(t => t.status !== 'Resolved');
    const deletedCount = prevCount - tickets.length;
    saveTickets();
    updateStats();
    renderAdminTickets();
    renderProductBreakdown();
    renderTechnicianList();
    closeDeleteModal();
    showToast(`Deleted ${deletedCount} resolved complaints.`, 'success');
  } else if (pendingDeleteContext.type === 'all') {
    tickets = [];
    saveTickets();
    updateStats();
    renderAdminTickets();
    renderProductBreakdown();
    renderTechnicianList();
    closeDeleteModal();
    showToast('All customer complaints have been deleted.', 'success');
  }
}

// ── MANUAL TOLL-FREE CALL ENTRY ────────────────────────────────────
function openManualTicketModal() {
  document.getElementById('manual-ticket-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeManualTicketModal() {
  document.getElementById('manual-ticket-modal').classList.add('hidden');
}

function handleManualTicketSubmit(event) {
  event.preventDefault();

  const name     = document.getElementById('manual-name').value.trim();
  const phone    = document.getElementById('manual-phone').value.trim();
  const helpline = document.getElementById('manual-helpline').value;
  const product      = document.getElementById('manual-product').value;
  const priority     = document.getElementById('manual-priority').value;
  const location     = document.getElementById('manual-location').value.trim();
  const ksebConsumer = document.getElementById('manual-kseb-consumer')?.value.trim() || '';
  const ksebBranch   = document.getElementById('manual-kseb-branch')?.value.trim() || '';
  const issue        = document.getElementById('manual-issue').value.trim();

  const ticketId = generateTicketId();
  const newTicket = {
    id: ticketId,
    date: formatDateTime(),
    timestamp: Date.now(),
    customerName: name,
    phone,
    altPhone: '',
    ksebConsumer: ksebConsumer.replace(/[^0-9]/g, ''),
    ksebBranch,
    product,
    brandModel: `Logged via Toll-Free (${helpline})`,
    installationType: 'Not specified',
    priority,
    district: location,
    address: location,
    landmark: `Call Intake via ${helpline}`,
    issuePreset: 'Toll-Free Phone Intake',
    issueDescription: issue,
    photoUrl: null,
    status: 'Open',
    assignedTech: 'Unassigned',
    techPhone: '',
    resolutionNotes: ''
  };

  tickets.unshift(newTicket);
  saveTickets();
  updateStats();
  renderAdminTickets();
  renderProductBreakdown();
  closeManualTicketModal();

  document.getElementById('manual-name').value = '';
  document.getElementById('manual-phone').value = '';
  document.getElementById('manual-location').value = '';
  document.getElementById('manual-issue').value = '';

  showToast(`Toll-Free complaint logged: ${ticketId}`, 'success');
}

// ── PRINT JOB CARD ─────────────────────────────────────────────────
function printJobCard(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const cs = getEffectiveSettings();
  const co = (cs && cs.company) ? cs.company : {
    name: 'Royal Eye Solar Power',
    rex: 'REX',
    address: 'Edamuttam, Thrissur, Kerala - 680568',
    helplines: ['+91 80758 73679', '+91 90745 72600']
  };

  const container = document.getElementById('printable-job-card');
  container.innerHTML = `
    <div class="job-card-header">
      <div>
        <div class="job-card-title">${(co.name || 'Royal Eye Solar Power').toUpperCase()} (${co.rex || 'REX'})</div>
        <div style="font-size:0.85rem;color:#555;">Service Hub: ${co.address || 'Edamuttam, Thrissur, Kerala - 680568'} | Ph: ${(co.helplines && co.helplines[0]) || '+91 80758 73679'}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1.2rem;font-weight:bold;color:#e51e2b;">FIELD SERVICE JOB CARD</div>
        <div>Ticket: <strong>${ticket.id}</strong></div>
      </div>
    </div>
    <div class="job-card-meta">
      <div class="job-card-box">
        <strong>CUSTOMER DETAILS</strong><br>
        Name: ${ticket.customerName}<br>
        Phone: ${ticket.phone}${ticket.altPhone ? ` / ${ticket.altPhone}` : ''}<br>
        Address: ${ticket.address}, ${ticket.landmark}<br>
        District: ${ticket.district}
        ${ticket.ksebConsumer ? `<br><strong>KSEB Consumer #:</strong> ${ticket.ksebConsumer} | <strong>Section:</strong> ${ticket.ksebBranch || 'General'}` : ''}
      </div>
      <div class="job-card-box">
        <strong>EQUIPMENT &amp; PRIORITY</strong><br>
        Product: ${ticket.product}<br>
        Model: ${ticket.brandModel || 'Standard'}<br>
        Priority: ${ticket.priority}<br>
        Date: ${ticket.date}
      </div>
    </div>
    <div class="job-card-box" style="margin-bottom:18px;">
      <strong>REPORTED FAULT:</strong><br>
      ${ticket.issuePreset}<br>
      <em>${ticket.issueDescription}</em>
    </div>
    <div class="job-card-box" style="margin-bottom:18px;">
      <strong>ASSIGNED ENGINEER:</strong> ${ticket.assignedTech || 'Unassigned'} &bull; ${ticket.techPhone || 'Central Dispatch'}
    </div>
    <div class="job-card-box" style="min-height:120px;margin-bottom:30px;">
      <strong>FIELD RESOLUTION / PARTS REPLACED (to be filled on-site):</strong>
    </div>
    <div style="display:flex;justify-content:space-between;padding-top:30px;border-top:1px solid #ccc;">
      <div>Customer Signature: _______________________</div>
      <div>Service Engineer Signature: _______________________</div>
    </div>
  `;
  container.classList.remove('hidden');
  window.print();
  container.classList.add('hidden');
}

// ── EXPORT CSV ────────────────────────────────────────────────────
function exportTicketsCSV() {
  if (tickets.length === 0) { showToast('No tickets to export.', 'error'); return; }

  const headers = ['Ticket ID','Date','Customer Name','Phone','District','Address','Product','Priority','Status','Assigned Engineer','Issue'];
  const rows = tickets.map(t => [
    `"${t.id}"`, `"${t.date}"`, `"${t.customerName}"`, `"${t.phone}"`,
    `"${t.district}"`, `"${t.address}"`, `"${t.product}"`, `"${t.priority}"`,
    `"${t.status}"`, `"${t.assignedTech}"`,
    `"${(t.issueDescription || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', `RoyalEye_Complaints_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Complaints exported to CSV.', 'success');
}

// ── ANALYTICS ─────────────────────────────────────────────────────
function renderProductBreakdown() {
  const container = document.getElementById('product-breakdown-container');
  if (!container) return;
  const counts = {};
  const total  = tickets.length || 1;
  Object.keys(PRODUCT_ISSUES).forEach(p => counts[p] = 0);
  tickets.forEach(t => { if (counts[t.product] !== undefined) counts[t.product]++; else counts[t.product] = 1; });

  container.innerHTML = Object.entries(counts).map(([product, count]) => {
    const pct = Math.round((count / total) * 100);
    return `
      <div class="breakdown-row">
        <div class="breakdown-header"><span>${product}</span><span>${count} (${pct}%)</span></div>
        <div class="breakdown-bar-bg"><div class="breakdown-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');
}

function renderTechnicianList() {
  const container = document.getElementById('technician-list-container');
  if (!container) return;
  container.innerHTML = TECHNICIANS.map(tech => {
    const active = tickets.filter(t => t.assignedTech === tech.name && (t.status === 'Assigned' || t.status === 'In Progress')).length;
    return `
      <div class="tech-row">
        <div class="tech-info-left">
          <div class="tech-status-dot ${active > 1 ? 'busy' : ''}"></div>
          <div>
            <div style="font-size:0.88rem;font-weight:700;color:#fff;">${tech.name}</div>
            <div style="font-size:0.76rem;color:var(--text-muted);">${tech.zone} &bull; ${tech.phone}</div>
          </div>
        </div>
        <span style="font-size:0.78rem;font-weight:700;background:rgba(255,255,255,0.06);padding:3px 8px;border-radius:4px;">
          ${active} Active
        </span>
      </div>`;
  }).join('');
}

function refreshAdminDashboard() {
  loadTickets();
  updateStats();
  renderAdminTickets();
  renderProductBreakdown();
  renderTechnicianList();
  showToast('Dashboard refreshed.', 'success');
}

// ── UTILITIES ─────────────────────────────────────────────────────
function generateTicketId() {
  return `REX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

function formatDateTime(d = new Date()) {
  return d.toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
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

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  // Check if staff already has an active session
  checkExistingSession();
});
