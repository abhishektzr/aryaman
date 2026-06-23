/**
 * Match - Match orchestration and ball-by-ball logic
 * Manages innings flow, batting, bowling, and scoring
 */

import { gameState } from '../core/GameState.js';
import { eventBus, EVENTS } from '../utils/EventBus.js';

export class Match {
  constructor() {
    this.state = 'idle'; // idle, innings1, innings2, complete
    this.currentBall = null;
    this.ballInFlight = false;
  }

  setupInning() {
    const state = gameState.getState();

    // Determine who bats first
    const userBatting = (state.inning === 1) ? state.userBatFirst : !state.userBatFirst;

    gameState.setState({
      userBatting,
      score: 0,
      wkts: 0,
      balls: 0,
      fow: [],
      lastBallOver: -1,
      striker: 0,
      nonstriker: 1,
    });

    // Initialize batting stats
    const battingXI = userBatting ? state.myXI : state.oppXI;
    gameState.setState({
      batStats: battingXI.map(p => ({
        p,
        r: 0,
        b: 0,
        fours: 0,
        sixes: 0,
        out: false,
        how: 'not out'
      }))
    });

    // Initialize bowling stats
    const bowlingXI = userBatting ? state.oppXI : state.myXI;
    gameState.setState({
      bowlStats: bowlingXI.map(p => ({
        p,
        balls: 0,
        runs: 0,
        wkts: 0
      }))
    });

    // Pick bowlers
    const bowlers = bowlingXI
      .filter(p => p.role === 'BOWL' || p.role === 'ALL')
      .sort((a, b) => b.bowl - a.bowl);

    gameState.setState({
      bowlers,
      curBowler: bowlers[0],
      battingXI,
      bowlingXI,
      battingTeam: userBatting ? state.myTeam : state.oppTeam,
      bowlingTeam: userBatting ? state.oppTeam : state.myTeam,
    });

    gameState.setInning(state.inning);
    eventBus.publish(EVENTS.INNING_START, { inning: state.inning });

    this.state = `innings${state.inning}`;
    console.log(`📋 Inning ${state.inning} setup complete`);
  }

  playBall(shotType, deliveryType, timing) {
    if (this.ballInFlight) return;

    const state = gameState.getState();
    const batter = state.batStats[state.striker];

    // Resolve outcome
    const outcome = this.resolveOutcome(shotType, deliveryType, timing, batter.p);

    // Update stats
    batter.b++;
    gameState.advanceBall();

    if (outcome.runs > 0) {
      batter.r += outcome.runs;
      gameState.setScore(outcome.runs);

      if (outcome.runs === 4) batter.fours++;
      if (outcome.runs === 6) batter.sixes++;

      // Swap batsmen on odd runs
      if (outcome.runs % 2 === 1) {
        gameState.swapBatsmen();
      }

      eventBus.publish(EVENTS.BALL_PLAYED, { runs: outcome.runs, shot: shotType });
      if (outcome.runs >= 4) eventBus.publish(EVENTS.BOUNDARY, { runs: outcome.runs });

    } else if (outcome.wicket) {
      gameState.addWicket(batter, outcome.how);
      eventBus.publish(EVENTS.WICKET, { how: outcome.how, batter: batter.p.name });

      // Next batter
      const nextIdx = Math.max(state.striker, state.nonstriker) + 1;
      if (nextIdx < 11 && state.wkts < 10) {
        gameState.setState({ striker: nextIdx });
      }
    } else {
      eventBus.publish(EVENTS.DOT_BALL, {});
    }

    // Check over change
    if (state.balls % 6 === 0 && state.balls > 0) {
      gameState.swapBatsmen();
      const newBowler = this.getNextBowler();
      gameState.setState({ curBowler: newBowler });
      eventBus.publish(EVENTS.BOWLER_CHANGED, { bowler: newBowler.name });
    }

    // Check end of innings
    if (state.balls >= state.maxOvers * 6 || state.wkts >= 10) {
      this.endInning();
    }
  }

