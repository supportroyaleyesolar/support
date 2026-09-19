# Royal Eye Solar Power (REX) — Customer Service & Toll-Free Helpdesk Portal

![Royal Eye Solar Power](https://img.shields.io/badge/Service-Royal%20Eye%20Solar%20Power-yellow?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/supportroyaleyesolar/support?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

Official Customer Complaint & Maintenance Request Portal for **Royal Eye Solar Power (REX)**, Edamuttam, Thrissur, Kerala.

## 🚀 Live Hosted Deployment Links

| Resource | Hosted URL / Target |
| :--- | :--- |
| **GitHub Repository** | [github.com/supportroyaleyesolar/support](https://github.com/supportroyaleyesolar/support) |
| **GitHub Pages Frontend** | [supportroyaleyesolar.github.io/support](https://supportroyaleyesolar.github.io/support/) |
| **Render Backend REST API** | [supportroyaleyesolar.onrender.com](https://supportroyaleyesolar.onrender.com) |

---

## ✨ Features

- ⚡ **Customer Complaint Lodge & Service Dispatch**: Quick ticket creation for Inverters, REX Lithium Batteries, Tubular Batteries, Solar Power Plants, and Solar Water Heaters.
- 🔍 **Real-Time Ticket Tracker**: Track status by Complaint Ticket ID (`REX-2026-XXXX`), Mobile Number, or KSEB Consumer Number.
- ⚡ **KSEB Electrical Section Search**: Instant lookup across 700+ Kerala KSEB electrical section offices.
- 🛡️ **Staff Helpdesk Dashboard (`admin.html`)**: Password-protected dashboard for helpdesk executives and field engineers to view, assign, update, and resolve complaints.
- ⚙️ **Website CMS & Settings Manager (`settings.html`)**: Edit company info, toll-free numbers, banner text, partner brands, technician directory, and staff login credentials without touch of code.
- ☁️ **Cloud REST API & Persistent Data Storage (Render.com)**: Node.js Express server providing persistent JSON data storage for tickets and settings, with seamless offline `localStorage` fallback.

---

## 🔐 Helpdesk Staff Login Credentials

Log in at `admin.html` or `settings.html`:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `rex.admin` | `RoyalEye@2026` |
| **Support Staff 1** | `helpdesk1` | `Support#1234` |
| **Support Staff 2** | `helpdesk2` | `Assist@5678` |
| **Field Supervisor** | `supervisor` | `Supervisor@99` |

---

## 🛠️ Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/supportroyaleyesolar/support.git
   cd support
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Local Development Server**:
   ```bash
   npm start
   ```

4. **Open in Browser**:
   - Customer Portal: `http://localhost:3000/`
   - Staff Helpdesk: `http://localhost:3000/admin.html`
   - Settings Manager: `http://localhost:3000/settings.html`
   - Healthcheck API: `http://localhost:3000/api/health`

---

## 🌐 Deploying to Render.com (Backend API & Data Storage)

1. Log in to [Render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `supportroyaleyesolar/support`.
4. Render will automatically detect `render.yaml` or use the following settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**. Your persistent REST API will be live at `https://supportroyaleyesolar.onrender.com`.

---

## 📄 Deploying to GitHub Pages (Frontend UI)

1. Navigate to your GitHub repository: `https://github.com/supportroyaleyesolar/support`.
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `root (/)`
4. Click **Save**.
5. Your site will be published at `https://supportroyaleyesolar.github.io/support/`.

---

## 📞 Customer Support & Helplines

- **Toll-Free Helplines**: +91 80758 73679 | +91 90745 72600
- **Location**: Edamuttam, Thrissur, Kerala - 680568
- **WhatsApp**: +91 80758 73679

&copy; 2026 Royal Eye Solar Power. All rights reserved.
