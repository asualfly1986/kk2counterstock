/**
 * Main Application Logic & UI Controller (Mobile Optimized + 4 Sloc + Barcode Label Printing)
 */

class App {
  constructor() {
    this.selectedCategory = 'ALL';
    this.currentDispenseItem = null;
    this.currentAuditItem = null;
    
    this.dispensePhotoBase64 = '';
    this.auditPhotoBase64 = '';

    this.activeScannerMode = null; // 'search', 'dispense', 'audit'

    this.init();
  }

  async init() {
    // Purge old local storage keys from previous sessions
    try {
      localStorage.removeItem('pea_items_master_v1');
      localStorage.removeItem('pea_items_master_v2');
      if (window.db) window.db.init();
    } catch(e) {}

    // 1. Initialize Signature Pad
    const dispenseCanvas = document.getElementById('dispenseSignatureCanvas');
    if (dispenseCanvas) {
      this.resizeCanvasForMobile(dispenseCanvas);
      this.dispenseSigPad = new window.SignaturePad(dispenseCanvas);
    }

    // 2. Initialize Barcode Scanner
    this.scanner = new window.BarcodeScanner((scannedCode, source) => {
      this.onBarcodeScanned(scannedCode, source);
    });

    // 3. Populate Requesters Select Dropdowns
    this.populateRequestersDropdowns();

    // 4. Render Initial Dashboard & Category Pills
    this.renderCategoryPills();
    this.renderStockTable();
    this.updateDashboardStats();
    this.renderLogsTable();
    this.renderRequestersList();

    // 5. Check Google Sheets Sync Connection Status
    this.checkGasConnectionStatus();

    // 6. Pre-fill Web App URL if saved
    const gasInput = document.getElementById('gasUrlInput');
    if (gasInput) {
      gasInput.value = window.db.sheetsService.getGasUrl();
    }

    // 7. Initialize Warehouse Photo Slideshow Auto-Play
    this.initWarehousePhotoSlider();

    // 8. Real-Time Auto Sync with Google Sheets (Auto Polling every 3.5s + Focus Sync)
    this.triggerAutoSync(true);
    setInterval(() => this.triggerAutoSync(false), 3500);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.triggerAutoSync(true);
    });
    window.addEventListener('focus', () => this.triggerAutoSync(true));

    // Handle Window Resize for Canvas
    window.addEventListener('resize', () => {
      if (dispenseCanvas && this.dispenseSigPad) {
        this.resizeCanvasForMobile(dispenseCanvas);
      }
    });
  }

  async triggerAutoSync(force = false) {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const prevHash = JSON.stringify(window.db.getItems().map(i => ({ c: i.code, q: i.currentQty }))) + '_' + window.db.getLogs().length;
      const synced = await window.db.syncFromCloud();
      const currentHash = JSON.stringify(window.db.getItems().map(i => ({ c: i.code, q: i.currentQty }))) + '_' + window.db.getLogs().length;

      if (force || prevHash !== currentHash) {
        this.renderStockTable();
        this.updateDashboardStats();
        this.renderLogsTable();
        this.populateRequestersDropdowns();
      }
      
      const badge = document.getElementById('liveSyncBadge');
      if (badge) {
        if (synced) {
          badge.className = 'badge badge-success';
          badge.style.display = 'inline-flex';
          badge.innerHTML = '<span style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff; display: inline-block; animation: pulse 1.5s infinite;"></span> ⚡ ซิงก์อัตโนมัติ (Live)';
        } else {
          badge.className = 'badge badge-warning';
          badge.style.display = 'inline-flex';
          badge.innerHTML = '<span style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff; display: inline-block;"></span> ⚠️ ออฟไลน์ (Offline)';
        }
      }
    } catch (e) {
      console.warn("Auto-sync notice:", e);
      const badge = document.getElementById('liveSyncBadge');
      if (badge) {
        badge.className = 'badge badge-warning';
        badge.style.display = 'inline-flex';
        badge.innerHTML = '<span style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff; display: inline-block;"></span> ⚠️ ออฟไลน์ (Offline)';
      }
    } finally {
      this.isSyncing = false;
    }
  }

  async manualForceSync() {
    this.showToast('🔄 กำลังดึงข้อมูลสดจาก Google Sheets...', 'info');
    const synced = await window.db.syncFromCloud();
    if (synced) {
      this.renderStockTable();
      this.updateDashboardStats();
      this.renderLogsTable();
      this.populateRequestersDropdowns();
      this.showToast('✅ ข้อมูลสดตรงกับ Google Sheets เรียบร้อยแล้ว', 'success');
    } else {
      this.showToast('⚠️ ไม่สามารถดึงข้อมูลจาก Cloud ได้ กรุณาตรวจสอบการเชื่อมต่อ', 'warning');
    }
  }

  resizeCanvasForMobile(canvas) {
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width > 0) {
      canvas.width = rect.width - 20;
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = type === 'success' 
      ? `<i class="fa-solid fa-circle-check"></i> ${message}`
      : `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  switchTab(tabId) {
    if (tabId === 'settings') {
      const password = prompt('🔒 หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ\nกรุณากรอกรหัสผ่านเพื่อเข้าสู่หน้าตั้งค่า Google Apps Script Web App URL:');
      if (password === null) return; // User cancelled
      if (password.trim() !== 'Aunkungnaja') {
        this.showToast('❌ รหัสผ่านไม่ถูกต้อง! ไม่สามารถเข้าสู่หน้าตั้งค่าได้', 'error');
        return;
      }
    }

    document.querySelectorAll('.nav-tabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = content.id === `tab-${tabId}` ? 'block' : 'none';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'dashboard') {
      this.renderStockTable();
      this.updateDashboardStats();
    } else if (tabId === 'print-barcodes') {
      this.renderPrintableBarcodes();
    } else if (tabId === 'history') {
      this.renderLogsTable();
    } else if (tabId === 'requesters') {
      this.renderRequestersList();
    }
  }

  renderCategoryPills() {
    const container = document.getElementById('categoryPills');
    if (!container) return;

    const items = window.db.getItems();
    const categories = ['ALL', ...new Set(items.map(i => i.category))];

    container.innerHTML = categories.map(cat => `
      <button class="pill-btn ${this.selectedCategory === cat ? 'active' : ''}" onclick="app.setCategoryFilter('${cat}')">
        ${cat === 'ALL' ? '🏷️ ทั้งหมด (All)' : cat}
      </button>
    `).join('');
  }

  setCategoryFilter(category) {
    this.selectedCategory = category;
    this.renderCategoryPills();
    this.renderStockTable();
  }

  updateDashboardStats() {
    const stats = window.db.getDashboardStats();
    document.getElementById('statTotalSKU').textContent = stats.totalSKU;
    document.getElementById('statLowStock').textContent = stats.lowStock;
    document.getElementById('statOutOfStock').textContent = stats.outOfStock;
    document.getElementById('statTotalTx').textContent = stats.totalTransactions;
  }

  renderStockTable() {
    const tbody = document.getElementById('stockTableBody');
    const mobileCardsContainer = document.getElementById('mobileStockCards');

    const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();
    let items = window.db.getItems();

    if (this.selectedCategory !== 'ALL') {
      items = items.filter(i => i.category === this.selectedCategory);
    }

    if (query) {
      items = items.filter(i => 
        i.code.toLowerCase().includes(query) || 
        i.name.toLowerCase().includes(query) || 
        i.category.toLowerCase().includes(query)
      );
    }

    // 1. Render Desktop Table
    if (tbody) {
      if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">ไม่พบรายการพัสดุ</td></tr>`;
      } else {
        tbody.innerHTML = items.map((item, index) => {
          const status = window.db.getItemStatus(item.currentQty, item.standard);
          const seqNo = item.no || (index + 1);
          return `
            <tr>
              <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${seqNo}</td>
              <td><strong style="font-family: monospace; font-size: 14px; color: var(--pea-primary);">${item.code}</strong></td>
              <td><span style="font-weight: 600;">${item.name}</span></td>
              <td><span style="font-size: 12.5px; color: var(--text-muted);">${item.category}</span></td>
              <td style="text-align: center; font-weight: 600;">${item.standard}</td>
              <td style="text-align: center;"><strong style="font-size: 16px; color: ${status.color};">${item.currentQty}</strong></td>
              <td>${item.unit}</td>
              <td style="text-align: center;">
                <button class="btn btn-gold btn-sm" onclick="app.quickDispense('${item.code}')">
                  <i class="fa-solid fa-hand-holding-box"></i> เบิกจ่าย
                </button>
                <button class="btn btn-primary btn-sm" onclick="app.quickAudit('${item.code}')">
                  <i class="fa-solid fa-clipboard-check"></i> นับคลัง
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // 2. Render Mobile Cards View (Optimized for Mobile Smartphones)
    if (mobileCardsContainer) {
      if (items.length === 0) {
        mobileCardsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 28px;">ไม่พบรายการพัสดุ</div>`;
      } else {
        mobileCardsContainer.innerHTML = items.map((item, index) => {
          const status = window.db.getItemStatus(item.currentQty, item.standard);
          const seqNo = item.no || (index + 1);
          return `
            <div class="stock-item-card">
              <div class="stock-item-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge" style="background: rgba(49, 46, 129, 0.1); color: var(--pea-primary); font-weight: 700; font-size: 13px;">#${seqNo}</span>
                  <div class="stock-item-code"><i class="fa-solid fa-barcode" style="margin-right: 4px;"></i>${item.code}</div>
                </div>
                <span class="badge ${status.badgeClass}">${status.label}</span>
              </div>
              <div class="stock-item-name">${item.name}</div>
              <div class="stock-item-meta">
                <div>เกณฑ์มาตรฐาน: <strong>${item.standard} ${item.unit}</strong></div>
                <div>คงเหลือจริง (2601): <strong style="font-size: 16px; color: ${status.color};">${item.currentQty} ${item.unit}</strong></div>
              </div>
              <div class="stock-item-actions">
                <button class="btn btn-gold btn-sm" onclick="app.quickDispense('${item.code}')">
                  <i class="fa-solid fa-hand-holding-box"></i> เบิกจ่าย
                </button>
                <button class="btn btn-primary btn-sm" onclick="app.quickAudit('${item.code}')">
                  <i class="fa-solid fa-clipboard-check"></i> นับคลัง
                </button>
                <button class="btn btn-outline btn-sm" onclick="app.quickPrintBarcode('${item.code}')" title="พิมพ์ป้ายบาร์โค้ด">
                  <i class="fa-solid fa-barcode"></i> ป้าย
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // Barcode Label Generator & Printing Feature
  renderPrintableBarcodes() {
    const container = document.getElementById('printableBarcodeSection');
    if (!container) return;

    const searchInput = document.getElementById('printBarcodeSearchInput');
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    let items = window.db.getItems();
    if (query) {
      items = items.filter(i => 
        i.code.toLowerCase().includes(query) || 
        i.name.toLowerCase().includes(query)
      );
    }

    if (items.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">ไม่พบรายการสำหรับพิมพ์ป้ายบาร์โค้ด</div>`;
      return;
    }

    container.innerHTML = items.map((item, idx) => `
      <div class="barcode-label-card">
        <div class="barcode-label-header">
          <span>กฟภ. PEA WAREHOUSE</span>
          <span>เกณฑ์: ${item.standard} ${item.unit}</span>
        </div>
        <div class="barcode-label-name">${item.name}</div>
        <div class="barcode-svg-container">
          <svg id="barcode-svg-${idx}"></svg>
        </div>
      </div>
    `).join('');

    // Generate Code 128 Barcodes via JsBarcode
    setTimeout(() => {
      items.forEach((item, idx) => {
        try {
          JsBarcode(`#barcode-svg-${idx}`, item.code, {
            format: "CODE128",
            width: 1.8,
            height: 44,
            fontSize: 12,
            fontOptions: "bold",
            margin: 4,
            displayValue: true
          });
        } catch (e) {
          console.warn("JsBarcode error:", e);
        }
      });
    }, 50);
  }

  // Quick Action Buttons
  quickDispense(code) {
    this.switchTab('dispense');
    document.getElementById('dispenseBarcodeInput').value = code;
    this.onDispenseBarcodedEntered();
  }

  quickAudit(code) {
    this.switchTab('audit');
    document.getElementById('auditBarcodeInput').value = code;
    this.onAuditBarcodedEntered();
  }

  quickPrintBarcode(code) {
    this.switchTab('print-barcodes');
    const searchInput = document.getElementById('printBarcodeSearchInput');
    if (searchInput) {
      searchInput.value = code;
      this.renderPrintableBarcodes();
    }
  }

  // Dispense Form Handlers
  onDispenseBarcodedEntered() {
    const code = document.getElementById('dispenseBarcodeInput').value.trim();
    const item = window.db.getItemByCode(code);
    const previewBox = document.getElementById('dispenseItemPreview');

    if (!item) {
      this.currentDispenseItem = null;
      previewBox.style.display = 'none';
      if (code) this.showToast(`ไม่พบรหัสพัสดุ ${code} ในระบบ`, 'error');
      return;
    }

    this.currentDispenseItem = item;
    document.getElementById('previewItemName').textContent = item.name;
    document.getElementById('previewItemCode').textContent = item.code;
    document.getElementById('previewItemCategory').textContent = item.category;
    document.getElementById('previewItemStandard').textContent = item.standard;
    document.getElementById('previewItemCurrent').textContent = item.currentQty;
    document.querySelectorAll('.previewUnit').forEach(el => el.textContent = item.unit);

    previewBox.style.display = 'block';
  }

  // Audit Form Handlers
  onAuditBarcodedEntered() {
    const code = document.getElementById('auditBarcodeInput').value.trim();
    const item = window.db.getItemByCode(code);
    const previewBox = document.getElementById('auditItemPreview');

    if (!item) {
      this.currentAuditItem = null;
      previewBox.style.display = 'none';
      if (code) this.showToast(`ไม่พบรหัสพัสดุ ${code} ในระบบ`, 'error');
      return;
    }

    this.currentAuditItem = item;
    document.getElementById('auditPreviewName').textContent = item.name;
    document.getElementById('auditPreviewCode').textContent = item.code;
    document.getElementById('auditPreviewStandard').textContent = item.standard;
    document.getElementById('auditPreviewCurrent').textContent = item.currentQty;
    document.getElementById('auditNewQtyInput').value = item.currentQty;

    previewBox.style.display = 'block';
  }

  // Photo Attachment Handler
  handlePhotoSelect(event, mode) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      if (mode === 'dispense') {
        this.dispensePhotoBase64 = base64;
        document.getElementById('dispensePhotoPreviewImg').src = base64;
        document.getElementById('dispensePhotoPreviewContainer').style.display = 'block';
      } else if (mode === 'audit') {
        this.auditPhotoBase64 = base64;
        document.getElementById('auditPhotoPreviewImg').src = base64;
        document.getElementById('auditPhotoPreviewContainer').style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  clearPhoto(mode) {
    if (mode === 'dispense') {
      this.dispensePhotoBase64 = '';
      if (document.getElementById('dispensePhotoFile')) document.getElementById('dispensePhotoFile').value = '';
      if (document.getElementById('dispensePhotoCamera')) document.getElementById('dispensePhotoCamera').value = '';
      document.getElementById('dispensePhotoPreviewContainer').style.display = 'none';
    } else if (mode === 'audit') {
      this.auditPhotoBase64 = '';
      if (document.getElementById('auditPhotoFile')) document.getElementById('auditPhotoFile').value = '';
      if (document.getElementById('auditPhotoCamera')) document.getElementById('auditPhotoCamera').value = '';
      document.getElementById('auditPhotoPreviewContainer').style.display = 'none';
    }
  }

  // Submit Dispense
  async submitDispense() {
    if (!this.currentDispenseItem) {
      this.showToast('กรุณาระบุรหัสพัสดุที่ถูกต้อง', 'error');
      return;
    }

    const qty = Number(document.getElementById('dispenseQtyInput').value);
    const requester = document.getElementById('dispenseRequesterSelect').value;
    const workOrder = document.getElementById('dispenseWorkOrderInput').value.trim();
    const note = document.getElementById('dispenseNoteInput').value.trim();
    const signature = this.dispenseSigPad ? this.dispenseSigPad.toDataURL() : '';

    if (!requester) {
      this.showToast('กรุณาเลือกผู้เบิกพัสดุ', 'error');
      return;
    }

    try {
      const res = await window.db.processTransaction(
        'dispense',
        this.currentDispenseItem.code,
        qty,
        requester,
        workOrder,
        note,
        signature,
        this.dispensePhotoBase64
      );

      this.showToast(`บันทึกการเบิกจ่าย ${res.item.name} (${qty} ${res.item.unit}) สำเร็จ!`);

      // Reset Form
      document.getElementById('dispenseForm').reset();
      this.dispenseSigPad.clear();
      this.clearPhoto('dispense');
      document.getElementById('dispenseItemPreview').style.display = 'none';
      this.currentDispenseItem = null;

      this.updateDashboardStats();
      this.renderStockTable();
      this.renderLogsTable();
      this.renderCategoryPills();

      // Automatically redirect to Home/Dashboard tab (ภาพรวมคลัง)
      setTimeout(() => {
        this.switchTab('inventory');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // Submit Audit Count
  async submitAudit() {
    if (!this.currentAuditItem) {
      this.showToast('กรุณาระบุรหัสพัสดุที่ถูกต้อง', 'error');
      return;
    }

    const newQty = Number(document.getElementById('auditNewQtyInput').value);
    const requester = document.getElementById('auditRequesterSelect').value;
    const note = document.getElementById('auditNoteInput').value.trim();

    try {
      const res = await window.db.processTransaction(
        'audit',
        this.currentAuditItem.code,
        newQty,
        requester,
        'COUNT-AUDIT',
        note,
        '',
        this.auditPhotoBase64
      );

      this.showToast(`บันทึกการตรวจนับ ${res.item.name} ยอดคงเหลือจริงเป็น ${newQty} ${res.item.unit} สำเร็จ!`);

      // Reset Form
      document.getElementById('auditForm').reset();
      this.clearPhoto('audit');
      document.getElementById('auditItemPreview').style.display = 'none';
      this.currentAuditItem = null;

      this.updateDashboardStats();
      this.renderStockTable();
      this.renderLogsTable();
      this.renderCategoryPills();

      // Automatically redirect to Home/Dashboard tab (ภาพรวมคลัง)
      setTimeout(() => {
        this.switchTab('inventory');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  // Render Transaction Logs (Both Desktop Table & Mobile Cards)
  renderLogsTable() {
    const tbody = document.getElementById('logsTableBody');
    const mobileContainer = document.getElementById('mobileLogsCardsContainer');
    if (!tbody && !mobileContainer) return;

    const query = (document.getElementById('logSearchInput') ? document.getElementById('logSearchInput').value : '').toLowerCase().trim();
    let logs = window.db.getLogs();

    if (query) {
      logs = logs.filter(l => 
        (l.code && l.code.toLowerCase().includes(query)) || 
        (l.name && l.name.toLowerCase().includes(query)) || 
        (l.requester && l.requester.toLowerCase().includes(query)) || 
        (l.type && l.type.toLowerCase().includes(query)) ||
        (l.workOrder && l.workOrder.toLowerCase().includes(query)) ||
        (l.note && l.note.toLowerCase().includes(query))
      );
    }

    // 1. Render Desktop Table
    if (tbody) {
      if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">ไม่พบประวัติรายการ</td></tr>`;
      } else {
        tbody.innerHTML = logs.map(l => {
          const formattedDate = new Date(l.timestamp).toLocaleString('th-TH');
          const sigThumb = l.signature 
            ? `<img src="${l.signature}" style="height: 36px; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer;" onclick="app.viewImage('${l.signature}')">`
            : '-';

          const photoThumb = l.photo 
            ? `<img src="${l.photo}" style="height: 36px; width: 36px; object-fit: cover; border-radius: 4px; cursor: pointer;" onclick="app.viewImage('${l.photo}')">`
            : '-';

          const typeBadgeClass = l.type === 'เบิกจ่าย' ? 'badge-warning' : (l.type === 'รับเข้า' ? 'badge-success' : 'badge-info');

          return `
            <tr>
              <td style="white-space: nowrap; font-size: 12.5px;">${formattedDate}</td>
              <td><span class="badge ${typeBadgeClass}">${l.type}</span></td>
              <td><strong style="font-family: monospace;">${l.code}</strong></td>
              <td>${l.name}</td>
              <td style="text-align: center; font-weight: 700;">${l.qty} ${l.unit}</td>
              <td style="text-align: center; font-size: 12.5px;">${l.balanceBefore} ➔ <strong>${l.balanceAfter}</strong></td>
              <td>${l.requester}</td>
              <td style="font-size: 12.5px; font-family: monospace;">${l.workOrder || '-'}</td>
              <td style="text-align: center;">${sigThumb}</td>
              <td style="text-align: center;">${photoThumb}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // 2. Render Mobile Cards View for Logs
    if (mobileContainer) {
      if (logs.length === 0) {
        mobileContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 28px;">ไม่พบประวัติรายการ</div>`;
      } else {
        mobileContainer.innerHTML = logs.map(l => {
          const formattedDate = new Date(l.timestamp).toLocaleString('th-TH');
          const typeBadgeClass = l.type === 'เบิกจ่าย' ? 'badge-warning' : (l.type === 'รับเข้า' ? 'badge-success' : 'badge-info');
          const sigThumb = l.signature 
            ? `<button class="btn btn-outline btn-sm" onclick="app.viewImage('${l.signature}')" style="font-size: 11.5px; padding: 3px 8px;"><i class="fa-solid fa-signature"></i> ลายเซ็น</button>`
            : '';
          const photoThumb = l.photo 
            ? `<button class="btn btn-outline btn-sm" onclick="app.viewImage('${l.photo}')" style="font-size: 11.5px; padding: 3px 8px;"><i class="fa-solid fa-image"></i> รูปถ่าย</button>`
            : '';

          return `
            <div class="stock-item-card" style="margin-bottom: 12px;">
              <div class="stock-item-header">
                <span class="badge ${typeBadgeClass}">${l.type}</span>
                <span style="font-size: 12px; color: var(--text-muted);">${formattedDate}</span>
              </div>
              <div style="margin-top: 6px;">
                <div style="font-family: monospace; font-weight: 700; color: var(--pea-primary); font-size: 13px;">${l.code}</div>
                <div style="font-weight: 600; font-size: 14px; margin-top: 2px;">${l.name}</div>
              </div>
              <div class="stock-item-meta" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e2e8f0;">
                <div class="meta-col">
                  <div class="meta-label">จำนวนทำรายการ</div>
                  <div class="meta-val" style="color: var(--pea-primary); font-size: 15px;">${l.qty} ${l.unit}</div>
                </div>
                <div class="meta-col">
                  <div class="meta-label">ยกมา ➔ คงเหลือ</div>
                  <div class="meta-val" style="font-size: 13.5px;">${l.balanceBefore} ➔ <strong>${l.balanceAfter}</strong></div>
                </div>
                <div class="meta-col">
                  <div class="meta-label">ผู้ทำรายการ</div>
                  <div class="meta-val" style="font-size: 13px; font-weight: 600;">${l.requester}</div>
                </div>
              </div>
              ${(l.workOrder || l.note) ? `
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px; background: rgba(0,0,0,0.02); padding: 6px 8px; border-radius: 6px;">
                  ${l.workOrder ? `<div><strong>WorkOrder:</strong> ${l.workOrder}</div>` : ''}
                  ${l.note ? `<div><strong>หมายเหตุ:</strong> ${l.note}</div>` : ''}
                </div>
              ` : ''}
              ${(sigThumb || photoThumb) ? `
                <div style="display: flex; gap: 6px; margin-top: 8px; justify-content: flex-end;">
                  ${sigThumb}
                  ${photoThumb}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }
  }

  // Export CSV
  exportLogsCSV() {
    const logs = window.db.getLogs();
    if (logs.length === 0) {
      this.showToast('ไม่มีประวัติข้อมูลสำหรับส่งออก', 'error');
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
    csvContent += "วัน-เวลา,ประเภท,รหัสพัสดุ,ชื่อพัสดุ,จำนวน,หน่วยนับ,ยอดยกมา,ยอดคงเหลือ,ผู้ทำรายการ,WorkOrder,หมายเหตุ\n";

    logs.forEach(l => {
      const time = new Date(l.timestamp).toLocaleString('th-TH');
      csvContent += `"${time}","${l.type}","${l.code}","${l.name.replace(/"/g, '""')}","${l.qty}","${l.unit}","${l.balanceBefore}","${l.balanceAfter}","${l.requester}","${l.workOrder}","${l.note}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PEA_Warehouse_Logs_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  }

  // Requesters Dropdowns & List (Searchable Input + Datalist)
  populateRequestersDropdowns() {
    const list = window.db.getRequesters();
    const options = list.map(r => `<option value="${r}">${r}</option>`).join('');

    const datalist = document.getElementById('requestersDatalist');
    if (datalist) {
      datalist.innerHTML = options;
    }

    const dispenseSelect = document.getElementById('dispenseRequesterSelect');
    if (dispenseSelect && dispenseSelect.tagName === 'SELECT') {
      dispenseSelect.innerHTML = `<option value="">-- พิมพ์หรือเลือกรายชื่อผู้เบิก --</option>` + options;
    }

    const auditSelect = document.getElementById('auditRequesterSelect');
    if (auditSelect && auditSelect.tagName === 'SELECT') {
      auditSelect.innerHTML = `<option value="">-- พิมพ์หรือเลือกผู้ตรวจนับคลัง --</option>` + options;
    }
  }

  renderRequestersList() {
    const container = document.getElementById('requestersListContainer');
    if (!container) return;

    const list = window.db.getRequesters();
    container.innerHTML = list.map(name => `
      <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
        <span style="font-weight: 600; font-size: 14px; color: var(--pea-primary);"><i class="fa-solid fa-user-tie" style="margin-right: 8px;"></i> ${name}</span>
        <button class="btn btn-danger btn-sm" onclick="app.handleDeleteRequester('${name}')">
          <i class="fa-solid fa-trash"></i> ลบ
        </button>
      </div>
    `).join('');
  }

  handleAddRequester() {
    const input = document.getElementById('newRequesterNameInput');
    const name = input.value.trim();
    if (!name) return;

    try {
      window.db.addRequester(name);
      input.value = '';
      this.populateRequestersDropdowns();
      this.renderRequestersList();
      this.showToast(`เพิ่มรายชื่อ ${name} เรียบร้อยแล้ว`);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  handleDeleteRequester(name) {
    const password = prompt(`🔒 ยืนยันการลบรายชื่อ "${name}"\nกรุณากรอกรหัสผ่านเพื่อดำเนินการ:`);
    if (password === null) return; // User cancelled

    if (password.trim() !== 'AunkungTuy') {
      this.showToast('❌ รหัสผ่านไม่ถูกต้อง! ไม่สามารถลบรายชื่อผู้เบิกได้', 'error');
      return;
    }

    window.db.deleteRequester(name);
    this.populateRequestersDropdowns();
    this.renderRequestersList();
    this.showToast(`🗑️ ลบรายชื่อ ${name} เรียบร้อยแล้ว`);
  }

  // Camera Barcode Scanner Modal (Optimized for Mobile)
  openCameraScanner(mode) {
    this.activeScannerMode = mode;
    const modal = document.getElementById('cameraModal');
    modal.hidden = false;

    this.scanner.startCamera('readerContainer', (scannedCode) => {
      if (navigator.vibrate) {
        try { navigator.vibrate([100, 50, 100]); } catch(e) {}
      }
      this.onBarcodeScanned(scannedCode, 'camera');
      this.closeCameraScanner();
    });
  }

  closeCameraScanner() {
    document.getElementById('cameraModal').hidden = true;
    this.scanner.stopCamera();
  }

  onBarcodeScanned(scannedCode, source) {
    const item = window.db.getItemByCode(scannedCode);
    const itemName = item ? ` (${item.name})` : '';
    this.showToast(`สแกนพบบาร์โค้ด: ${scannedCode}${itemName}`);
    
    if (this.activeScannerMode === 'dispense' || document.getElementById('tab-dispense').style.display !== 'none') {
      document.getElementById('dispenseBarcodeInput').value = scannedCode;
      this.onDispenseBarcodedEntered();
    } else if (this.activeScannerMode === 'audit' || document.getElementById('tab-audit').style.display !== 'none') {
      document.getElementById('auditBarcodeInput').value = scannedCode;
      this.onAuditBarcodedEntered();
    } else {
      // Stock 2601 Table Search Mode
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = scannedCode;
        this.renderStockTable();
        const stockTable = document.getElementById('stockTable');
        if (stockTable) stockTable.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  // Image Modal Viewer
  viewImage(src) {
    const modal = document.getElementById('imageViewerModal');
    document.getElementById('imageViewerImg').src = src;
    modal.hidden = false;
  }

  // Google Sheets Settings
  promptGasUrl() {
    const currentUrl = window.db.sheetsService.getGasUrl() || '';
    const newUrl = prompt('🔗 วางลิงก์ Web App URL จาก Google Sheets ของคุณเพื่อเชื่อมต่อทันที:', currentUrl);
    if (newUrl !== null && newUrl.trim() !== '') {
      document.getElementById('gasUrlInput').value = newUrl.trim();
      this.testGasConnection();
    } else if (newUrl === '') {
      this.switchTab('settings');
    }
  }

  async checkGasConnectionStatus() {
    const dot = document.getElementById('syncStatusDot');
    const text = document.getElementById('syncStatusText');
    if (!dot || !text) return;
    if (!window.db.sheetsService.hasConfiguredUrl()) {
      dot.className = 'status-dot';
      text.textContent = 'ตั้งค่า Sheets';
      return;
    }

    try {
      await window.db.sheetsService.testConnection();
      dot.className = 'status-dot online';
      text.textContent = 'เชื่อมต่อแล้ว';
    } catch (e) {
      dot.className = 'status-dot';
      text.textContent = 'Sheets ขัดข้อง';
    }
  }

  async resetCache() {
    if (confirm('คุณต้องการรีเซ็ตและซิงก์ข้อมูลพัสดุในเครื่องให้ตรงกับ Google Sheets ใช่หรือไม่?')) {
      localStorage.clear();
      window.db.forceResetToMaster();
      await window.db.syncFromCloud();
      this.renderCategoryPills();
      this.renderStockTable();
      this.updateDashboardStats();
      this.renderLogsTable();
      this.populateRequestersDropdowns();
      this.showToast('✅ ล้างแคชและซิงก์ข้อมูลสดตรงกับ Google Sheets เรียบร้อยแล้ว');
    }
  }

  saveGasUrl() {
    const url = document.getElementById('gasUrlInput').value.trim();
    window.db.sheetsService.setGasUrl(url);
    this.checkGasConnectionStatus();
    this.showToast('บันทึก Web App URL เรียบร้อยแล้ว');
  }

  async testGasConnection() {
    const url = document.getElementById('gasUrlInput').value.trim();
    if (!url) {
      this.showToast('กรุณาระบุ Web App URL', 'error');
      return;
    }

    try {
      this.showToast('กำลังทดสอบการเชื่อมต่อ...');
      await window.db.sheetsService.testConnection(url);
      this.saveGasUrl();
      alert('🎉 ทดสอบการเชื่อมต่อ Google Sheets สำเร็จเรียบร้อยแล้ว!');
    } catch (err) {
      alert('❌ ไม่สามารถเชื่อมต่อได้: ' + err.message);
    }
  }

  openScriptModal() {
    const scriptCode = `/**
 * Google Apps Script for PEA Warehouse Requisition & Stock Count App
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("กรุณาเปิดสคริปต์นี้ใน Google Sheets");

  var sheetStock = ss.getSheetByName("StockMaster") || ss.insertSheet("StockMaster");
  sheetStock.clear();
  sheetStock.getRange(1, 1, 1, 7).setValues([["รหัสพัสดุ (Barcode)", "ชื่อพัสดุ", "เกณฑ์มาตรฐาน", "จำนวนคงเหลือจริง (2601)", "หน่วยนับ", "หมวดหมู่", "อัปเดตล่าสุด"]])
    .setBackground("#312e81").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  var sheetLogs = ss.getSheetByName("TransactionLogs") || ss.insertSheet("TransactionLogs");
  sheetLogs.clear();
  sheetLogs.getRange(1, 1, 1, 14).setValues([["วัน-เวลา", "Log ID", "ประเภทรายการ", "รหัสพัสดุ", "ชื่อพัสดุ", "จำนวนที่ทำรายการ", "หน่วยนับ", "ยอดยกมา", "ยอดคงเหลือ", "ผู้เบิก/ผู้ทำรายการ", "WorkOrder", "หมายเหตุ", "ลายเซ็น", "รูปภาพแนบ"]])
    .setBackground("#4c1d95").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  var sheetReq = ss.getSheetByName("Requesters") || ss.insertSheet("Requesters");
  sheetReq.clear();
  sheetReq.getRange(1, 1, 1, 2).setValues([["ชื่อ-นามสกุล ผู้เบิก", "วันที่เพิ่มข้อมูล"]])
    .setBackground("#1e3a8a").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  SpreadsheetApp.getUi().alert("✅ สร้างฐานข้อมูล Google Sheets เรียบร้อยแล้ว!");
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ContentService.createTextOutput(JSON.stringify(getAllData(ss))).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var postData = JSON.parse(e.postData.contents);
  if (postData.action === "transaction") recordTransaction(ss, postData.data);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}`;

    document.getElementById('scriptCodeTextarea').value = scriptCode;
    document.getElementById('scriptModal').hidden = false;
  }

  copyScriptCode() {
    const textarea = document.getElementById('scriptCodeTextarea');
    textarea.select();
    document.execCommand('copy');
    this.showToast('คัดลอกโค้ด Google Apps Script เรียบร้อยแล้ว!');
  }

  openSettingsModal() {
    this.switchTab('settings');
  }

  // Warehouse Photo Slideshow Slider Methods
  initWarehousePhotoSlider() {
    this.currentWarehouseSlide = 0;
    if (this.warehouseSliderTimer) clearInterval(this.warehouseSliderTimer);
    
    // Auto-advance slide every 5 seconds
    this.warehouseSliderTimer = setInterval(() => {
      this.nextWarehouseSlide();
    }, 5000);
  }

  goToWarehouseSlide(index) {
    this.currentWarehouseSlide = index;
    const track = document.getElementById('warehouseSliderTrack');
    const dot0 = document.getElementById('slideDot0');
    const dot1 = document.getElementById('slideDot1');

    if (track) {
      track.style.transform = `translateX(-${index * 50}%)`;
    }

    if (dot0 && dot1) {
      if (index === 0) {
        dot0.classList.add('active');
        dot0.style.width = '24px';
        dot0.style.borderRadius = '4px';
        dot0.style.background = 'var(--pea-gold)';

        dot1.classList.remove('active');
        dot1.style.width = '8px';
        dot1.style.borderRadius = '50%';
        dot1.style.background = 'rgba(255,255,255,0.5)';
      } else {
        dot1.classList.add('active');
        dot1.style.width = '24px';
        dot1.style.borderRadius = '4px';
        dot1.style.background = 'var(--pea-gold)';

        dot0.classList.remove('active');
        dot0.style.width = '8px';
        dot0.style.borderRadius = '50%';
        dot0.style.background = 'rgba(255,255,255,0.5)';
      }
    }
  }

  nextWarehouseSlide() {
    const nextIdx = (this.currentWarehouseSlide + 1) % 2;
    this.goToWarehouseSlide(nextIdx);
  }

  prevWarehouseSlide() {
    const prevIdx = (this.currentWarehouseSlide - 1 + 2) % 2;
    this.goToWarehouseSlide(prevIdx);
  }
}

// Initialize App when DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
