/**
 * Cricket Game - Main Game Logic
 * Comprehensive game state management, match simulation, and game flow control
 * ~400+ lines of complete game functionality
 */

class CricketGame {
    constructor() {
        this.matchState = {
            // Match configuration
            mode: 't20',
            maxOvers: 20,
            inning: 1,
            balls: 0,
            score: 0,
            wickets: 0,
            runs: 0,
            striker: 0,
            nonStriker: 1,
            bowler: 0,
            target: null,

            // Team data
            team1: null,
            team2: null,
            batStats: [],
            bowlStats: [],
            opposition: { score: 0, wickets: 0, balls: 0 },

            // Game state
            isGameActive: false,
            strikeRate: 0,
            runRate: 0,
            requiredRunRate: 0,
            fieldingPositions: [],

            // Advanced stats
            boundaries: { fours: 0, sixes: 0 },
            dotBalls: 0,
            wides: 0,
            noBalls: 0,
            matchPhase: 'powerplay',

            // Toss and innings
            tossCalled: null,
            tossWinner: null,
            choosedToBat: null,
            currentBattingTeam: null,
            currentBowlingTeam: null,
        };

        // 3D Objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ball = null;
        this.batter = null;
        this.bowler = null;
        this.fielders = [];
        this.wickets = { home: null, away: null };

        // Game systems
        this.physics = new CricketPhysics();
        this.ai = new CricketAI();
        this.effects = null;
        this.ui = new UIManager();
        this.input = new InputManager();
        this.animationController = new AnimationController();
        this.cameraSystem = null;

        // Ball tracking
        this.ballInPlay = false;
        this.ballPosition = new THREE.Vector3(0, 2, -15);
        this.ballVelocity = new THREE.Vector3(0, 0, 0);
        this.lastBallResult = null;
        this.ballTrajectory = null;
        this.ballInFlight = false;
        this.trajectoryPoints = [];

        // Timing and delivery
        this.currentDelivery = null;
        this.deliveryType = 'fast';
        this.ballSpeed = 85;
        this.spinAmount = 0;
        this.isOutcome = null;

        // Commentary and narrative
        this.lastCommentary = '';
        this.commentaryQueue = [];
        this.soundEffectsEnabled = true;

        // Frame timing
        this.frameCount = 0;
        this.animationTime = 0;

        // Player animations
        this.bowlingAnimation = null;
        this.battingAnimation = null;
        this.fieldingAnimation = null;

        window.gameInstance = this;
    }

    /**
     * Initialize a new match
     */
    initMatch(mode, team1, team2) {
        this.matchState.mode = mode;
        this.matchState.team1 = team1;
        this.matchState.team2 = team2;
        this.matchState.currentBattingTeam = team1;
        this.matchState.currentBowlingTeam = team2;

        // Set overs based on mode
        const oversByMode = { quick: 5, t20: 20, odi: 50, test: 15 };
        this.matchState.maxOvers = oversByMode[mode] || 20;

        // Initialize batting statistics
        this.matchState.batStats = team1.players.map(name => ({
            name,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false,
            howOut: null,
            strikeRate: 0,
            position: 0,
            isStriker: false,
            boundaries: 0,
        }));

        // Initialize bowling statistics
        this.matchState.bowlStats = team2.players.map(name => ({
            name,
            balls: 0,
            runs: 0,
            wickets: 0,
            maidens: 0,
            economy: 0,
            averageSpeed: 85,
            variations: [],
            overs: 0,
        }));

        // Mark strikers
        if (this.matchState.batStats[0]) this.matchState.batStats[0].isStriker = true;
        if (this.matchState.batStats[1]) this.matchState.batStats[1].isStriker = false;

        this.matchState.isGameActive = true;
        this.matchState.balls = 0;
        this.matchState.score = 0;
        this.matchState.wickets = 0;
        this.matchState.inning = 1;

        this.ui.updateAll(this.matchState);
        this.ui.hideMenu();

        console.log(`Match initialized: ${team1.name} vs ${team2.name} (${mode.toUpperCase()})`);
    }

    /**
     * Handle coin toss result
     */
    handleToss(choice, team1, team2) {
        const tossCoin = Math.random() > 0.5 ? 'heads' : 'tails';
        const tossWinner = tossCoin === choice ? team1 : team2;
        const choseBat = Math.random() > 0.5;

        this.matchState.tossCalled = choice;
        this.matchState.tossWinner = tossWinner;
        this.matchState.choosedToBat = choseBat;

        if (choseBat) {
            this.matchState.currentBattingTeam = tossWinner;
            this.matchState.currentBowlingTeam = tossWinner === team1 ? team2 : team1;
        } else {
            this.matchState.currentBowlingTeam = tossWinner;
            this.matchState.currentBattingTeam = tossWinner === team1 ? team2 : team1;
        }

        const action = choseBat ? 'chose to bat' : 'chose to bowl';
        this.ui.addCommentary(`🪙 ${tossWinner.name} won the toss and ${action}!`);
    }

