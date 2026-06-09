/**
 * GameState - Centralized game state container
 * Single source of truth for all game data
 */

import { eventBus, EVENTS } from '../utils/EventBus.js';

class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = {
      // Match setup
      mode: null, // 'worldcup', 'ipl', 'friendly'
      maxOvers: 20,
      myKey: null,
      myTeam: null,
      oppKey: null,
      oppTeam: null,
      userBatFirst: true,

      // XI selection
      myXI: [],
      oppXI: [],

      // Match state
      inning: 1,
      balls: 0,
      score: 0,
      wkts: 0,
      fow: [], // fall of wickets
      lastBallOver: -1,

      // Current batting
      striker: 0,
      nonstriker: 1,
      batStats: [],
      bowlStats: [],

      // Current bowling
      curBowler: null,
      bowlers: [],
      battingXI: [],
      bowlingXI: [],
      battingTeam: null,
      bowlingTeam: null,
      userBatting: true,

      // Target (2nd innings)
      target: null,
      inning1: null,
      inning2: null,

      // Tournament state
      tourney: null,

      // DRS/Review
      reviewsUsed: { bat: 0, bowl: 0 },
      reviewsAvailable: { bat: 2, bowl: 2 },

      // Format
      format: 'T20', // T5, T10, T20, ODI
    };
  }

  // Getters for computed values
  getCurrentBatter() {
    return this.state.batStats[this.state.striker];
  }

  getBatterName() {
    const batter = this.getCurrentBatter();
    return batter ? `${batter.p.name} ${batter.r}(${batter.b})` : '';
  }

  getFormattedScore() {
    return `${this.state.score}/${this.state.wkts}`;
  }

  getFormattedOvers() {
    const overs = Math.floor(this.state.balls / 6);
    const balls = this.state.balls % 6;
    return `${overs}.${balls}`;
  }

  // Setters with event publishing
  setScore(runs) {
    this.state.score += runs;
    eventBus.publish(EVENTS.SCORE_CHANGED, { score: this.state.score });
  }

  addWicket(batter, how) {
    this.state.wkts++;
    batter.out = true;
    batter.how = how;
    this.state.fow.push(`${this.state.score}/${this.state.wkts} (${batter.p.name}, ${this.getFormattedOvers()})`);
    eventBus.publish(EVENTS.WICKETS_CHANGED, { wickets: this.state.wkts, fow: this.state.fow });
  }

  advanceBall() {
    this.state.balls++;
    eventBus.publish(EVENTS.OVERS_CHANGED, { balls: this.state.balls, overs: this.getFormattedOvers() });
  }

  setBatsmen(strikerIdx, nonstrikerIdx) {
    this.state.striker = strikerIdx;
    this.state.nonstriker = nonstrikerIdx;
  }

  swapBatsmen() {
    [this.state.striker, this.state.nonstriker] = [this.state.nonstriker, this.state.striker];
  }

  setInning(num) {
    this.state.inning = num;
    eventBus.publish(EVENTS.INNING_START, { inning: num });
  }

  endInning() {
    if (this.state.inning === 1) {
      this.state.inning1 = {
        score: this.state.score,
        wkts: this.state.wkts,
        balls: this.state.balls,
        batStats: this.state.batStats,
        bowlStats: this.state.bowlStats,
        fow: this.state.fow,
        team: this.state.battingTeam,
        userBatting: this.state.userBatting,
      };
      this.state.target = this.state.score + 1;
    } else {
      this.state.inning2 = {
        score: this.state.score,
        wkts: this.state.wkts,
        balls: this.state.balls,
        batStats: this.state.batStats,
        bowlStats: this.state.bowlStats,
        fow: this.state.fow,
        team: this.state.battingTeam,
        userBatting: this.state.userBatting,
      };
    }
    eventBus.publish(EVENTS.INNING_END, { inning: this.state.inning, snapshot: this.state.inning1 || this.state.inning2 });
  }

  useReview(side) {
    this.state.reviewsUsed[side]++;
    eventBus.publish(EVENTS.REVIEW_CHALLENGE, { side, used: this.state.reviewsUsed[side] });
  }

  getReviewsLeft(side) {
    return this.state.reviewsAvailable[side] - this.state.reviewsUsed[side];
  }

  // Utility
  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }
}

export const gameState = new GameState();
