/**
 * Cricket Champions - Main Entry Point
 * Phase 1 & 2: Modular Architecture + Interactive Gameplay
 *
 * Bootstraps the game, initializes modules, handles game flow
 */

import { gameState } from './core/GameState.js';
import { Renderer } from './core/Renderer.js';
import { controls } from './ui/Controls.js';
import { hud } from './ui/HUD.js';
import { soundManager } from './audio/SoundManager.js';
import { eventBus, EVENTS } from './utils/EventBus.js';
import { match } from './game/Match.js';
import { battingSystem } from './game/Batting.js';
import { bowlingSystem } from './game/Bowling.js';
import { fieldingSystem } from './game/Fielding.js';
import { TEAMS } from './data/teams.js';

// Game loop state
let renderer = null;
let animationId = null;
let lastTime = 0;

/**
 * Initialize the game
 */
async function init() {
  console.log('🏏 Cricket Champions - Phase 2 Initialization');

  // Setup renderer
  renderer = new Renderer('cv');

  // Initialize audio
  await soundManager.init();

  // Setup event listeners
  setupEventListeners();

  // Load initial screen
  showHomeScreen();

  // Start game loop
  startGameLoop();

  console.log('✓ Game initialized successfully');
}

/**
 * Event listener setup
 */
function setupEventListeners() {
  eventBus.subscribe(EVENTS.BALL_PLAYED, (data) => {
    console.log('Ball played:', data);
    if (data.runs >= 4) {
      soundManager.playBoundary();
      eventBus.publish(EVENTS.COMMENTARY_UPDATE, { text: 'BOUNDARY! Great shot!' });
    } else if (data.runs > 0) {
      soundManager.playRun();
    }
  });

  eventBus.subscribe(EVENTS.WICKET, (data) => {
    soundManager.playWicket();
    eventBus.publish(EVENTS.COMMENTARY_UPDATE, { text: `WICKET! ${data.how}` });
  });

  eventBus.subscribe(EVENTS.SCORE_CHANGED, (data) => {
    hud.updateScore(data.score);
  });
}

/**
 * Show home screen
 */
function showHomeScreen() {
  const homeScreen = document.getElementById('homeScreen');
  homeScreen.innerHTML = `
    <h1>🏏 CRICKET CHAMPIONS</h1>
    <p class="sub">Phase 2 - Interactive Gameplay</p>
    <div class="grid">
      <div class="card" onclick="startQuickMatch()">
        <div class="flag">⚡</div>
        <div class="nm">QUICK MATCH</div>
        <div class="full">T20 · Play now</div>
      </div>
    </div>
    <div style="margin-top: 20px; background: #181d27; padding: 15px; border-radius: 10px; max-width: 600px; margin-left: auto; margin-right: auto;">
      <p style="color: #ffb300; font-weight: 700; margin-bottom: 10px;">✓ Phase 2 Features:</p>
      <ul style="color: #9aa3b2; font-size: 13px; text-align: left;">
        <li>✓ Interactive batting (4 shot types)</li>
        <li>✓ Timing system (perfect/good/ok/poor)</li>
        <li>✓ AI bowling (smart delivery selection)</li>
        <li>✓ Full match mechanics (innings, overs, wickets)</li>
        <li>✓ Real-time scoring & commentary</li>
        <li>✓ Fielder positioning</li>
      </ul>
    </div>
  `;
  showScreen('homeScreen');
}

/**
 * Start quick match
 */
function startQuickMatch() {
  console.log('🎮 Starting interactive match...');

  // Setup teams
  const teams = Object.values(TEAMS.ipl);
  const myTeam = teams[Math.floor(Math.random() * teams.length)];
  const oppTeam = teams.find(t => t !== myTeam) || teams[0];

  // Auto-select XI (first 11 players)
  const myXI = myTeam.players.slice(0, 11);
  const oppXI = oppTeam.players.slice(0, 11);

  gameState.setState({
    mode: 'friendly',
    maxOvers: 6, // Quick game - 6 overs
    myKey: myTeam.name,
    myTeam,
    oppKey: oppTeam.name,
    oppTeam,
    myXI,
    oppXI,
    userBatFirst: Math.random() > 0.5,
    inning: 1
  });

  startGameScreen();
}

