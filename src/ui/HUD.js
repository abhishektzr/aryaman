/**
 * HUD - Heads-up display (scorecard, commentary, info)
 * Real-time updates via EventBus
 */

import { eventBus, EVENTS } from '../utils/EventBus.js';

export class HUD {
  constructor() {
    this.scoreEl = document.getElementById('hudScore');
    this.oversEl = document.getElementById('hudOvers');
    this.targetEl = document.getElementById('hudTarget');
    this.batterEl = document.getElementById('hudBatter');
    this.commentaryEl = document.getElementById('commentary');
    this.setupListeners();
  }

  setupListeners() {
    eventBus.subscribe(EVENTS.SCORE_CHANGED, (data) => this.updateScore(data.score));
    eventBus.subscribe(EVENTS.WICKETS_CHANGED, (data) => this.updateWickets(data.wickets));
    eventBus.subscribe(EVENTS.OVERS_CHANGED, (data) => this.updateOvers(data.overs));
    eventBus.subscribe(EVENTS.COMMENTARY_UPDATE, (data) => this.showCommentary(data.text));
  }

  updateScore(score) {
    if (this.scoreEl) {
      this.scoreEl.textContent = score;
    }
  }

  updateWickets(wkts) {
    if (this.scoreEl) {
      const score = this.scoreEl.textContent;
      this.scoreEl.textContent = `${score}/${wkts}`.replace(/\/\//g, '/');
    }
  }

  updateOvers(overs) {
    if (this.oversEl) {
      this.oversEl.textContent = `${overs} ov`;
    }
  }

  setTarget(target) {
    if (this.targetEl && target) {
      this.targetEl.textContent = `Target ${target}`;
    }
  }

  setBatterInfo(name, runs, balls) {
    if (this.batterEl) {
      this.batterEl.textContent = `${name} ${runs}(${balls})*`;
    }
  }

  showCommentary(text) {
    if (this.commentaryEl) {
      this.commentaryEl.textContent = text;
      // Fade animation
      this.commentaryEl.style.opacity = '0';
      setTimeout(() => {
        this.commentaryEl.style.transition = 'opacity 0.5s';
        this.commentaryEl.style.opacity = '1';
      }, 50);
    }
  }

  setFormattedScore(score, wkts) {
    if (this.scoreEl) {
      this.scoreEl.textContent = `${score}/${wkts}`;
    }
  }

  show() {
    document.getElementById('hudTL')?.style.setProperty('display', 'block');
    document.getElementById('hudTR')?.style.setProperty('display', 'block');
  }

  hide() {
    document.getElementById('hudTL')?.style.setProperty('display', 'none');
    document.getElementById('hudTR')?.style.setProperty('display', 'none');
  }
}

export const hud = new HUD();
