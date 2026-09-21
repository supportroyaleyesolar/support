# Royal Eye Solar Power (REX) — Customer Service & Toll-Free Helpdesk Portal

![Royal Eye Solar Power](https://img.shields.io/badge/Service-Royal%20Eye%20Solar%20Power-yellow?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/supportroyaleyesolar/support?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

Official Customer Complaint & Maintenance Request Portal for **Royal Eye Solar Power (REX)**, Edamuttam, Thrissur, Kerala.

## 🚀 Live Hosted Deployment Links

| Resource | Hosted URL |
| :--- | :--- |
| **GitHub Repository** | [github.com/supportroyaleyesolar/support](https://github.com/supportroyaleyesolar/support) |
| **🏠 Customer Portal** | [supportroyaleyesolar.onrender.com/portal](https://supportroyaleyesolar.onrender.com/portal) |
| **🛡️ Admin / Helpdesk Portal** | [supportroyaleyesolar.onrender.com/admin](https://supportroyaleyesolar.onrender.com/admin) |
| **⚙️ Settings / CMS Page** | [supportroyaleyesolar.onrender.com/settings](https://supportroyaleyesolar.onrender.com/settings) |
| **🔗 API Health Check** | [supportroyaleyesolar.onrender.com/api/health](https://supportroyaleyesolar.onrender.com/api/health) |

---

## ✨ Features

- ⚡ **Customer Complaint Lodge & Service Dispatch**: Quick ticket creation for Inverters, REX Lithium Batteries, Tubular Batteries, Solar Power Plants, and Solar Water Heaters.
- 🔍 **Real-Time Ticket Tracker**: Track status by Complaint Ticket ID (`REX-2026-XXXX`), Mobile Number, or KSEB Consumer Number.
- ⚡ **KSEB Electrical Section Search**: Instant lookup across 700+ Kerala KSEB electrical section offices.
- 🛡️ **Staff Helpdesk Dashboard (`/admin`)**: Password-protected dashboard for helpdesk executives and field engineers to view, assign, update, and resolve complaints.
- ⚙️ **Website CMS & Settings Manager (`/settings`)**: Edit company info, toll-free numbers, banner text, partner brands, technician directory, and staff login credentials without touch of code.
- ☁️ **Cloud REST API & Persistent Data Storage (Render.com)**: Node.js Express server providing persistent JSON data storage for tickets and settings, with seamless offline `localStorage` fallback.

---

## 🔐 Helpdesk Staff Login Credentials

Log in at `/admin` or `/settings`:

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
   - Customer Portal: `http://localhost:3000/` or `http://localhost:3000/portal`
   - Admin Helpdesk: `http://localhost:3000/admin`
   - Settings Manager: `http://localhost:3000/settings`
   - Healthcheck API: `http://localhost:3000/api/health`

---

## 🌐 Deploying to Render.com

1. Log in to [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `supportroyaleyesolar/support`.
4. Render will automatically detect `render.yaml` and configure:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Click **Create Web Service**. Your site will be live at:
   - 🏠 Customer Portal → `https://supportroyaleyesolar.onrender.com/portal`
   - 🛡️ Admin Portal → `https://supportroyaleyesolar.onrender.com/admin`
   - ⚙️ Settings Page → `https://supportroyaleyesolar.onrender.com/settings`

---

## 📞 Customer Support & Helplines

- **Toll-Free Helplines**: +91 80758 73679 | +91 90745 72600
- **Location**: Edamuttam, Thrissur, Kerala - 680568
- **WhatsApp**: +91 80758 73679

&copy; 2026 Royal Eye Solar Power. All rights reserved.
