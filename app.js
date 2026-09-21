/**
 * Royal Eye Solar Power (REX) — Customer Complaint Portal & Ticket Tracker
 * Handles customer complaint lodging and status tracking only.
 * Staff Helpdesk is at admin.html (password protected, staff only).
 */


const STORAGE_KEY  = 'REX_SOLAR_COMPLAINTS_v1';
const SETTINGS_KEY = 'REX_SOLAR_SETTINGS_v1';

// Product Categories and Pre-configured Common Faults
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

// Certified Field Service Technicians (Thrissur & Surrounding Hubs)
const TECHNICIANS = [
  { id: 'T1', name: 'Suresh Kumar', zone: 'Central Thrissur & Ollur', phone: '+91 94471 23456', status: 'Available' },
  { id: 'T2', name: 'Rajesh Varma', zone: 'Edamuttam & Kodungallur Hub', phone: '+91 98466 53834', status: 'Busy' },
  { id: 'T3', name: 'Anoop Narayanan', zone: 'Chalakudy & Angamaly', phone: '+91 80758 73679', status: 'Available' },
  { id: 'T4', name: 'Midhun Chandran', zone: 'Guruvayur & Kunnamkulam', phone: '+91 70340 22603', status: 'Available' },
  { id: 'T5', name: 'Vishnu K.', zone: 'Palakkad & Shornur border', phone: '+91 95678 12390', status: 'Available' }
];

// Initial Seed Data for Demo & Immediate Evaluation
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
    issueDescription: 'Whenever grid power cuts off, the inverter trips the clinic main breaker immediately.',
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

class RexServiceApp {
  constructor() {
    this.tickets = [];
    this.uploadedPhotoData = null;
    this.activeFilterStatus = 'ALL';
    this.activeFilterPriority = 'ALL';
    this.lastSubmittedTicket = null;
    this.settings = null;
  }

  async applyCustomSettings() {
    try {
      let stored = localStorage.getItem(SETTINGS_KEY);
      let parsedSettings = stored ? JSON.parse(stored) : null;

      if (window.RexApi && typeof window.RexApi.getSettings === 'function') {
        const cloudSettings = await window.RexApi.getSettings(parsedSettings);
        if (cloudSettings && Object.keys(cloudSettings).length > 0) {
          parsedSettings = cloudSettings;
          try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(cloudSettings));
          } catch (err) {}
        }
      }

      if (!parsedSettings) return;
      this.settings = parsedSettings;
      const s = this.settings;

      // Update Company Info
      if (s.company) {
        const c = s.company;

        // Top bar location
        const topLoc = document.getElementById('top-location-text');
        if (topLoc && c.address) {
          topLoc.innerHTML = `<i data-lucide="map-pin"></i> ${c.address}`;
        }

        // Central service center hub box
        const hubAddr = document.getElementById('hero-hub-address');
        if (hubAddr && c.address) {
          hubAddr.innerHTML = `<strong>Central Service Center:</strong> ${c.address}`;
        }

        // Footer brand text
        const footerBrand = document.getElementById('footer-brand-text');
        if (footerBrand && c.name && c.address) {
          footerBrand.innerHTML = `<strong>${c.name} (${c.rex || 'REX'})</strong> &bull; ${c.address}`;
        }

        // Brand logo
        const rexBadge = document.getElementById('brand-rex-badge');
        if (rexBadge && c.rex) {
          rexBadge.textContent = c.rex;
        }
        const brandSub = document.getElementById('brand-sub-wrap');
        if (brandSub && c.tagline) {
          brandSub.textContent = c.tagline.toUpperCase();
        }

        // Helplines & WhatsApp in top bar & hero card & footer
        if (Array.isArray(c.helplines)) {
          // Auto-clean old retired numbers if cached in localStorage
          c.helplines = c.helplines.filter(num => !num.includes('98466') && !num.includes('70340'));
          if (!c.helplines.some(n => n.includes('80758'))) c.helplines.unshift('+91 80758 73679');
          if (!c.helplines.some(n => n.includes('90745'))) c.helplines.push('+91 90745 72600');
          if (c.whatsapp === '919846653834') c.whatsapp = '918075873679';

          const topNums = document.getElementById('top-helpline-numbers');
          if (topNums) {
            let numsHtml = c.helplines.slice(0, 2).map((num, i) =>
              `<a href="tel:${num.replace(/\s+/g, '')}" class="phone-link"><i data-lucide="${i === 0 ? 'phone-call' : 'phone'}"></i> ${num}</a>`
            ).join(' ');
            if (c.whatsapp) {
              const cleanWa = c.whatsapp.replace(/[^0-9]/g, '');
              numsHtml += ` <a href="https://wa.me/${cleanWa}?text=Hello%20${encodeURIComponent(c.name || 'Royal Eye Solar Power')},%20I%20need%20service%20support" target="_blank" class="whatsapp-btn-mini"><i data-lucide="message-circle"></i> WhatsApp</a>`;
            }
            topNums.innerHTML = numsHtml;
          }

          const footerHelp = document.getElementById('footer-helpline-text');
          if (footerHelp) {
            footerHelp.innerHTML = `Toll-Free Support Lines: ` + c.helplines.map(n => `<strong>${n}</strong>`).join(' | ');
          }

          const heroCalls = document.getElementById('hero-call-list');
          if (heroCalls) {
            const icons = ['phone-outgoing', 'headset', 'zap', 'shield'];
            const titles = ['General Enquiries & Service Desk', 'Customer Support & Technical Helpline', 'Customer Care Desk', 'Field Dispatch Desk'];
            heroCalls.innerHTML = c.helplines.slice(0, 2).map((num, idx) => `
              <a href="tel:${num.replace(/\s+/g, '')}" class="call-card">
                <div class="call-card-icon"><i data-lucide="${icons[idx % icons.length]}"></i></div>
                <div class="call-card-info">
                  <span class="call-title">${titles[idx] || 'Enquiry & Support'}</span>
                  <span class="call-num">${num}</span>
                </div>
                <span class="call-btn-chip">Call Now</span>
              </a>
            `).join('');
          }
        }
      }

