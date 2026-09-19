/**
 * Royal Eye Solar Power Portal — Configuration & Cloud REST API Sync Helper
 * Configures connection to Render.com backend service with seamless fallback to localStorage.
 */

(function (window) {
  // Configurable Render backend URL. Update this if your Render app name is different.
  const DEFAULT_RENDER_URL = 'https://supportroyaleyesolar.onrender.com';

  // Determine effective API base URL
  let apiBaseUrl = window.RENDER_API_URL || DEFAULT_RENDER_URL;
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    apiBaseUrl = window.location.origin;
  }

  const API_ENDPOINT = apiBaseUrl.replace(/\/+$/, '') + '/api';

  window.REX_CONFIG = {
    renderApiUrl: apiBaseUrl,
    apiEndpoint: API_ENDPOINT
  };

  window.RexApi = {
    // Health check
    async checkHealth() {
      try {
        const res = await fetch(`${API_ENDPOINT}/health`, { cache: 'no-cache' });
        return await res.json();
      } catch (err) {
        console.warn('[REX API] Backend offline or unreachable, using local storage cache.', err);
        return null;
      }
    },

    // Fetch Complaints
    async getComplaints(fallbackLocalData = []) {
      try {
        const res = await fetch(`${API_ENDPOINT}/complaints`, { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch (err) {
        console.warn('[REX API] Error fetching complaints from Render, falling back to local storage:', err);
      }
      return fallbackLocalData;
    },

    // Save Bulk Complaints
    async saveComplaints(complaintsList) {
      try {
        const res = await fetch(`${API_ENDPOINT}/complaints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complaintsList)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[REX API] Failed to sync bulk complaints to Render:', err);
      }
      return null;
    },

    // Save / Add Single Complaint
    async saveSingleComplaint(complaintObj) {
      try {
        const res = await fetch(`${API_ENDPOINT}/complaints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complaintObj)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[REX API] Failed to sync ticket to Render API:', err);
      }
      return null;
    },

    // Update Complaint
    async updateComplaint(id, updates) {
      try {
        const res = await fetch(`${API_ENDPOINT}/complaints/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[REX API] Failed to update ticket on Render:', err);
      }
      return null;
    },

    // Delete Complaint
    async deleteComplaint(id) {
      try {
        const res = await fetch(`${API_ENDPOINT}/complaints/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[REX API] Failed to delete ticket on Render:', err);
      }
      return null;
    },

    // Get Settings
    async getSettings(fallbackSettings = null) {
      try {
        const res = await fetch(`${API_ENDPOINT}/settings`, { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            return data;
          }
        }
      } catch (err) {
        console.warn('[REX API] Error fetching settings from Render, using local fallback:', err);
      }
      return fallbackSettings;
    },

    // Save Settings
    async saveSettings(settingsObj) {
      try {
        const res = await fetch(`${API_ENDPOINT}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsObj)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[REX API] Failed to sync settings to Render API:', err);
      }
      return null;
    }
  };
})(window);
