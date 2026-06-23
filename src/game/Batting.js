/**
 * Batting - Batting mechanics and shot selection UI
 * Handles timing system, shot selection, and outcome resolution
 */

import { gameState } from '../core/GameState.js';
import { eventBus, EVENTS } from '../utils/EventBus.js';
import { match } from './Match.js';

export class BattingSystem {
  constructor() {
    this.timingActive = false;
    this.timingPos = 0;
    this.timingDir = 1;
    this.zoneStart = 0.35;
    this.zoneWidth = 0.3;
    this.selectedShot = null;
  }

  startTiming() {
    this.timingActive = true;
    this.timingPos = 0;
    this.timingDir = 1;
    this.zoneStart = 0.3 + Math.random() * 0.4;
    this.zoneWidth = 0.25;

    const wrap = document.getElementById('timingWrap');
    if (wrap) {
      wrap.style.display = 'block';
      const zone = document.getElementById('timingZone');
      if (zone) {
        zone.style.left = (this.zoneStart * 100) + '%';
        zone.style.width = (this.zoneWidth * 100) + '%';
      }
    }
  }

  stopTiming() {
    this.timingActive = false;
    const wrap = document.getElementById('timingWrap');
    if (wrap) wrap.style.display = 'none';
  }

  updateTiming(dt) {
    if (!this.timingActive) return;

    this.timingPos += this.timingDir * dt * 0.0011;
    if (this.timingPos >= 1) {
      this.timingPos = 1;
      this.timingDir = -1;
    }
    if (this.timingPos <= 0) {
      this.timingPos = 0;
      this.timingDir = 1;
    }

    const mark = document.getElementById('timingMark');
    if (mark) mark.style.left = (this.timingPos * 100) + '%';
  }

  getTimingQuality() {
    if (!this.timingActive) return 'poor';

    const center = this.zoneStart + this.zoneWidth / 2;
    const distance = Math.abs(this.timingPos - center);

    if (distance < this.zoneWidth * 0.25) return 'perfect';
    if (distance < this.zoneWidth * 0.5) return 'good';
    if (distance < 0.25) return 'ok';
    return 'poor';
  }

  playShot(shotType, deliveryType) {
    this.selectedShot = shotType;
    const timing = this.getTimingQuality();

    this.stopTiming();

    console.log(`⚾ Shot: ${shotType} | Timing: ${timing} | Delivery: ${deliveryType}`);

    // Play the shot
    match.playBall(shotType, deliveryType, timing);

    this.selectedShot = null;
  }

  aiShot(deliveryType) {
    const state = gameState.getState();
    const batter = state.batStats[state.striker].p;

    // AI aggression based on skill
    const skill = batter.bat / 100;
    const aggression = skill * 0.6 + (state.inning === 2 ? 0.2 : 0);

    let shot;
    if (aggression > 1.0) {
      shot = Math.random() < 0.4 ? 'LOFT' : 'DRIVE';
    } else if (aggression > 0.6) {
      shot = ['DRIVE', 'CUT', 'DEFEND'][Math.floor(Math.random() * 3)];
    } else {
      shot = Math.random() < 0.6 ? 'DEFEND' : 'DRIVE';
    }

    const timing = ['poor', 'ok', 'good', 'perfect'][Math.floor(Math.random() * 4)];

    console.log(`🤖 AI Shot: ${shot} | Timing: ${timing}`);

    match.playBall(shot, deliveryType, timing);
  }
}

export const battingSystem = new BattingSystem();
