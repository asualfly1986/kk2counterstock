/**
 * Barcode Scanner Controller
 * Camera Scanner & USB Hardware Gun Scanner Integration
 */

class BarcodeScanner {
  constructor(onScanCallback) {
    this.onScan = onScanCallback;
    this.html5QrCode = null;
    this.isCameraScanning = false;
    this.usbBuffer = "";
    this.usbTimer = null;

    this.initUsbScanner();
  }

  // 1. USB Hardware Barcode Reader Gun Integration
  initUsbScanner() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is actively typing in a standard input or textarea unless it's the barcode input
      const targetTag = e.target.tagName.toLowerCase();
      const targetId = e.target.id;
      
      if (targetTag === 'textarea' || (targetTag === 'input' && targetId !== 'barcodeSearchInput' && targetId !== 'dispenseBarcodeInput' && targetId !== 'auditBarcodeInput')) {
        return;
      }

      if (e.key === 'Enter') {
        if (this.usbBuffer.trim().length >= 3) {
          const scannedCode = this.usbBuffer.trim();
          this.usbBuffer = "";
          if (this.onScan) this.onScan(scannedCode, 'usb');
        }
        this.usbBuffer = "";
      } else if (e.key.length === 1) { // Single char
        this.usbBuffer += e.key;
        clearTimeout(this.usbTimer);
        this.usbTimer = setTimeout(() => {
          this.usbBuffer = ""; // Reset buffer if typed too slowly (manual typing)
        }, 120);
      }
    });
  }

  // 2. Camera Barcode Reader Integration (Html5Qrcode)
  async startCamera(readerElementId, onResult) {
    if (typeof Html5Qrcode === 'undefined') {
      alert('⚠️ ระบบสแกนผ่านกล้องกำลังโหลด library สแกนบาร์โค้ด... กรุณาลองใหม่อีกครั้ง');
      return false;
    }

    try {
      if (this.isCameraScanning) {
        await this.stopCamera();
      }

      this.html5QrCode = new Html5Qrcode(readerElementId);
      const config = { fps: 10, qrbox: { width: 250, height: 180 } };

      await this.html5QrCode.start(
        { facingMode: "environment" }, // Rear camera
        config,
        (decodedText, decodedResult) => {
          if (onResult) onResult(decodedText);
          if (this.onScan) this.onScan(decodedText, 'camera');
        },
        (errorMessage) => {
          // Ignore scanning frame errors
        }
      );

      this.isCameraScanning = true;
      return true;
    } catch (err) {
      console.error("Camera Error:", err);
      alert("❌ ไม่สามารถเปิดกล้องได้: " + (err.message || err));
      return false;
    }
  }

  async stopCamera() {
    if (this.html5QrCode && this.isCameraScanning) {
      try {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
      } catch (e) {
        console.warn("Stop camera warning:", e);
      }
      this.isCameraScanning = false;
    }
  }
}

window.BarcodeScanner = BarcodeScanner;
