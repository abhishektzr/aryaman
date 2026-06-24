/**
 * Main Game Initialization and Loop
 * Complete game initialization, team data, and main game loop control
 * ~350+ lines of game setup and control logic
 */

// ============================================
// TEAM DATA - All Available Cricket Teams
// ============================================
const TEAMS = [
    {
        id: 1,
        name: "Mumbai Indians",
        emoji: "🔵",
        color: 0x0066ff,
        shortName: "MI",
        players: [
            "Rohit Sharma", "Suryakumar Yadav", "Tilak Varma", "Hardik Pandya",
            "Naman Dhir", "Robin Minz", "Karn Sharma", "Jasprit Bumrah",
            "Trent Boult", "Deepak Chahar", "Ashwani Kumar"
        ],
        logo: "🔵"
    },
    {
        id: 2,
        name: "Chennai Super Kings",
        emoji: "🟡",
        color: 0xffdd00,
        shortName: "CSK",
        players: [
            "Ruturaj Gaikwad", "Rachin Ravindra", "Shivam Dube", "MS Dhoni",
            "Ravindra Jadeja", "Sam Curran", "Matheesha Pathirana", "Deepak Chahar",
            "Noor Ahmad", "Khaleel Ahmed", "Nathan Ellis"
        ],
        logo: "🟡"
    },
    {
        id: 3,
        name: "Royal Challengers Bangalore",
        emoji: "🔴",
        color: 0xff0000,
        shortName: "RCB",
        players: [
            "Virat Kohli", "Phil Salt", "Rajat Patidar", "Liam Livingstone",
            "Jitesh Sharma", "Krunal Pandya", "Swapnil Singh", "Bhuvneshwar Kumar",
            "Josh Hazlewood", "Yash Dayal", "Suyash Sharma"
        ],
        logo: "🔴"
    },
    {
        id: 4,
        name: "Kolkata Knight Riders",
        emoji: "🟣",
        color: 0x9932cc,
        shortName: "KKR",
        players: [
            "Ajinkya Rahane", "Quinton de Kock", "Venkatesh Iyer", "Andre Russell",
            "Rinku Singh", "Sunil Narine", "Angkrish Raghuvanshi", "Varun Chakravarthy",
            "Harshit Rana", "Spencer Johnson", "Anrich Nortje"
        ],
        logo: "🟣"
    },
    {
        id: 5,
        name: "Delhi Capitals",
        emoji: "🔵🔴",
        color: 0x0033cc,
        shortName: "DC",
        players: [
            "Rishabh Pant", "David Warner", "Prithvi Shaw", "Amogh Vardekar",
            "Shai Hope", "Abhinav Manohar", "Kuldeep Yadav", "Axar Patel",
            "Mustafizur Rahman", "Khalil Ahmed", "Chetan Sakariya"
        ],
        logo: "🔵🔴"
    }
];

// ============================================
// GAME MODE CONFIGURATION
// ============================================
const GAME_MODES = {
    quick: { overs: 5, name: "Quick Match", icon: "⚡", balls: 30 },
    t20: { overs: 20, name: "T20", icon: "🎯", balls: 120 },
    odi: { overs: 50, name: "ODI", icon: "📊", balls: 300 },
    test: { overs: 90, name: "Test Match", icon: "🏆", balls: 540 }
};

// ============================================
// GLOBAL GAME STATE
// ============================================
let gameInstance = null;
let gameState = {
    initialized: false,
    running: false,
    paused: false,
    currentMode: null
};

// Frame timing
let lastTime = Date.now();
let animationFrameId = null;
let frameCount = 0;
let fps = 60;

/**
 * Initialize the game - called on page load
 */
