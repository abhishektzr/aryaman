/**
 * Renderer - Canvas-based game rendering
 * Handles all drawing; listens to GameState changes
 */

export class Renderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.W = 0;
    this.H = 0;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = this.W * this.dpr;
    this.canvas.height = this.H * this.dpr;
    this.canvas.style.width = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.W, this.H);
  }

  drawScene(state) {
    // Sky gradient
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.H * 0.5);
    skyGrad.addColorStop(0, '#3a7bd5');
    skyGrad.addColorStop(1, '#8ec5e8');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.W, this.H * 0.16);

    // Stadium background
    this.ctx.fillStyle = '#2b2f3a';
    this.ctx.fillRect(0, this.H * 0.10, this.W, this.H * 0.06);

    // Grass
    const grassGrad = this.ctx.createLinearGradient(0, this.H * 0.16, 0, this.H);
    grassGrad.addColorStop(0, '#2e8b3d');
    grassGrad.addColorStop(1, '#3fae53');
    this.ctx.fillStyle = grassGrad;
    this.ctx.fillRect(0, this.H * 0.16, this.W, this.H);

    // Boundary ellipse
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.ellipse(this.W * 0.5, this.H * 0.55, this.W * 0.46, this.H * 0.40, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    // Inner circle
    this.ctx.strokeStyle = 'rgba(255,255,255,.4)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.ellipse(this.W * 0.5, this.H * 0.52, this.W * 0.27, this.H * 0.24, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    // Pitch
    const pt = this.H * 0.16;
    const pb = this.H * 0.74;
    const ptw = this.W * 0.06;
    const pbw = this.W * 0.12;

    this.ctx.fillStyle = '#c8a26a';
    this.ctx.beginPath();
    this.ctx.moveTo(this.W * 0.5 - ptw / 2, pt);
    this.ctx.lineTo(this.W * 0.5 + ptw / 2, pt);
    this.ctx.lineTo(this.W * 0.5 + pbw / 2, pb);
    this.ctx.lineTo(this.W * 0.5 - pbw / 2, pb);
    this.ctx.closePath();
    this.ctx.fill();

    // Creases
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.W * 0.5 - ptw * 0.7, pt + 10);
    this.ctx.lineTo(this.W * 0.5 + ptw * 0.7, pt + 10);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.W * 0.5 - pbw * 0.7, pb - 14);
    this.ctx.lineTo(this.W * 0.5 + pbw * 0.7, pb - 14);
    this.ctx.stroke();

    // Stumps
    this.drawStumps(this.W * 0.5, pt + 6, 8);
    this.drawStumps(this.W * 0.5, pb - 10, 16);
  }

  drawStumps(x, y, s) {
    this.ctx.strokeStyle = '#f5deb3';
    this.ctx.lineWidth = Math.max(2, s / 6);
    for (let i = -1; i <= 1; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + i * s * 0.35, y);
      this.ctx.lineTo(x + i * s * 0.35, y - s);
      this.ctx.stroke();
    }
  }

  drawStick(x, y, scale, pose, color) {
    this.ctx.strokeStyle = color || '#111';
    this.ctx.lineWidth = Math.max(2, 3 * scale);
    this.ctx.lineCap = 'round';

    const h = 26 * scale;

    // Head
    this.ctx.fillStyle = color || '#111';
    this.ctx.beginPath();
    this.ctx.arc(x, y - h, 5 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // Body
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - h + 5 * scale);
    this.ctx.lineTo(x, y - h * 0.3);
    this.ctx.stroke();

    // Legs
    const bx = x;
    const by = y - h * 0.3;
    const l1 = pose.legs || 0;

    this.ctx.beginPath();
    this.ctx.moveTo(bx, by);
    this.ctx.lineTo(bx - 7 * scale - l1 * 6 * scale, y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(bx, by);
    this.ctx.lineTo(bx + 7 * scale + l1 * 6 * scale, y);
    this.ctx.stroke();

    // Arms
    const sh = y - h + 8 * scale;
    const a = pose.arm || 0;

    this.ctx.beginPath();
    this.ctx.moveTo(bx, sh);
    this.ctx.lineTo(bx - 9 * scale, sh + 8 * scale - a * 14 * scale);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(bx, sh);
    this.ctx.lineTo(bx + 9 * scale, sh + 8 * scale - (pose.arm2 !== undefined ? pose.arm2 : a) * 14 * scale);
    this.ctx.stroke();

    // Bat
    if (pose.bat) {
      this.ctx.strokeStyle = '#d2a05a';
      this.ctx.lineWidth = 4 * scale;
      this.ctx.beginPath();
      this.ctx.moveTo(bx + 9 * scale, sh + 6 * scale);
      this.ctx.lineTo(bx + 9 * scale + (pose.batdx || 16) * scale, y - 2 * scale);
      this.ctx.stroke();
    }
  }

  drawCircle(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawText(text, x, y, style = {}) {
    this.ctx.fillStyle = style.color || '#fff';
    this.ctx.font = style.font || '16px Arial';
    this.ctx.textAlign = style.align || 'left';
    this.ctx.textBaseline = style.baseline || 'top';
    if (style.shadow) {
      this.ctx.shadowColor = style.shadow;
      this.ctx.shadowBlur = 5;
    }
    this.ctx.fillText(text, x, y);
    this.ctx.shadowBlur = 0;
  }

  getPitchTop() {
    return this.H * 0.16;
  }

  getPitchBot() {
    return this.H * 0.74;
  }
}
