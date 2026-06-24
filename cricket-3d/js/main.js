/**
 * Main Game Initialization
 * Entry point for the Cricket 3D game
 */

// Teams data
const TEAMS = [
    {
        name: "Mumbai Indians",
        emoji: "🔵",
        color: 0x0066ff,
        players: ["Rohit Sharma", "Suryakumar Yadav", "Tilak Varma", "Hardik Pandya", "Naman Dhir", "Robin Minz", "Karn Sharma", "Jasprit Bumrah", "Trent Boult", "Deepak Chahar", "Ashwani Kumar"]
    },
    {
        name: "Chennai Super Kings",
        emoji: "🟡",
        color: 0xffdd00,
        players: ["Ruturaj Gaikwad", "Rachin Ravindra", "Shivam Dube", "MS Dhoni", "Ravindra Jadeja", "Sam Curran", "Matheesha Pathirana", "Deepak Chahar", "Noor Ahmad", "Khaleel Ahmed", "Nathan Ellis"]
    },
    {
        name: "Royal Challengers",
        emoji: "🔴",
        color: 0xff0000,
        players: ["Virat Kohli", "Phil Salt", "Rajat Patidar", "Liam Livingstone", "Jitesh Sharma", "Krunal Pandya", "Swapnil Singh", "Bhuvneshwar Kumar", "Josh Hazlewood", "Yash Dayal", "Suyash Sharma"]
    },
    {
        name: "Kolkata Knight Riders",
        emoji: "🟣",
        color: 0x9932cc,
        players: ["Ajinkya Rahane", "Quinton de Kock", "Venkatesh Iyer", "Andre Russell", "Rinku Singh", "Sunil Narine", "Angkrish Raghuvanshi", "Varun Chakravarthy", "Harshit Rana", "Spencer Johnson", "Anrich Nortje"]
    }
];

// Global game instance
let gameInstance = null;

/**
 * Initialize game
 */
function initGame() {
    console.log('🏏 Cricket Champions 3D - Initializing...');

    const canvas = document.getElementById('canvas');

    // Create game
    gameInstance = new CricketGame();
    window.gameInstance = gameInstance;

    // Setup scene
    gameInstance.scene = new GameScene(canvas);
    gameInstance.camera = gameInstance.scene.getCamera();
    gameInstance.camera = new CameraSystem(gameInstance.camera, gameInstance.scene.getScene());

    // Setup effects
    gameInstance.effects = new EffectsManager(gameInstance.scene.getScene());

    // Setup UI
    gameInstance.ui.init();

    // Start game loop
    startGameLoop();

    console.log('✓ Game initialized successfully');
}

/**
 * Start game match
 */
function startGame(mode) {
    console.log(`🎮 Starting ${mode} match...`);

    const team1 = TEAMS[0];
    const team2 = TEAMS[1];

    gameInstance.initMatch(mode, team1, team2);
    gameInstance.ui.updateAll(gameInstance.matchState);
}

/**
 * Game loop
 */
let lastTime = Date.now();
let animationFrameId = null;

function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    // Cap delta time to prevent huge jumps
    const clampedDelta = Math.min(deltaTime, 0.033);

    // Update game logic
    gameInstance.update(clampedDelta);

    // Update camera
    if (gameInstance.camera) {
        gameInstance.camera.updateCamera();
    }

    // Render scene
    gameInstance.render();

    // Schedule next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Start game loop
 */
function startGameLoop() {
    lastTime = Date.now();
    gameLoop();
}

/**
 * Stop game loop
 */
function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

/**
 * Handle window visibility change
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Game paused (window hidden)');
        stopGameLoop();
    } else {
        console.log('Game resumed');
        lastTime = Date.now();
        startGameLoop();
    }
});

/**
 * Graceful shutdown
 */
window.addEventListener('beforeunload', () => {
    stopGameLoop();
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGame,
        startGame,
        gameLoop,
        TEAMS
    };
}
