/**
 * Google Sheets API Sync Client
 * Connects Web Application to Google Apps Script Web App
 */

class GoogleSheetsService {
  constructor() {
    this.STORAGE_KEY_GAS_URL = 'pea_gas_web_app_url';
    this.DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwU_bN2XC7SA63LTqXXjbzqGsRQjO3w0NnvhfNafkHXuCbWgOnb0HXI5UPIPxQAOD-G/exec';
  }

  getGasUrl() {
    return localStorage.getItem(this.STORAGE_KEY_GAS_URL) || this.DEFAULT_GAS_URL;
  }

  setGasUrl(url) {
    const cleanUrl = url.trim();
    localStorage.setItem(this.STORAGE_KEY_GAS_URL, cleanUrl);
    return cleanUrl;
  }

  hasConfiguredUrl() {
    const url = this.getGasUrl();
    return url.length > 10 && url.startsWith('http');
  }

  async testConnection(testUrl = null) {
    const targetUrl = testUrl || this.getGasUrl();
    if (!targetUrl) throw new Error('ยังไม่ได้ระบุ Web App URL');

    const cacheBuster = `_t=${Date.now()}`;
    const sep = targetUrl.includes('?') ? '&' : '?';
    const res = await fetch(`${targetUrl}${sep}action=get_data&${cacheBuster}`, {
      method: 'GET',
      mode: 'cors'
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return data;
  }

  async fetchRemoteData() {
    if (!this.hasConfiguredUrl()) return null;
    try {
      const data = await this.testConnection();
      return data;
    } catch (e) {
      console.warn("Fetch remote data notice:", e);
      return null;
    }
  }

  async sendTransaction(txData) {
    if (!this.hasConfiguredUrl()) return false;
    const url = this.getGasUrl();

    try {
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Apps Script preferred mode
        body: JSON.stringify({
          action: 'transaction',
          data: txData
        })
      });

      const data = await res.json();
      return data && data.status === 'success';
    } catch (err) {
      console.error("Google Sheets POST Error:", err);
      return false;
    }
  }

  async syncAllStock(items) {
    if (!this.hasConfiguredUrl()) return false;
    const url = this.getGasUrl();

    try {
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'sync_stock',
          items: items.map(i => ({ code: i.code, currentQty: i.currentQty }))
        })
      });
      const data = await res.json();
      return data && data.status === 'success';
    } catch (err) {
      console.error("Google Sheets Batch Sync Error:", err);
      return false;
    }
  }

  async addRequester(name) {
    if (!this.hasConfiguredUrl()) return false;
    try {
      await fetch(this.getGasUrl(), {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'add_requester', name: name })
      });
      return true;
    } catch (e) { return false; }
  }

  async deleteRequester(name) {
    if (!this.hasConfiguredUrl()) return false;
    try {
      await fetch(this.getGasUrl(), {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'delete_requester', name: name })
      });
      return true;
    } catch (e) { return false; }
  }
}

window.GoogleSheetsService = GoogleSheetsService;
