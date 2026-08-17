/**
 * Local & Cloud Inventory Database Manager
 */

class StockDatabase {
  constructor() {
    this.STORAGE_KEY_ITEMS = 'pea_items_master_v7_synced';
    this.STORAGE_KEY_LOGS = 'pea_logs_v2';
    this.STORAGE_KEY_REQUESTERS = 'pea_requesters_v3';
    
    this.sheetsService = new window.GoogleSheetsService();
    this.init();
  }

  init() {
    const masterItems = window.MASTER_ITEMS_99 || [];
    const validCodes = new Set(masterItems.map(i => String(i.code).trim()));

    // Clean up old cached versions and stale offline logs
    localStorage.removeItem('pea_items_master_v1');
    localStorage.removeItem('pea_items_master_v2');
    localStorage.removeItem('pea_items_master_v3');
    localStorage.removeItem('pea_items_master_v4');
    localStorage.removeItem('pea_items_master_v5_114');
    localStorage.removeItem('pea_items_master_v6_realtime');
    localStorage.removeItem('pea_logs_v1');

    if (!localStorage.getItem(this.STORAGE_KEY_ITEMS)) {
      this.resetToDefaults();
    } else {
      // Purge removed items from LocalStorage if browser cached previous items
      let cachedItems = this.getItems();
      let cleanedItems = cachedItems.filter(i => validCodes.has(String(i.code).trim()));
      if (cleanedItems.length !== cachedItems.length) {
        this.saveItems(cleanedItems);
      }
    }
    // Always refresh default requesters to match current master list without "นาย"
    if (!localStorage.getItem(this.STORAGE_KEY_REQUESTERS) || localStorage.getItem('pea_requesters_v1') || localStorage.getItem('pea_requesters_v2')) {
      localStorage.removeItem('pea_requesters_v1');
      localStorage.removeItem('pea_requesters_v2');
      localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(window.DEFAULT_REQUESTERS));
    }