      // Hero content
      if (s.hero) {
        const h = s.hero;
        const heroBadge = document.getElementById('hero-badge-text');
        if (heroBadge && h.badge) {
          heroBadge.innerHTML = `<i data-lucide="shield-check"></i> ${h.badge}`;
        }

        const heroHead = document.getElementById('hero-heading-text');
        if (heroHead && h.heading) {
          heroHead.textContent = h.heading;
        }

        const heroDesc = document.getElementById('hero-desc-text');
        if (heroDesc && h.desc) {
          heroDesc.textContent = h.desc;
        }

        const heroMetrics = document.getElementById('hero-metrics-list');
        if (heroMetrics && Array.isArray(h.metrics) && h.metrics.length > 0) {
          heroMetrics.innerHTML = h.metrics.map(m => `
            <div class="metric-item">
              <div class="metric-val">${m.value}</div>
              <div class="metric-lbl">${m.label}</div>
            </div>
          `).join('');
        }
      }

      // Partner Brands
      if (Array.isArray(s.partners) && s.partners.length > 0) {
        const pContainer = document.getElementById('partner-tags-container');
        if (pContainer) {
          pContainer.innerHTML = s.partners.map(p => `<span class="partner-pill">${p}</span>`).join('');
        }
      }

      // Product Categories & Issues
      if (Array.isArray(s.products) && s.products.length > 0) {
        s.products.forEach(p => {
          const key = p.category || p.name;
          if (key && Array.isArray(p.issues)) {
            PRODUCT_ISSUES[key] = p.issues;
          }
        });
      }

