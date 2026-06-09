/**
 * Cricket Champions - Main Entry Point
 * Phase 1 Modular Architecture
 *
 * Bootstraps the game, initializes modules, sets up event listeners
 */

import { gameState } from './core/GameState.js';
import { Renderer } from './core/Renderer.js';
import { controls } from './ui/Controls.js';
import { hud } from './ui/HUD.js';
import { soundManager } from './audio/SoundManager.js';
import { eventBus, EVENTS } from './utils/EventBus.js';

// Game loop state
let renderer = null;
let animationId = null;

/**
 * Initialize the game
 */
async function init() {
  console.log('🏏 Cricket Champions - Phase 1 Initialization');

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
    <p class="sub">Phase 1 - Modular Architecture</p>
    <div class="grid">
      <div class="card" onclick="window.playMode = 'quick'; startQuickMatch()">
        <div class="flag">⚡</div>
        <div class="nm">QUICK MATCH</div>
        <div class="full">T20 · Fast game</div>
      </div>
      <div class="card" onclick="window.playMode = 'friendly'; startFriendlyMatch()">
        <div class="flag">🤝</div>
        <div class="nm">FRIENDLY</div>
        <div class="full">Pick teams</div>
      </div>
    </div>
    <div style="margin-top: 20px; background: #181d27; padding: 15px; border-radius: 10px; max-width: 600px; margin-left: auto; margin-right: auto;">
      <p style="color: #ffb300; font-weight: 700; margin-bottom: 10px;">✓ Phase 1 Complete:</p>
      <ul style="color: #9aa3b2; font-size: 13px; text-align: left;">
        <li>✓ Modular codebase (GameState, Renderer, Controls, HUD, Audio)</li>
        <li>✓ EventBus for decoupled communication</li>
        <li>✓ SoundManager with Web Audio API</li>
        <li>✓ Mobile-optimized controls</li>
        <li>✓ Vite bundler configuration</li>
      </ul>
    </div>
  `;
  showScreen('homeScreen');
}

/**
 * Start quick match
 */
function startQuickMatch() {
  console.log('Starting quick match...');
  gameState.setState({
    mode: 'friendly',
    maxOvers: 20,
    userBatFirst: Math.random() > 0.5,
  });
  startGameScreen();
}

/**
 * Start friendly match (will implement full selection in Phase 2)
 */
function startFriendlyMatch() {
  console.log('Starting friendly match...');
  startQuickMatch();
}

/**
 * Show game screen and start match
 */
function startGameScreen() {
  showScreen('gameScreen');
  eventBus.publish(EVENTS.COMMENTARY_UPDATE, { text: 'Welcome to the match!' });

  // Simulate a ball being played for demo
  setTimeout(() => {
    eventBus.publish(EVENTS.BALL_PLAYED, { runs: 4, shots: 'DRIVE' });
  }, 1000);
}

/**
 * Show/hide screens
 */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

/**
 * Game loop - Render scene every frame
 */
function startGameLoop() {
  function loop() {
    renderer.clear();
    renderer.drawScene(gameState.getState());
    animationId = requestAnimationFrame(loop);
  }
  loop();
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