    // Auto sync with Google Sheets cloud in background
    setTimeout(() => {
      this.syncFromCloud();
    }, 500);
  }

  async syncFromCloud() {
    try {
      const data = await this.sheetsService.fetchRemoteData();
      if (data && data.items && data.items.length > 0) {
        const localItems = this.getItems();
        const itemMap = new Map(localItems.map(i => [String(i.code).trim(), i]));
        
        data.items.forEach(remoteItem => {
          const code = String(remoteItem.code).trim();
          if (itemMap.has(code)) {
            itemMap.get(code).currentQty = Number(remoteItem.currentQty);
            if (remoteItem.standard) itemMap.get(code).standard = Number(remoteItem.standard);
          }
        });
        this.saveItems(Array.from(itemMap.values()));
      }

      // Always sync logs from cloud (even if empty after deletion in Google Sheets)
      if (data && Array.isArray(data.logs)) {
        this.saveLogs(data.logs);
      }

      if (data && data.requesters && data.requesters.length > 0) {
        localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(data.requesters));
      }
      return true;
    } catch(e) {
      console.warn("Cloud sync notice:", e);
      return false;
    }
  }

  resetToDefaults() {
    const items = (window.MASTER_ITEMS_99 || []).map(item => ({
      ...item,
      currentQty: item.currentQty !== undefined ? item.currentQty : item.standard,
      lastUpdated: new Date().toISOString()
    }));
    this.saveItems(items);
    if (!localStorage.getItem(this.STORAGE_KEY_LOGS)) {
      this.saveLogs([]);
    }
    localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(window.DEFAULT_REQUESTERS));
  }

  forceResetToMaster() {
    localStorage.removeItem('pea_items_master_v1');
    localStorage.removeItem('pea_items_master_v2');
    localStorage.removeItem(this.STORAGE_KEY_ITEMS);
    this.resetToDefaults();
  }

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_ITEMS) || '[]');
    } catch(e) {
      return [];
    }
  }

  saveItems(items) {
    localStorage.setItem(this.STORAGE_KEY_ITEMS, JSON.stringify(items));
  }

  getLogs() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_LOGS) || '[]');
    } catch(e) {
      return [];
    }
  }

  saveLogs(logs) {
    localStorage.setItem(this.STORAGE_KEY_LOGS, JSON.stringify(logs));
  }

  getRequesters() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_REQUESTERS) || '[]');
    } catch(e) {
      return window.DEFAULT_REQUESTERS;
    }
  }

  addRequester(name) {
    const cleanName = name.trim();
    if (!cleanName) throw new Error('กรุณากรอกชื่อผู้เบิก');
    const list = this.getRequesters();
    if (list.includes(cleanName)) throw new Error('มีรายชื่อนี้ในระบบแล้ว');
    list.push(cleanName);
    localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(list));
    
    // Sync Google Sheets
    this.sheetsService.addRequester(cleanName);
    return list;
  }

  deleteRequester(name) {
    let list = this.getRequesters();
    list = list.filter(n => n !== name);
    localStorage.setItem(this.STORAGE_KEY_REQUESTERS, JSON.stringify(list));
    
    // Sync Google Sheets
    this.sheetsService.deleteRequester(name);
    return list;
  }

  getItemByCode(code) {
    const items = this.getItems();
    const clean = String(code).trim();
    return items.find(i => String(i.code).trim() === clean);
  }

  // Calculate Status (ต่ำกว่า 50% ของเกณฑ์มาตรฐาน ให้เป็น ต่ำกว่าเกณฑ์มาตรฐาน)
  getItemStatus(currentQty, standardQty) {
    const current = Number(currentQty);
    const std = Number(standardQty);
    if (current <= 0) return { key: 'out_of_stock', label: 'สินค้าหมดคลัง', color: '#ef4444', badgeClass: 'badge-danger' };
    if (current < std * 0.5) return { key: 'low', label: 'ต่ำกว่าเกณฑ์มาตรฐาน', color: '#f59e0b', badgeClass: 'badge-warning' };
    if (current <= std) return { key: 'normal', label: 'ตรงตามมาตรฐาน', color: '#10b981', badgeClass: 'badge-success' };
    return { key: 'over', label: 'เกินมาตรฐาน', color: '#6366f1', badgeClass: 'badge-info' };
  }

  // Process Dispense, Receive or Count Audit
  async processTransaction(type, code, qty, requester = "-", workOrder = "-", note = "", signature = "", photo = "") {
    const items = this.getItems();
    const index = items.findIndex(i => String(i.code).trim() === String(code).trim());
    if (index === -1) throw new Error(`ไม่พบรายการพัสดุรหัส ${code}`);

    const item = items[index];
    const oldQty = Number(item.currentQty);
    const changeQty = Number(qty);
    let newQty = oldQty;

    if (type === 'dispense') {
      if (oldQty < changeQty) {
        throw new Error(`จำนวนคงเหลือในคลังไม่พอเบิก (คงเหลือ ${oldQty} ${item.unit})`);
      }
      newQty = oldQty - changeQty;
    } else if (type === 'receive') {
      newQty = oldQty + changeQty;
    } else if (type === 'audit') { // Inventory Count / Audit direct override
      newQty = changeQty;
    }

    items[index].currentQty = newQty;
    items[index].lastUpdated = new Date().toISOString();
    this.saveItems(items);

    const logTypeLabel = type === 'dispense' ? 'เบิกจ่าย' : (type === 'receive' ? 'รับเข้า' : 'ตรวจนับคลัง');
    const logObj = {
      id: 'LOG-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      type: logTypeLabel,
      code: code,
      name: item.name,
      qty: type === 'audit' ? Math.abs(newQty - oldQty) : Math.abs(changeQty),
      unit: item.unit,
      balanceBefore: oldQty,
      balanceAfter: newQty,
      requester: requester,
      workOrder: workOrder,
      note: note,
      signature: signature,
      photo: photo
    };

    const logs = this.getLogs();
    logs.unshift(logObj);
    this.saveLogs(logs);

    // Direct sync to Google Sheets
    await this.sheetsService.sendTransaction(logObj);

    return {
      item: items[index],
      log: logObj
    };
  }

  getDashboardStats() {
    const items = this.getItems();
    const totalSKU = items.length;
    let outOfStock = 0;
    let lowStock = 0;
    let normalStock = 0;
    let overStock = 0;

    items.forEach(i => {
      const st = this.getItemStatus(i.currentQty, i.standard);
      if (st.key === 'out_of_stock') outOfStock++;
      else if (st.key === 'low') lowStock++;
      else if (st.key === 'normal') normalStock++;
      else if (st.key === 'over') overStock++;
    });

    const logs = this.getLogs();
    const totalTransactions = logs.length;

    return {
      totalSKU,
      outOfStock,
      lowStock,
      normalStock,
      overStock,
      totalTransactions
    };
  }
}

window.db = new StockDatabase();