function initGame() {
    try {
        console.log('🏏 Cricket Champions 3D - Professional Simulator');
        console.log('Initializing game systems...');

        // Get canvas
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }

        // Create game instance
        gameInstance = new CricketGame();
        window.gameInstance = gameInstance;
        console.log('✓ Game instance created');

        // Initialize 3D scene
        try {
            gameInstance.scene = new GameScene(canvas);
            gameInstance.renderer = gameInstance.scene.getRenderer();
            console.log('✓ 3D Scene initialized');
        } catch (error) {
            console.error('❌ Scene initialization failed:', error);
            throw error;
        }

        // Initialize camera system
        try {
            const camera = gameInstance.scene.getCamera();
            gameInstance.cameraSystem = new CameraSystem(camera, gameInstance.scene.getScene());
            console.log('✓ Camera system initialized');
        } catch (error) {
            console.error('❌ Camera system failed:', error);
        }

        // Initialize animation controller
        try {
            gameInstance.animationController = new AnimationController();
            console.log('✓ Animation system initialized');
        } catch (error) {
            console.error('❌ Animation system failed:', error);
        }

        // Initialize UI
        try {
            gameInstance.ui.init();
            console.log('✓ UI system initialized');
        } catch (error) {
            console.error('❌ UI system failed:', error);
        }

        // Setup event listeners
        setupEventListeners();

        // Start game loop
        startGameLoop();
        gameState.initialized = true;

        console.log('✅ Game initialization complete!');
        console.log('Ready to start match. Click game mode to begin.');

    } catch (error) {
        console.error('❌ Critical initialization error:', error);
        alert('Failed to initialize game. Check console for details.');
    }
}

/**
 * Setup event listeners for input and window events
 */
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
        if (gameInstance && gameInstance.scene) {
            gameInstance.scene.onWindowResize();
        }
    });

    // Visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('⏸️  Game paused');
            gameState.paused = true;
        } else {
            console.log('▶️ Game resumed');
            gameState.paused = false;
            lastTime = Date.now();
        }
    });

    // Keyboard input
    document.addEventListener('keydown', (event) => {
        handleKeyPress(event);
    });

    // Graceful shutdown
    window.addEventListener('beforeunload', () => {
        stopGameLoop();
    });
}

/**
 * Handle keyboard input
 */
function handleKeyPress(event) {
    if (!gameInstance || !gameInstance.matchState.isGameActive) return;

    const key = event.key;

    // Shot selection (1-9)
    if (key >= '1' && key <= '9') {
        const shotIndex = parseInt(key) - 1;
        gameInstance.playShot(shotIndex);
    }

    // Space to confirm/play
    if (key === ' ') {
        event.preventDefault();
        // Could be used for timing bar confirmation
    }

    // 'p' for pause
    if (key === 'p') {
        gameState.paused = !gameState.paused;
    }

    // 'r' for restart
    if (key === 'r') {
        console.log('Restarting match...');
        location.reload();
    }
}

/**
 * Start a new match
 */
function startGame(mode) {
    if (!gameInstance) {
        console.error('Game not initialized');
        return;
    }

    try {
        console.log(`🎮 Starting ${mode.toUpperCase()} match...`);

        const team1Index = Math.floor(Math.random() * TEAMS.length);
        let team2Index = Math.floor(Math.random() * TEAMS.length);
        while (team2Index === team1Index) {
            team2Index = Math.floor(Math.random() * TEAMS.length);
        }

        const team1 = TEAMS[team1Index];
        const team2 = TEAMS[team2Index];

        gameInstance.initMatch(mode, team1, team2);
        gameInstance.ui.updateAll(gameInstance.matchState);
        gameState.currentMode = mode;

        console.log(`Match: ${team1.name} vs ${team2.name}`);

    } catch (error) {
        console.error('Failed to start match:', error);
    }
}

/**
 * Main game loop - called every frame
 */
function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    // Cap delta time to prevent physics issues
    const clampedDelta = Math.min(deltaTime, 0.033);

    // Skip update if paused
    if (!gameState.paused && gameInstance) {
        // Update game logic
        gameInstance.update(clampedDelta);

        // Update camera
        if (gameInstance.cameraSystem) {
            gameInstance.cameraSystem.updateCamera();
        }

        // Render scene
        if (gameInstance.renderer && gameInstance.scene) {
            gameInstance.render();
        }
    }

    frameCount++;

    // Schedule next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Start the game loop
 */
function startGameLoop() {
    if (gameState.running) return;

    console.log('Starting game loop...');
    lastTime = Date.now();
    frameCount = 0;
    gameState.running = true;
    gameLoop();
}

/**
 * Stop the game loop
 */
function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        gameState.running = false;
        console.log('Game loop stopped');
    }
}

/**
 * Get game stats
 */
function getGameStats() {
    return {
        frameCount,
        fps: Math.round(frameCount / ((Date.now() - (lastTime - frameCount * 16.67)) / 1000)),
        gameState,
        matchState: gameInstance ? gameInstance.matchState : null
    };
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize on page load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // Page already loaded
    initGame();
}

// Export for testing and external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGame,
        startGame,
        TEAMS,
        GAME_MODES,
        getGameStats
    };
}
