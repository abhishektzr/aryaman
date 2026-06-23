/**
 * Bowling - Bowling mechanics and AI delivery selection
 * Handles delivery types and bowler strategy
 */

import { gameState } from '../core/GameState.js';

const PACE_DELIVERIES = [
  { emoji: '⚡', name: 'FAST', hint: 'Good length' },
  { emoji: '💥', name: 'BOUNCER', hint: 'Short pitch' },
  { emoji: '🎯', name: 'YORKER', hint: 'At toes' },
  { emoji: '↙️', name: 'INSWING', hint: 'Swings in' },
  { emoji: '↗️', name: 'OUTSWING', hint: 'Swings out' }
];

const SPIN_DELIVERIES = [
  { emoji: '🔄', name: 'OFF-BREAK', hint: 'Turns away' },
  { emoji: '🌀', name: 'LEG-SPIN', hint: 'Turns in' },
  { emoji: '🎭', name: 'GOOGLY', hint: 'Wrong un!' },
  { emoji: '🔀', name: 'DOOSRA', hint: 'Other way' },
  { emoji: '⬇️', name: 'FLIPPER', hint: 'Skids on' }
];

export class BowlingSystem {
  isSpin(bowler) {
    if (!bowler) return false;
    const spinBowlers = [
      'Kuldeep', 'Ashwin', 'Jadeja', 'Chahal', 'Patel',
      'Narine', 'Santner', 'Hasaranga', 'Theekshana', 'Zampa',
      'Sodhi', 'Rashid', 'Maharaj', 'Shamsi', 'Chakravarthy'
    ];
    return bowler.bowl >= 70 && spinBowlers.some(n => bowler.name.includes(n));
  }

  getDeliveries(bowler) {
    return this.isSpin(bowler) ? SPIN_DELIVERIES : PACE_DELIVERIES;
  }

  selectDelivery(bowler) {
    const state = gameState.getState();
    const isSpin = this.isSpin(bowler);

    // AI strategy
    const over = Math.floor(state.balls / 6) % 6; // Over number in powerplay/middle/death
    const ballInOver = state.balls % 6; // Ball number in this over

    // Death overs (last 2 overs)
    if (state.inning === 2 && state.maxOvers * 6 - state.balls <= 12) {
      return isSpin ? 'GOOGLY' : 'YORKER';
    }

    // Powerplay (first 6 overs)
    if (over < 6) {
      return isSpin ? 'OFF-BREAK' : 'FAST';
    }

    // Random mix
    const options = this.getDeliveries(bowler).map(d => d.name);
    return options[Math.floor(Math.random() * options.length)];
  }
}

export const bowlingSystem = new BowlingSystem();