    /**
     * Execute a batting shot
     */
    playShot(shotIndex) {
        if (!this.matchState.isGameActive) return false;
        if (this.ballInPlay) return false;

        const shots = [
            { name: 'Cover Drive', emoji: '⚽', power: 0.85, angle: 45, direction: 1 },
            { name: 'Straight Drive', emoji: '↗️', power: 0.90, angle: 0, direction: 0 },
            { name: 'Flick', emoji: '←', power: 0.65, angle: -30, direction: -1 },
            { name: 'Pull', emoji: '⬇️', power: 0.95, angle: 90, direction: 1.5 },
            { name: 'Hook', emoji: '⬅️', power: 1.0, angle: 85, direction: 1.3 },
            { name: 'Cut', emoji: '↘️', power: 0.80, angle: 60, direction: 1.2 },
            { name: 'Sweep', emoji: '⤴️', power: 0.70, angle: -60, direction: -1.5 },
            { name: 'Reverse Sweep', emoji: '⤵️', power: 0.60, angle: -45, direction: -1.2 },
            { name: 'Upper Cut', emoji: '📈', power: 0.85, angle: 70, direction: 1.1 },
            { name: 'Lofted Drive', emoji: '🔺', power: 0.80, angle: 30, direction: 0.8 },
            { name: 'Paddle Sweep', emoji: '🎪', power: 0.55, angle: -50, direction: -1.3 },
            { name: 'Ramp', emoji: '⬆️', power: 0.65, angle: -20, direction: -0.5 },
            { name: 'Helicopter', emoji: '🚁', power: 0.95, angle: 50, direction: 1.4 },
            { name: 'Defend', emoji: '🛡️', power: 0.30, angle: 0, direction: 0 },
            { name: 'Leave', emoji: '🚶', power: 0, angle: 0, direction: 0 },
        ];

        const shot = shots[shotIndex];
        if (!shot) return false;

        // Play batting animation
        this.playBattingAnimation(shot);

        // Calculate outcome
        this.calculateBallResult(shot);

        return true;
    }

    /**
     * Calculate ball result after shot
     */
    calculateBallResult(shot) {
        const striker = this.matchState.batStats[this.matchState.striker];
        const bowler = this.matchState.bowlStats[this.matchState.bowler];

        // Probability of wicket based on shot quality and bowler skill
        const wicketChance = (1 - shot.power) * 0.3 + Math.random() * 0.1;
        const isWicket = Math.random() < wicketChance;

        // Calculate runs
        let runsScored = 0;
        if (!isWicket) {
            const contactQuality = shot.power + (Math.random() * 0.2 - 0.1);
            if (contactQuality > 0.9) {
                runsScored = Math.random() > 0.7 ? 6 : 4; // Boundary
            } else if (contactQuality > 0.7) {
                runsScored = Math.floor(Math.random() * 3) + 1; // 1-3 runs
            } else if (contactQuality > 0.5) {
                runsScored = Math.floor(Math.random() * 2); // 0-1 runs
            }
        }

        // Update statistics
        striker.balls += 1;
        striker.runs += runsScored;
        striker.strikeRate = (striker.runs / striker.balls * 100).toFixed(2);

        if (runsScored === 4) {
            striker.fours += 1;
            this.matchState.boundaries.fours += 1;
        } else if (runsScored === 6) {
            striker.sixes += 1;
            this.matchState.boundaries.sixes += 1;
        }

        bowler.balls += 1;
        bowler.runs += runsScored;
        bowler.economy = (bowler.runs / (bowler.balls / 6)).toFixed(2);

        this.matchState.balls += 1;
        this.matchState.score += runsScored;
        this.matchState.runs += runsScored;

        // Handle wicket
        if (isWicket && !shot.power) {
            striker.out = true;
            striker.howOut = 'bowled';
            this.matchState.wickets += 1;
            bowler.wickets += 1;
            this.rotateStrike();
        } else if (runsScored % 2 === 1) {
            this.rotateStrike();
        }

        // Generate commentary
        let commentary = `${striker.name} ${shot.name}`;
        if (isWicket && shot.power) {
            commentary += ` - WICKET! ${striker.howOut.toUpperCase()}`;
        } else if (runsScored === 6) {
            commentary += ` - SIX! 🔥`;
        } else if (runsScored === 4) {
            commentary += ` - FOUR! 💥`;
        } else if (runsScored > 0) {
            commentary += ` - ${runsScored} runs`;
        } else {
            commentary += ` - DOT BALL`;
        }

        this.ui.addCommentary(commentary);
        this.ui.updateAll(this.matchState);

        // Check if over is complete
        if (this.matchState.balls % 6 === 0) {
            this.completeOver();
        }
    }

