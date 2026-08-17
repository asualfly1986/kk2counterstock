/**
 * Digital Signature Pad Handler
 * Smooth canvas drawing for Touch & Mouse input
 */

class SignaturePad {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.isDrawing = false;
    this.history = [];
    this.hasSigned = false;

    this.initCanvas();
    this.attachEvents();
  }

  initCanvas() {
    // Set line styles
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#312e81'; // Deep Indigo signature ink
    this.clear();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Fill white background for clean export
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.history = [];
    this.saveState();
    this.hasSigned = false;
  }

  saveState() {
    if (this.history.length >= 10) this.history.shift();
    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
  }

  undo() {
    if (this.history.length > 1) {
      this.history.pop();
      const lastState = this.history[this.history.length - 1];
      this.ctx.putImageData(lastState, 0, 0);
    } else {
      this.clear();
    }
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  startDrawing(e) {
    e.preventDefault();
    this.isDrawing = true;
    const pos = this.getPos(e);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    const pos = this.getPos(e);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.hasSigned = true;
  }

  stopDrawing(e) {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.saveState();
    }
  }

  attachEvents() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
    this.canvas.addEventListener('mouseleave', (e) => this.stopDrawing(e));

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.stopDrawing(e));
  }

  isEmpty() {
    return !this.hasSigned;
  }

  toDataURL() {
    if (this.isEmpty()) return '';
    return this.canvas.toDataURL('image/png');
  }
}

window.SignaturePad = SignaturePad;