      this.refreshIcons();
    } catch (e) {
      console.warn('Error applying custom settings:', e);
    }
  }

  async init() {
    await this.applyCustomSettings();
    await this.loadTickets();
    this.setupEventListeners();
    this.onProductSelected('Inverters');
    this.refreshIcons();

    // Populate KSEB branches datalist for legacy data compatibility
    if (typeof populateKsebDatalist === 'function') {
      populateKsebDatalist('kseb-branches-list');
    }

    // Check URL params for quick tracking
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('track')) {
      const trackId = urlParams.get('track');
      this.switchView('tracker');
      const qInput = document.getElementById('tracker-query');
      if (qInput) qInput.value = trackId;
      this.searchTicket(trackId);
    }
  }

  refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  async loadTickets() {
    try {
      let localData = [];
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localData = JSON.parse(stored);
      } else {
        localData = [...INITIAL_SEEDS];
      }

      if (window.RexApi && typeof window.RexApi.getComplaints === 'function') {
        const cloudData = await window.RexApi.getComplaints(localData);
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          this.tickets = cloudData;
          this.saveTicketsLocal();
          return;
        }
      }
      this.tickets = localData;
    } catch (e) {
      console.error('Error loading tickets:', e);
      this.tickets = [...INITIAL_SEEDS];
    }
  }

  saveTicketsLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tickets));
    } catch (e) {
      console.error('Error saving tickets locally:', e);
    }
  }

  async saveTickets() {
    this.saveTicketsLocal();
    if (window.RexApi && typeof window.RexApi.saveComplaints === 'function') {
      await window.RexApi.saveComplaints(this.tickets);
    }
  }

  switchView(viewName) {
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    if (viewName === 'customer') {
      document.getElementById('view-customer').classList.add('active-view');
      document.getElementById('tab-customer').classList.add('active');
    } else if (viewName === 'tracker') {
      document.getElementById('view-tracker').classList.add('active-view');
      document.getElementById('tab-tracker').classList.add('active');
      // Focus search input
      setTimeout(() => document.getElementById('tracker-query')?.focus(), 50);
    }
    // Admin view is a separate page: admin.html

    this.refreshIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setupEventListeners() {
    // Re-render icons after dynamic changes if needed
  }

  // Populate dynamic issue presets when user clicks a product card
  onProductSelected(productName) {
    const selectEl = document.getElementById('issue-preset');
    if (!selectEl) return;

    selectEl.innerHTML = '<option value="">Select common fault symptom...</option>';
    const issues = PRODUCT_ISSUES[productName] || [];
    issues.forEach(issue => {
      const opt = document.createElement('option');
      opt.value = issue;
      opt.textContent = issue;
      selectEl.appendChild(opt);
    });

    // Auto update description if empty
    const descEl = document.getElementById('issue-description');
    if (descEl && !descEl.value) {
      descEl.placeholder = `Describe the problem you are experiencing with your ${productName}...`;
    }
  }

  handleIssuePresetChange(val) {
    const descEl = document.getElementById('issue-description');
    if (!descEl) return;
    if (val && (!descEl.value || descEl.value.startsWith('[Fault:'))) {
      descEl.value = `[Fault: ${val}] - `;
      descEl.focus();
    }
  }

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Photo size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedPhotoData = e.target.result;
      const previewImg = document.getElementById('photo-preview-img');
      const previewWrap = document.getElementById('photo-preview-wrap');
      const labelText = document.getElementById('upload-label-text');

      if (previewImg && previewWrap) {
        previewImg.src = this.uploadedPhotoData;
        previewWrap.classList.remove('hidden');
        labelText.textContent = `Attached: ${file.name}`;
      }
    };
    reader.readAsDataURL(file);
  }

  removeUploadedPhoto() {
    this.uploadedPhotoData = null;
    document.getElementById('photo-upload-input').value = '';
    document.getElementById('photo-preview-wrap').classList.add('hidden');
    document.getElementById('upload-label-text').textContent = 'Click to capture or upload photo of inverter screen / battery / leakage';
  }

  // Generate Unique Royal Eye Ticket ID: REX-2026-XXXX
  generateTicketId() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `REX-2026-${randomNum}`;
  }

  // Format Date & Time
  formatDateTime(dateObj = new Date()) {
    return dateObj.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Customer Form Submission
  handleComplaintSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('complaint-form');
    const formData = new FormData(form);

    const product = formData.get('product_type');
    const issuePreset = document.getElementById('issue-preset').value;
    const priority = document.getElementById('priority-level').value;
    const brandModel = document.getElementById('brand-model').value.trim();
    const installationType = document.getElementById('installation-type').value;
    const issueDescription = document.getElementById('issue-description').value.trim();

    const customerName = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const altPhone = document.getElementById('cust-alt-phone').value.trim();
    const district = document.getElementById('cust-district').value;
    const address = document.getElementById('cust-address').value.trim();
    const landmark = document.getElementById('cust-landmark').value.trim();

    if (!customerName || !phone) {
      this.showToast('Please enter your name and contact mobile number.', 'error');
      return;
    }

    // Photo and detailed issue description are completely optional
    const finalPreset = issuePreset || 'General Service Request';
    const finalDescription = issueDescription || (issuePreset ? `Fault reported: ${issuePreset}` : `Service & inspection requested for ${product}.`);

    const ksebConsumer = document.getElementById('cust-kseb-consumer')?.value.trim() || '';
    const ksebBranch = document.getElementById('cust-kseb-branch')?.value.trim() || '';

    const ticketId = this.generateTicketId();
    const newTicket = {
      id: ticketId,
      date: this.formatDateTime(),
      timestamp: Date.now(),
      customerName,
      phone,
      altPhone,
      ksebConsumer: ksebConsumer.replace(/[^0-9]/g, ''),
      ksebBranch,
      product,
      brandModel: brandModel || `${product} Standard System`,
      installationType,
      priority,
      district,
      address,
      landmark: landmark || 'Site Location',
      issuePreset: finalPreset,
      issueDescription: finalDescription,
      photoUrl: this.uploadedPhotoData || null,
      status: 'Open',
      assignedTech: 'Unassigned',
      techPhone: '',
      resolutionNotes: ''
    };

    // Add to top of tickets
    this.tickets.unshift(newTicket);
    this.saveTickets();

    // Reset Form
    form.reset();
    this.removeUploadedPhoto();
    this.onProductSelected('Inverters');

    this.lastSubmittedTicket = newTicket;
    this.showSuccessModal(newTicket);
    this.showToast(`Complaint registered successfully! Ticket ID: ${ticketId}`, 'success');
  }

  showSuccessModal(ticket) {
    document.getElementById('receipt-ticket-id').textContent = ticket.id;
    document.getElementById('receipt-cust-name').textContent = ticket.customerName;
    document.getElementById('receipt-product').textContent = ticket.product;
    
    const prioEl = document.getElementById('receipt-priority');
    prioEl.textContent = ticket.priority;
    prioEl.className = `badge-priority priority-${ticket.priority}`;

    document.getElementById('receipt-location').textContent = `${ticket.district} (${ticket.landmark})`;

    // WhatsApp Pre-filled link
    const waText = encodeURIComponent(
      `Hello Royal Eye Solar Power Support,\nI have registered a complaint.\n*Ticket ID:* ${ticket.id}\n*Customer:* ${ticket.customerName}\n*Product:* ${ticket.product}\n*Issue:* ${ticket.issueDescription}\n*Location:* ${ticket.address}, ${ticket.district}\nPlease dispatch a service engineer.`
    );
    const waNum = (this.settings && this.settings.company && this.settings.company.whatsapp) ? this.settings.company.whatsapp.replace(/[^0-9]/g, '') : '918075873679';
    document.getElementById('btn-whatsapp-ticket').href = `https://wa.me/${waNum}?text=${waText}`;

    document.getElementById('success-modal').classList.remove('hidden');
    this.refreshIcons();
  }

  closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
  }

  viewTicketInTracker() {
    this.closeSuccessModal();
    if (this.lastSubmittedTicket) {
      this.switchView('tracker');
      const qInput = document.getElementById('tracker-query');
      if (qInput) qInput.value = this.lastSubmittedTicket.id;
      this.renderTrackerResult(this.lastSubmittedTicket);
    }
  }

  // ============================================================
  // TRACKER LOGIC
  // ============================================================
  setTrackerMode(mode) {
    const btnKseb = document.getElementById('btn-mode-kseb');
    const btnTicket = document.getElementById('btn-mode-ticket');
    const formKseb = document.getElementById('form-kseb-tracker');
    const formTicket = document.getElementById('form-standard-tracker');

    if (mode === 'kseb') {
      if (btnKseb) btnKseb.classList.add('active');
      if (btnTicket) btnTicket.classList.remove('active');
      if (formKseb) formKseb.style.display = 'block';
      if (formTicket) formTicket.style.display = 'none';
      document.getElementById('tracker-kseb-consumer')?.focus();
    } else {
      if (btnTicket) btnTicket.classList.add('active');
      if (btnKseb) btnKseb.classList.remove('active');
      if (formTicket) formTicket.style.display = 'flex';
      if (formKseb) formKseb.style.display = 'none';
      document.getElementById('tracker-query')?.focus();
    }
    this.refreshIcons();
  }

  handleKsebTrackerSearch(event) {
    if (event && event.preventDefault) event.preventDefault();
    const rawConsumer = document.getElementById('tracker-kseb-consumer')?.value.trim() || '';
    const branchQuery = document.getElementById('tracker-kseb-branch')?.value.trim().toLowerCase() || '';

    if (!rawConsumer) {
      this.showToast('Please enter the last 5 digits of your KSEB Consumer Number.', 'error');
      return;
    }
    if (!branchQuery) {
      this.showToast('Please choose or enter your KSEB Branch / Section.', 'error');
      return;
    }

    // Customer can enter 5 digits or full number - extract clean digits
    const digitsOnly = rawConsumer.replace(/[^0-9]/g, '');
    const searchSuffix = digitsOnly.length >= 5 ? digitsOnly.slice(-5) : digitsOnly;

    // Search tickets
    const found = this.tickets.find(t => {
      const ticketConsumerDigits = (t.ksebConsumer || '').replace(/[^0-9]/g, '');
      const consumerMatch = ticketConsumerDigits.endsWith(searchSuffix) ||
                            ticketConsumerDigits.includes(digitsOnly) ||
                            (t.phone && t.phone.endsWith(searchSuffix));

      const ticketBranch = (t.ksebBranch || '').toLowerCase();
      const branchMatch = !ticketBranch ||
                          ticketBranch === branchQuery ||
                          ticketBranch.includes(branchQuery) ||
                          branchQuery.includes(ticketBranch) ||
                          (t.landmark && t.landmark.toLowerCase().includes(branchQuery)) ||
                          (t.address && t.address.toLowerCase().includes(branchQuery));

      return consumerMatch && branchMatch;
    });

    const resultArea = document.getElementById('tracker-result-area');
    if (!found) {
      resultArea.innerHTML = `
        <div class="glass-panel" style="padding: 32px; text-align: center;">
          <i data-lucide="zap-off" style="width: 48px; height: 48px; color: var(--secondary-gold); margin-bottom: 12px;"></i>
          <h3>No Solar Service Record Found</h3>
          <p style="color: var(--text-muted); margin-bottom: 16px; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.5;">
            No service ticket matched KSEB Consumer ending with <strong>${rawConsumer}</strong> in electrical section <strong>${branchQuery.toUpperCase()}</strong>.
          </p>
          <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            Need help or want to speak directly to our dispatch desk? Call our Toll-Free Helplines:<br>
            <a href="tel:+918075873679" style="color: var(--secondary-gold); font-weight: bold;">+91 80758 73679</a> &bull; 
            <a href="tel:+919074572600" style="color: var(--secondary-gold); font-weight: bold;">+91 90745 72600</a>
          </div>
        </div>
      `;
      this.refreshIcons();
      return;
    }

    this.renderTrackerResult(found);
  }

  handleTrackerSearch(event) {
    if (event && event.preventDefault) event.preventDefault();
    const query = document.getElementById('tracker-query')?.value.trim() || '';
    if (!query) return;
    this.searchTicket(query);
  }

  searchTicket(query) {
    const q = query.toLowerCase();
    const cleanDigits = query.replace(/[^0-9]/g, '');

    const found = this.tickets.find(t => 
      t.id.toLowerCase() === q || 
      t.phone.includes(cleanDigits || q) ||
      (t.altPhone && t.altPhone.includes(cleanDigits || q)) ||
      (t.ksebConsumer && t.ksebConsumer.includes(cleanDigits || q)) ||
      (t.ksebBranch && t.ksebBranch.toLowerCase().includes(q))
    );

    const resultArea = document.getElementById('tracker-result-area');
    if (!found) {
      resultArea.innerHTML = `
        <div class="glass-panel" style="padding: 30px; text-align: center;">
          <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--primary-red); margin-bottom: 12px;"></i>
          <h3>No Complaint Found</h3>
          <p style="color: var(--text-muted); margin-bottom: 16px;">
            No service complaint matches ticket reference or mobile number: <strong>${query}</strong>.
          </p>
          <div style="font-size: 0.88rem; color: var(--text-secondary);">
            Need immediate assistance? Call our central service desk: <br>
            <a href="tel:+918075873679" style="color: var(--secondary-gold); font-weight: bold;">+91 80758 73679</a> &bull; <a href="tel:+919074572600" style="color: var(--secondary-gold); font-weight: bold;">+91 90745 72600</a>
          </div>
        </div>
      `;
      this.refreshIcons();
      return;
    }

    this.renderTrackerResult(found);
  }

  renderTrackerResult(ticket) {
    const resultArea = document.getElementById('tracker-result-area');

    // Stepper logic: Registered -> Assigned -> In Progress -> Resolved
    const stages = ['Registered', 'Assigned', 'In Progress', 'Resolved'];
    let currentStageIndex = 0;
    if (ticket.status === 'Open') currentStageIndex = 0;
    else if (ticket.status === 'Assigned') currentStageIndex = 1;
    else if (ticket.status === 'In Progress') currentStageIndex = 2;
    else if (ticket.status === 'Resolved') currentStageIndex = 3;

    const stepperHtml = stages.map((stg, idx) => {
      let stateClass = '';
      if (idx < currentStageIndex) stateClass = 'completed';
      else if (idx === currentStageIndex) stateClass = 'active';

      return `
        <div class="step-item ${stateClass}">
          <div class="step-node">
            ${idx < currentStageIndex ? '<i data-lucide="check" style="width: 18px; height: 18px;"></i>' : idx + 1}
          </div>
          <div class="step-title">${stg}</div>
        </div>
      `;
    }).join('');

    resultArea.innerHTML = `
      <div class="tracking-card glass-panel">
        <div class="tracking-header">
          <div>
            <div class="tracking-id">${ticket.id}</div>
            <div class="tracking-date">Registered on: ${ticket.date} &bull; Service Hub: Edamuttam, Thrissur</div>
          </div>
          <div>
            <span class="badge-status status-${ticket.status.replace(/\s+/g, '')}">${ticket.status}</span>
            <span class="badge-priority priority-${ticket.priority}" style="margin-left: 6px;">${ticket.priority}</span>
          </div>
        </div>

        <div class="stepper-timeline">
          ${stepperHtml}
        </div>

        <div class="tracking-info-grid">
          <div>
            <div class="info-item-label">Customer Name</div>
            <div class="info-item-val">${ticket.customerName}</div>
          </div>
          <div>
            <div class="info-item-label">Equipment / Service</div>
            <div class="info-item-val">${ticket.product}</div>
          </div>
          <div>
            <div class="info-item-label">Model / Spec</div>
            <div class="info-item-val">${ticket.brandModel || 'Standard'}</div>
          </div>
          <div>
            <div class="info-item-label">Service Address</div>
            <div class="info-item-val">${ticket.address}, ${ticket.landmark}, ${ticket.district}</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div class="info-item-label">Reported Issue</div>
          <div style="font-size: 0.95rem; color: var(--text-primary); background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px;">
            <strong>${ticket.issuePreset}</strong><br>
            <span style="color: var(--text-secondary);">${ticket.issueDescription}</span>
          </div>
        </div>

        ${ticket.assignedTech && ticket.assignedTech !== 'Unassigned' ? `
          <div style="margin-top: 16px; padding: 14px; background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.18); border-radius: 10px; display: flex; align-items: center; gap: 12px;">
            <div style="flex-shrink:0; width:38px; height:38px; border-radius:50%; background:rgba(220,38,38,0.15); display:flex; align-items:center; justify-content:center; color:var(--primary-red);">
              <i data-lucide="user-check" style="width:18px;height:18px;"></i>
            </div>
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary-red); text-transform: uppercase; letter-spacing: 0.05em;">Assigned Technician</div>
              <div style="font-size: 0.95rem; color: var(--text-primary); font-weight: 600;">${ticket.assignedTech}</div>
              ${ticket.techPhone ? `<div style="font-size: 0.82rem; color: var(--text-muted);"><a href="tel:${ticket.techPhone}" style="color:var(--secondary-gold);">${ticket.techPhone}</a></div>` : ''}
            </div>
          </div>
        ` : ''}

        ${ticket.resolutionNotes ? `
          <div style="margin-top: 16px; padding: 14px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 10px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #10b981; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Service Engineer Remarks</div>
            <div style="font-size: 0.9rem; color: var(--text-primary); line-height:1.55;">${ticket.resolutionNotes}</div>
          </div>
        ` : ''}

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <a href="tel:+918075873679" style="display:inline-flex;align-items:center;gap:6px;background:rgba(220,38,38,0.12);border:1px solid rgba(220,38,38,0.25);border-radius:8px;padding:9px 16px;font-size:0.85rem;font-weight:600;color:#fff;text-decoration:none;"><i data-lucide="phone-call" style="width:15px;height:15px;"></i> Call Service Desk</a>
          <a href="https://wa.me/918075873679?text=Hello%20Royal%20Eye%20Solar%20Power,%20I%20need%20help%20with%20my%20ticket%20${ticket.id}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:rgba(37,211,102,0.10);border:1px solid rgba(37,211,102,0.25);border-radius:8px;padding:9px 16px;font-size:0.85rem;font-weight:600;color:#25d366;text-decoration:none;"><i data-lucide="message-circle" style="width:15px;height:15px;"></i> WhatsApp</a>
        </div>
      </div>
    `;

    this.refreshIcons();
  }

  // ============================================================
  // ADMIN DASHBOARD & TOLL-FREE HELPDESK OPERATIONS
  // ============================================================
  updateStats() {
    if (!document.getElementById('kpi-total')) return;
    const total = this.tickets.length;
    const open = this.tickets.filter(t => t.status === 'Open').length;
    const assigned = this.tickets.filter(t => t.status === 'Assigned').length;
    const progress = this.tickets.filter(t => t.status === 'In Progress').length;
    const resolved = this.tickets.filter(t => t.status === 'Resolved').length;
    const emergency = this.tickets.filter(t => t.priority === 'Emergency' && t.status !== 'Resolved').length;

    const setKpi = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setKpi('kpi-total', total);
    setKpi('kpi-open', open);
    setKpi('kpi-assigned', assigned);
    setKpi('kpi-progress', progress);
    setKpi('kpi-resolved', resolved);
    setKpi('kpi-emergency', emergency);

    const navBadge = document.getElementById('nav-open-count');
    if (navBadge) {
      navBadge.textContent = open;
      navBadge.style.display = open > 0 ? 'inline-block' : 'none';
    }
  }

  setFilterStatus(status) {
    this.activeFilterStatus = status;
    const sel = document.getElementById('filter-status');
    if (sel) sel.value = status;
    this.renderAdminTickets();
  }

  setFilterPriority(priority) {
    this.activeFilterPriority = priority;
    const sel = document.getElementById('filter-priority');
    if (sel) sel.value = priority;
    this.renderAdminTickets();
  }

  resetAdminFilters() {
    this.activeFilterStatus = 'ALL';
    this.activeFilterPriority = 'ALL';
    document.getElementById('filter-product').value = 'ALL';
    document.getElementById('filter-status').value = 'ALL';
    document.getElementById('filter-priority').value = 'ALL';
    document.getElementById('admin-search-input').value = '';
    this.renderAdminTickets();
  }

  renderAdminTickets() {
    const searchInput = document.getElementById('admin-search-input');
    const productFilter = document.getElementById('filter-product');
    const statusFilter = document.getElementById('filter-status');
    const priorityFilter = document.getElementById('filter-priority');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filterProd = productFilter ? productFilter.value : 'ALL';
    const filterStat = statusFilter ? statusFilter.value : this.activeFilterStatus;
    const filterPrio = priorityFilter ? priorityFilter.value : this.activeFilterPriority;

    const filtered = this.tickets.filter(t => {
      // Search
      const matchQuery = !query || 
        t.id.toLowerCase().includes(query) ||
        t.customerName.toLowerCase().includes(query) ||
        t.phone.includes(query) ||
        t.district.toLowerCase().includes(query) ||
        (t.assignedTech && t.assignedTech.toLowerCase().includes(query));

      // Product
      const matchProd = filterProd === 'ALL' || t.product === filterProd;

      // Status
      const matchStat = filterStat === 'ALL' || t.status === filterStat;

      // Priority
      const matchPrio = filterPrio === 'ALL' || t.priority === filterPrio;

      return matchQuery && matchProd && matchStat && matchPrio;
    });

    const tbody = document.getElementById('tickets-tbody');
    const emptyState = document.getElementById('empty-state');

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = filtered.map(ticket => {
      // Tech options
      const techOptions = TECHNICIANS.map(tech => 
        `<option value="${tech.name}" ${ticket.assignedTech === tech.name ? 'selected' : ''}>${tech.name} (${tech.zone.split('&')[0]})</option>`
      ).join('');

      return `
        <tr>
          <td>
            <span class="ticket-cell-id" onclick="app.openTicketDetail('${ticket.id}')">${ticket.id}</span>
          </td>
          <td style="font-size: 0.8rem; color: var(--text-muted);">
            ${ticket.date}
          </td>
          <td class="ticket-cust-cell">
            <strong>${ticket.customerName}</strong>
            <span><i data-lucide="phone" style="width: 12px; height: 12px; display: inline;"></i> ${ticket.phone}</span> &bull; 
            <span>${ticket.district}</span>
          </td>
          <td>
            <span class="ticket-product-pill">
              ${this.getProductIconSvg(ticket.product)}
              ${ticket.product}
            </span>
          </td>
          <td style="max-width: 240px;">
            <div style="font-weight: 600; font-size: 0.83rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${ticket.issuePreset}">
              ${ticket.issuePreset}
            </div>
            <div style="font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${ticket.issueDescription}">
              ${ticket.issueDescription}
            </div>
          </td>
          <td>
            <span class="badge-priority priority-${ticket.priority}">${ticket.priority}</span>
          </td>
          <td>
            <select class="admin-select" style="padding: 4px 8px; font-size: 0.8rem; width: 150px;" onchange="app.assignTechnician('${ticket.id}', this.value)">
              <option value="Unassigned" ${ticket.assignedTech === 'Unassigned' ? 'selected' : ''}>Assign Tech...</option>
              ${techOptions}
            </select>
          </td>
          <td>
            <select class="admin-select" style="padding: 4px 8px; font-size: 0.8rem; font-weight: 700;" onchange="app.updateTicketStatus('${ticket.id}', this.value)">
              <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
              <option value="Assigned" ${ticket.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
              <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-action-icon" title="View Full Details" onclick="app.openTicketDetail('${ticket.id}')">
                <i data-lucide="eye"></i>
              </button>
              <a href="tel:${ticket.phone}" class="btn-action-icon" title="Call Customer">
                <i data-lucide="phone"></i>
              </a>
              <a href="https://wa.me/91${ticket.phone}?text=Hello%20${encodeURIComponent(ticket.customerName)},%20regarding%20your%20Royal%20Eye%20Solar%20service%20ticket%20${ticket.id}" target="_blank" class="btn-action-icon" title="WhatsApp Customer">
                <i data-lucide="message-circle"></i>
              </a>
              <button class="btn-action-icon" title="Print Job Sheet" onclick="app.printJobCard('${ticket.id}')">
                <i data-lucide="printer"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    this.refreshIcons();
  }

  getProductIconSvg(product) {
    if (product === 'Inverters') return '<i data-lucide="cpu" style="width: 14px; height: 14px;"></i>';
    if (product === 'Battery') return '<i data-lucide="battery" style="width: 14px; height: 14px;"></i>';
    if (product === 'Lithium Battery') return '<i data-lucide="battery-charging" style="width: 14px; height: 14px; color: var(--primary-red);"></i>';
    if (product === 'Solar Service') return '<i data-lucide="sun" style="width: 14px; height: 14px; color: var(--secondary-gold);"></i>';
    if (product === 'Solar Water Service') return '<i data-lucide="flame" style="width: 14px; height: 14px;"></i>';
    return '<i data-lucide="droplet" style="width: 14px; height: 14px;"></i>';
  }

  // Assign Technician Action
  assignTechnician(ticketId, techName) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.assignedTech = techName;
    const tech = TECHNICIANS.find(t => t.name === techName);
    ticket.techPhone = tech ? tech.phone : '';

    if (techName !== 'Unassigned' && ticket.status === 'Open') {
      ticket.status = 'Assigned';
    }

    this.saveTickets();
    this.updateStats();
    this.renderAdminTickets();
    this.showToast(`Assigned ${techName} to ${ticket.id}`, 'success');
  }

  // Update Status Action
  updateTicketStatus(ticketId, newStatus) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.status = newStatus;
    this.saveTickets();
    this.updateStats();
    this.renderAdminTickets();
    this.showToast(`Ticket ${ticketId} status updated to ${newStatus}`, 'success');
  }

  // Ticket Detail Drawer / Modal
  openTicketDetail(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const modal = document.getElementById('ticket-detail-modal');
    const card = document.getElementById('ticket-detail-card');

    const techOptions = TECHNICIANS.map(tech => 
      `<option value="${tech.name}" ${ticket.assignedTech === tech.name ? 'selected' : ''}>${tech.name} (${tech.zone})</option>`
    ).join('');

    card.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-wrap">
          <i data-lucide="file-text"></i>
          <h3>Service Ticket: <span style="color: var(--primary-red);">${ticket.id}</span></h3>
          <span class="badge-status status-${ticket.status.replace(/\s+/g, '')}">${ticket.status}</span>
        </div>
        <button class="modal-close" onclick="app.closeTicketDetail()">&times;</button>
      </div>

      <div class="detail-meta-grid">
        <div>
          <div class="info-item-label">Customer Name</div>
          <div class="info-item-val">${ticket.customerName}</div>
        </div>
        <div>
          <div class="info-item-label">Primary Mobile</div>
          <div class="info-item-val">${ticket.phone} ${ticket.altPhone ? `(Alt: ${ticket.altPhone})` : ''}</div>
        </div>
        <div>
          <div class="info-item-label">Registration Time</div>
          <div class="info-item-val">${ticket.date}</div>
        </div>
        <div>
          <div class="info-item-label">Equipment Category</div>
          <div class="info-item-val">${ticket.product}</div>
        </div>
        <div>
          <div class="info-item-label">Brand & Model</div>
          <div class="info-item-val">${ticket.brandModel || 'Standard'}</div>
        </div>
        <div>
          <div class="info-item-label">Installation Site</div>
          <div class="info-item-val">${ticket.installationType}</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="info-item-label">Site Address & Directions</div>
        <div style="background: rgba(0,0,0,0.2); padding: 10px 14px; border-radius: 8px; font-size: 0.92rem;">
          <i data-lucide="map-pin" style="width: 14px; height: 14px; display: inline; color: var(--primary-red);"></i>
          <strong>${ticket.address}</strong>, Landmark: ${ticket.landmark}, District: <strong>${ticket.district}</strong>
        </div>
      </div>

      <div class="detail-section-title">Reported Fault & Symptoms</div>
      <div class="detail-issue-box">
        <strong style="color: var(--secondary-gold); font-size: 0.95rem;">${ticket.issuePreset}</strong>
        <p style="margin-top: 6px; color: var(--text-primary);">${ticket.issueDescription}</p>
        ${ticket.photoUrl ? `
          <div style="margin-top: 14px;">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">ATTACHED EQUIPMENT PHOTO:</div>
            <img src="${ticket.photoUrl}" alt="Fault attachment" style="max-width: 240px; border-radius: 8px; border: 1px solid var(--border-subtle);">
          </div>
        ` : ''}
      </div>

      <div class="quick-comm-actions">
        <a href="tel:${ticket.phone}" class="btn-primary" style="padding: 8px 16px;">
          <i data-lucide="phone"></i> Call Customer Now
        </a>
        <a href="https://wa.me/91${ticket.phone}?text=Hello%20${encodeURIComponent(ticket.customerName)},%20this%20is%20Royal%20Eye%20Solar%20Power%20Customer%20Service%20regarding%20ticket%20${ticket.id}." target="_blank" class="btn-whatsapp" style="padding: 8px 16px;">
          <i data-lucide="message-circle"></i> Send WhatsApp Notice
        </a>
        <button class="btn-secondary" onclick="app.printJobCard('${ticket.id}')">
          <i data-lucide="printer"></i> Print Field Work-Order
        </button>
      </div>

      <!-- Technician Dispatch Section -->
      <div class="tech-assign-controls">
        <h4 style="margin-bottom: 12px; font-size: 0.95rem; color: #fff;">Technician Dispatch & Service Progress</h4>
        <div class="form-grid-2">
          <div class="form-group" style="margin-bottom: 8px;">
            <label>Assigned Engineer</label>
            <select id="detail-tech-select" class="form-control">
              <option value="Unassigned">Unassigned</option>
              ${techOptions}
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 8px;">
            <label>Service Status</label>
            <select id="detail-status-select" class="form-control">
              <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
              <option value="Assigned" ${ticket.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
              <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 8px;">
          <label>Technician Field Remarks / Parts Replaced / Resolution Summary</label>
          <textarea id="detail-remarks" class="form-control" rows="2" placeholder="e.g., Inverter DC fuse replaced, lithium BMS firmware recalibrated...">${ticket.resolutionNotes || ''}</textarea>
        </div>

        <div style="text-align: right; margin-top: 12px;">
          <button class="btn-primary" onclick="app.saveTicketDetailChanges('${ticket.id}')">
            <i data-lucide="save"></i> Save Ticket Updates
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    this.refreshIcons();
  }

  closeTicketDetail() {
    document.getElementById('ticket-detail-modal').classList.add('hidden');
  }

  saveTicketDetailChanges(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const techName = document.getElementById('detail-tech-select').value;
    const status = document.getElementById('detail-status-select').value;
    const remarks = document.getElementById('detail-remarks').value.trim();

    ticket.assignedTech = techName;
    const techObj = TECHNICIANS.find(t => t.name === techName);
    ticket.techPhone = techObj ? techObj.phone : '';
    ticket.status = status;
    ticket.resolutionNotes = remarks;

    this.saveTickets();
    this.updateStats();
    this.renderAdminTickets();
    this.closeTicketDetail();
    this.showToast(`Service ticket ${ticketId} updated successfully!`, 'success');
  }

  // ============================================================
  // MANUAL TICKET ENTRY (TOLL-FREE PHONE CALL OPERATOR)
  // ============================================================
  openManualTicketModal() {
    document.getElementById('manual-ticket-modal').classList.remove('hidden');
    this.refreshIcons();
  }

  closeManualTicketModal() {
    document.getElementById('manual-ticket-modal').classList.add('hidden');
  }

  handleManualTicketSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('manual-name').value.trim();
    const phone = document.getElementById('manual-phone').value.trim();
    const helpline = document.getElementById('manual-helpline').value;
    const product = document.getElementById('manual-product').value;
    const priority = document.getElementById('manual-priority').value;
    const location = document.getElementById('manual-location').value.trim();
    const issue = document.getElementById('manual-issue').value.trim();

    const ticketId = this.generateTicketId();
    const newTicket = {
      id: ticketId,
      date: this.formatDateTime(),
      timestamp: Date.now(),
      customerName: name,
      phone: phone,
      altPhone: '',
      product: product,
      brandModel: `Logged via Toll-Free (${helpline})`,
      installationType: 'Residential (Home)',
      priority: priority,
      district: location.includes('Thrissur') ? 'Thrissur' : location,
      address: location,
      landmark: `Call Intake: ${helpline}`,
      issuePreset: 'Toll-Free Phone Intake',
      issueDescription: issue,
      photoUrl: null,
      status: 'Open',
      assignedTech: 'Unassigned',
      techPhone: '',
      resolutionNotes: ''
    };

    this.tickets.unshift(newTicket);
    this.saveTickets();
    this.closeManualTicketModal();

    // Reset fields
    document.getElementById('manual-name').value = '';
    document.getElementById('manual-phone').value = '';
    document.getElementById('manual-location').value = '';
    document.getElementById('manual-issue').value = '';

    this.showToast(`Logged Toll-Free Complaint: ${ticketId}`, 'success');
  }

  // ============================================================
  // PRINTABLE JOB CARD
  // ============================================================
  printJobCard(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const printContainer = document.getElementById('printable-job-card');
    printContainer.innerHTML = `
      <div class="job-card-header">
        <div>
          <div class="job-card-title">ROYAL EYE SOLAR POWER (REX)</div>
          <div style="font-size: 0.85rem; color: #555;">Central Service Hub: Edamuttam, Thrissur, Kerala - 680568 | Phone: +91 80758 73679 | +91 90745 72600</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.2rem; font-weight: bold; color: #e51e2b;">FIELD SERVICE JOB CARD</div>
          <div>Ticket: <strong>${ticket.id}</strong></div>
        </div>
      </div>

      <div class="job-card-meta">
        <div class="job-card-box">
          <strong>CUSTOMER DETAILS</strong><br>
          Name: ${ticket.customerName}<br>
          Phone: ${ticket.phone} ${ticket.altPhone ? `/ ${ticket.altPhone}` : ''}<br>
          Address: ${ticket.address}, ${ticket.landmark}<br>
          District: ${ticket.district}
        </div>
        <div class="job-card-box">
          <strong>EQUIPMENT & PRIORITY</strong><br>
          Product: ${ticket.product}<br>
          Model/Spec: ${ticket.brandModel || 'Standard'}<br>
          Priority: ${ticket.priority}<br>
          Booking Date: ${ticket.date}
        </div>
      </div>

      <div class="job-card-box" style="margin-bottom: 20px;">
        <strong>REPORTED FAULT / SYMPTOMS:</strong><br>
        ${ticket.issuePreset}<br>
        <em>${ticket.issueDescription}</em>
      </div>

      <div class="job-card-box" style="margin-bottom: 20px;">
        <strong>ASSIGNED SERVICE TECHNICIAN:</strong> ${ticket.assignedTech || 'Unassigned'} &bull; Contact: ${ticket.techPhone || 'Central Dispatch'}
      </div>

      <div class="job-card-box" style="min-height: 120px; margin-bottom: 30px;">
        <strong>FIELD RESOLUTION & PARTS REPLACED (Technician to fill on-site):</strong>
      </div>

      <div style="display: flex; justify-content: space-between; padding-top: 30px; border-top: 1px solid #ccc;">
        <div>Customer Signature: _______________________</div>
        <div>Service Engineer Signature: _______________________</div>
      </div>
    `;

    printContainer.classList.remove('hidden');
    window.print();
    printContainer.classList.add('hidden');
  }

  // ============================================================
  // EXPORT TICKETS TO CSV
  // ============================================================
  exportTicketsCSV() {
    if (this.tickets.length === 0) {
      this.showToast('No tickets to export.', 'error');
      return;
    }

    const headers = ['Ticket ID', 'Date', 'Customer Name', 'Phone', 'District', 'Address', 'Product', 'Priority', 'Status', 'Assigned Engineer', 'Issue'];
    const rows = this.tickets.map(t => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.customerName}"`,
      `"${t.phone}"`,
      `"${t.district}"`,
      `"${t.address}"`,
      `"${t.product}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.assignedTech}"`,
      `"${(t.issueDescription || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RoyalEye_Service_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('Complaints data exported to CSV.', 'success');
  }

  // ============================================================
  // ANALYTICS & BREAKDOWN
  // ============================================================
  renderProductBreakdown() {
    const container = document.getElementById('product-breakdown-container');
    if (!container) return;

    const counts = {};
    const total = this.tickets.length || 1;

    Object.keys(PRODUCT_ISSUES).forEach(p => counts[p] = 0);
    this.tickets.forEach(t => {
      if (counts[t.product] !== undefined) counts[t.product]++;
      else counts[t.product] = 1;
    });

    container.innerHTML = Object.entries(counts).map(([product, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div class="breakdown-row">
          <div class="breakdown-header">
            <span>${product}</span>
            <span>${count} requests (${pct}%)</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTechnicianList() {
    const container = document.getElementById('technician-list-container');
    if (!container) return;

    container.innerHTML = TECHNICIANS.map(tech => {
      // Count active assigned tickets
      const activeCount = this.tickets.filter(t => t.assignedTech === tech.name && (t.status === 'Assigned' || t.status === 'In Progress')).length;
      return `
        <div class="tech-row">
          <div class="tech-info-left">
            <div class="tech-status-dot ${activeCount > 1 ? 'busy' : ''}"></div>
            <div>
              <div style="font-size: 0.88rem; font-weight: 700; color: #fff;">${tech.name}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">${tech.zone} &bull; ${tech.phone}</div>
            </div>
          </div>
          <div>
            <span style="font-size: 0.78rem; font-weight: 700; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px;">
              ${activeCount} Active Jobs
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  refreshAdminDashboard() {
    this.loadTickets();
    this.updateStats();
    this.renderAdminTickets();
    this.renderProductBreakdown();
    this.renderTechnicianList();
    this.showToast('Dashboard refreshed with latest data.', 'success');
  }

  // Helper Toast
  showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle-2' : 'alert-triangle'}" style="width: 18px; height: 18px;"></i>
      <span>${msg}</span>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Global Singleton Instance
const app = new RexServiceApp();

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