/**
 * Show game screen and start match
 */
function startGameScreen() {
  showScreen('gameScreen');
  hud.show();

  // Setup match
  match.setupInning();
  fieldingSystem.resetFielders();

  eventBus.publish(EVENTS.COMMENTARY_UPDATE, {
    text: `${gameState.getState().battingTeam.name} batting! Let's go!`
  });

  // Start first ball after delay
  setTimeout(playNextBall, 1500);
}

/**
 * Show/hide screens
 */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

/**
 * Play next ball (AI bowling, player batting)
 */
function playNextBall() {
  const state = gameState.getState();

  if (match.state === 'complete') {
    showResultScreen();
    return;
  }

  // AI bowler selects delivery
  const deliveryType = bowlingSystem.selectDelivery(state.curBowler);

  // Show delivery info
  eventBus.publish(EVENTS.COMMENTARY_UPDATE, {
    text: `${state.curBowler.name} to bowl...`
  });

  // Build controls based on who's batting
  if (state.userBatting) {
    // Player batting - show shot options
    controls.buildBattingControls((shotType) => {
      battingSystem.playShot(shotType, deliveryType);
      setTimeout(playNextBall, 1500);
    });

    // Start timing
    battingSystem.startTiming();
  } else {
    // AI batting
    battingSystem.aiShot(deliveryType);
    setTimeout(playNextBall, 1500);
  }

  // Update HUD
  hud.setBatterInfo(
    state.batStats[state.striker].p.name,
    state.batStats[state.striker].r,
    state.batStats[state.striker].b
  );
}

/**
 * Show result screen
 */
function showResultScreen() {
  const i1 = gameState.getState().inning1;
  const i2 = gameState.getState().inning2;

  let result = '';
  if (i2.score >= i1.score) {
    result = `${i2.team.name} won by ${10 - i2.wkts} wickets!`;
  } else {
    result = `${i1.team.name} won by ${i1.score - i2.score} runs!`;
  }

  document.getElementById('resultScreen').innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <h1 style="color: #ffb300; font-size: 36px; margin-bottom: 20px;">🏆 MATCH COMPLETE</h1>
      <div style="background: #181d27; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <p style="font-size: 24px; color: #fff; margin-bottom: 10px;">${result}</p>
        <p style="color: #9aa3b2;">Innings 1: ${i1.score}/${i1.wkts} | Innings 2: ${i2.score}/${i2.wkts}</p>
      </div>
      <button class="btn" onclick="location.reload()" style="margin-top: 20px;">🔄 Play Again</button>
    </div>
  `;
  showScreen('resultScreen');
}

/**
 * Game loop - Render scene every frame
 */
function startGameLoop() {
  function loop(ts) {
    const dt = Math.min(40, ts - lastTime);
    lastTime = ts;

    renderer.clear();
    renderer.drawScene(gameState.getState());

    // Update timing system
    if (battingSystem.timingActive) {
      battingSystem.updateTiming(dt);
    }

    // Draw fielders
    const fielders = fieldingSystem.getAllFielders();
    fielders.forEach((f, i) => {
      const x = f.fx * renderer.W;
      const y = renderer.getPitchTop() + f.fy * (renderer.getPitchBot() - renderer.getPitchTop());
      const color = '#1a3a8a';
      renderer.drawStick(x, y, 0.5, { legs: 0.1, arm: 0.2 }, color);
    });

    // Draw timing bar if active
    if (battingSystem.timingActive) {
      const barY = renderer.getPitchBot() + 20;
      renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      renderer.ctx.fillRect(renderer.W * 0.25, barY, renderer.W * 0.5, 15);
    }

    animationId = requestAnimationFrame(loop);
  }
  animationId = requestAnimationFrame(loop);
}

/**
 * Cleanup
 */
function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
}

// Expose to window for inline onclick handlers
window.startQuickMatch = startQuickMatch;
window.startFriendlyMatch = startFriendlyMatch;
window.showScreen = showScreen;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Cleanup on unload
window.addEventListener('beforeunload', cleanup);
