/**
 * Fielding - Fielder positions, movements, and catch mechanics
 */

const FIELDER_POSITIONS = [
  { name: 'Mid-on', x: 0.50, y: 0.30 },
  { name: 'Cover', x: 0.30, y: 0.42 },
  { name: 'Mid-off', x: 0.70, y: 0.42 },
  { name: 'Fine leg', x: 0.18, y: 0.55 },
  { name: 'Third man', x: 0.82, y: 0.55 },
  { name: 'Mid-wicket', x: 0.35, y: 0.62 },
  { name: 'Point', x: 0.65, y: 0.62 },
  { name: 'Long-on', x: 0.12, y: 0.40 },
  { name: 'Long-off', x: 0.88, y: 0.40 },
  { name: 'Deep square', x: 0.50, y: 0.18 }
];

export class FieldingSystem {
  constructor() {
    this.fielders = this.initFielders();
  }

  initFielders() {
    return FIELDER_POSITIONS.map(pos => ({
      ...pos,
      fx: pos.x,
      fy: pos.y,
      running: false,
      catching: false,
      diving: false
    }));
  }

  resetFielders() {
    this.fielders = this.initFielders();
  }

  getFielderAt(index) {
    return this.fielders[index];
  }

  getAllFielders() {
    return this.fielders;
  }

  setFielderCatching(index) {
    if (this.fielders[index]) {
      this.fielders[index].catching = true;
    }
  }

  setFielderDiving(index) {
    if (this.fielders[index]) {
      this.fielders[index].diving = true;
    }
  }

  moveFielderToPoint(index, x, y) {
    if (this.fielders[index]) {
      this.fielders[index].fx = x;
      this.fielders[index].fy = y;
      this.fielders[index].running = true;
    }
  }

  clearFielderState(index) {
    if (this.fielders[index]) {
      this.fielders[index].running = false;
      this.fielders[index].catching = false;
      this.fielders[index].diving = false;
    }
  }
}

export const fieldingSystem = new FieldingSystem();