    /**
     * Complete an over
     */
    completeOver() {
        const overNumber = Math.floor(this.matchState.balls / 6);
        const bowler = this.matchState.bowlStats[this.matchState.bowler];

        this.ui.addCommentary(`📊 Over ${overNumber} complete. ${bowler.name} has taken ${bowler.wickets} wicket(s)`);

        // Change bowler (simplified AI)
        this.matchState.bowler = (this.matchState.bowler + 1) % this.matchState.bowlStats.length;

        // Check if match is complete
        if (overNumber >= this.matchState.maxOvers) {
            this.endInning();
        }
    }

    /**
     * Rotate strike between batters
     */
    rotateStrike() {
        const temp = this.matchState.striker;
        this.matchState.striker = this.matchState.nonStriker;
        this.matchState.nonStriker = temp;
    }

    /**
     * End current inning
     */
    endInning() {
        if (this.matchState.inning === 1) {
            this.matchState.inning = 2;
            this.matchState.opposition.score = this.matchState.score;
            this.matchState.opposition.wickets = this.matchState.wickets;
            this.matchState.target = this.matchState.score + 1;

            // Swap teams
            const tempTeam = this.matchState.team1;
            this.matchState.team1 = this.matchState.team2;
            this.matchState.team2 = tempTeam;

            // Reset innings
            this.matchState.score = 0;
            this.matchState.wickets = 0;
            this.matchState.balls = 0;

            this.ui.addCommentary(`End of Inning 1. ${this.matchState.opposition.score}/${this.matchState.opposition.wickets} in ${this.matchState.maxOvers} overs`);
        } else {
            this.endMatch();
        }
    }

    /**
     * End the match
     */
    endMatch() {
        this.matchState.isGameActive = false;

        let result = '';
        if (this.matchState.score > this.matchState.opposition.score) {
            result = `${this.matchState.team1.name} WON by ${this.matchState.wickets} wickets!`;
        } else if (this.matchState.score < this.matchState.opposition.score) {
            result = `${this.matchState.team2.name} WON by ${this.matchState.opposition.wickets - this.matchState.wickets} runs!`;
        } else {
            result = 'MATCH TIED!';
        }

        this.ui.addCommentary(`🏆 MATCH OVER! ${result}`);
        this.ui.showMenu();
    }

    /**
     * Play bowling animation
     */
    playBowlingAnimation(delivery) {
        if (!this.bowler) return;

        const animationType = delivery === 'fast' ? 'fastBowl' : 'spinBowl';

        if (this.animationController) {
            this.animationController.play(animationType, 1.0);
        }
    }

    /**
     * Play batting animation
     */
    playBattingAnimation(shot) {
        if (!this.batter) return;

        const shotAnimations = {
            'drive': 'driveBat',
            'pull': 'pullBat',
            'cut': 'cutBat',
            'sweep': 'sweepBat',
            'defend': 'defendBat'
        };

        if (this.animationController) {
            this.animationController.play('battingShot', 0.8);
        }
    }

    /**
     * Update game state each frame
     */
    update(deltaTime) {
        if (!this.matchState.isGameActive) return;

        this.frameCount++;
        this.animationTime += deltaTime;

        // Update animations
        if (this.animationController) {
            this.animationController.update(deltaTime);
        }

        // Update ball physics
        if (this.ballInFlight) {
            this.updateBallPhysics(deltaTime);
        }

        // Update player positions
        this.updatePlayerPositions(deltaTime);

        // Update camera
        if (this.cameraSystem) {
            this.cameraSystem.updateCamera();
        }
    }

    /**
     * Update ball physics simulation
     */
    updateBallPhysics(deltaTime) {
        if (!this.ballPosition) return;

        // Apply gravity
        this.ballVelocity.y -= 9.81 * deltaTime;

        // Apply air resistance
        this.ballVelocity.multiplyScalar(0.98);

        // Update position
        this.ballPosition.addScaledVector(this.ballVelocity, deltaTime);

        // Check boundaries
        if (this.ballPosition.y < 0) {
            this.ballInFlight = false;
        }

        // Update 3D ball position
        if (this.ball) {
            this.ball.position.copy(this.ballPosition);
        }
    }

    /**
     * Update player animations and positions
     */
    updatePlayerPositions(deltaTime) {
        // Animate bowler if bowling
        // Animate batter if batting
        // Animate fielders based on ball position
    }

    /**
     * Render game
     */
    render() {
        if (this.scene && this.scene.renderer) {
            this.scene.renderer.render(this.scene.scene, this.camera);
        }
    }

    /**
     * Get current match state
     */
    getMatchState() {
        return this.matchState;
    }

    /**
     * Add bowling speed display
     */
    displayBowlingSpeed(speed) {
        const speedDisplay = document.getElementById('bowlerSpeedDisplay');
        if (speedDisplay) {
            const speedValue = document.getElementById('speedValue');
            if (speedValue) {
                speedValue.textContent = speed.toFixed(1);
            }
            speedDisplay.classList.add('active');

            setTimeout(() => {
                speedDisplay.classList.remove('active');
            }, 2000);
        }
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketGame;
}