  resolveOutcome(shot, delivery, timing, player) {
    // Timing quality
    const timingMult = { perfect: 1.0, good: 0.72, ok: 0.42, poor: 0.12 }[timing] || 0.3;

    // Player skill
    const skill = player.bat / 100;

    // Shot vs delivery matchup
    const shotTraits = {
      'DEFEND': { power: 0.4, wicketRisk: 0.05 },
      'DRIVE': { power: 0.75, wicketRisk: 0.12 },
      'CUT': { power: 0.65, wicketRisk: 0.15 },
      'LOFT': { power: 0.85, wicketRisk: 0.25 }
    };

    const deliveryTraits = {
      'FAST': { effectiveness: 0.8, wicketBase: 0.08 },
      'BOUNCER': { effectiveness: 0.6, wicketBase: 0.12 },
      'YORKER': { effectiveness: 0.9, wicketBase: 0.18 },
      'INSWING': { effectiveness: 0.75, wicketBase: 0.10 },
      'OUTSWING': { effectiveness: 0.75, wicketBase: 0.09 },
      'OFF-BREAK': { effectiveness: 0.7, wicketBase: 0.10 },
      'LEG-SPIN': { effectiveness: 0.7, wicketBase: 0.11 },
      'GOOGLY': { effectiveness: 0.8, wicketBase: 0.16 },
      'DOOSRA': { effectiveness: 0.8, wicketBase: 0.15 },
      'FLIPPER': { effectiveness: 0.75, wicketBase: 0.14 }
    };

    const shotTrait = shotTraits[shot] || { power: 0.5, wicketRisk: 0.1 };
    const delivTrait = deliveryTraits[delivery] || { effectiveness: 0.7, wicketBase: 0.1 };

    // Wicket chance
    let wicketChance = delivTrait.wicketBase * (1 - skill * 0.3) + shotTrait.wicketRisk * (1 - timingMult);
    wicketChance = Math.max(0.01, Math.min(0.5, wicketChance));

    if (Math.random() < wicketChance) {
      const how = ['bowled', 'caught', 'lbw'][Math.floor(Math.random() * 3)];
      return { runs: 0, wicket: true, how };
    }

    // Run scoring
    const power = shotTrait.power * timingMult * skill;
    const rand = Math.random();

    let runs = 0;
    if (shot === 'DEFEND') {
      runs = rand < 0.2 ? 1 : 0;
    } else if (shot === 'LOFT') {
      if (power > 0.6 && rand < 0.4) runs = 6;
      else if (power > 0.4 && rand < 0.6) runs = 4;
      else if (power > 0.2) runs = rand < 0.5 ? 2 : 1;
      else runs = rand < 0.3 ? 1 : 0;
    } else if (shot === 'DRIVE') {
      if (power > 0.65 && rand < 0.5) runs = 4;
      else if (power > 0.4) runs = [1, 2, 2, 3][Math.floor(rand * 4)];
      else runs = rand < 0.4 ? 1 : 0;
    } else { // CUT
      if (power > 0.65 && rand < 0.45) runs = 4;
      else if (power > 0.4) runs = [1, 1, 2][Math.floor(rand * 3)];
      else runs = rand < 0.3 ? 1 : 0;
    }

    return { runs, wicket: false };
  }

  getNextBowler() {
    const state = gameState.getState();
    const over = Math.floor(state.balls / 6);
    return state.bowlers[over % state.bowlers.length];
  }

  endInning() {
    const state = gameState.getState();
    gameState.endInning();

    if (state.inning === 1) {
      console.log(`📊 Innings 1 end: ${state.score}/${state.wkts}`);
      this.state = 'innings2';
      setTimeout(() => {
        gameState.setState({ inning: 2, score: 0, wkts: 0, balls: 0, fow: [] });
        this.setupInning();
      }, 2000);
    } else {
      console.log(`🏁 Match complete!`);
      this.state = 'complete';
      eventBus.publish(EVENTS.MATCH_END, {
        inning1: state.inning1,
        inning2: state.inning2
      });
    }
  }
}

export const match = new Match();
