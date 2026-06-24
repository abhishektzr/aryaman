/**
 * Game Logic
 * Main game logic and state management
 */

class CricketGame {
    constructor() {
        this.matchState = {
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
            batStats: [],
            bowlStats: [],
            opposition: { score: 0, wickets: 0, balls: 0 },
            team1: null,
            team2: null,
            isGameActive: false,
            strikeRate: 0,
            runRate: 0,
            fieldingPositions: []
        };

        this.scene = null;
        this.camera = null;
        this.physics = new CricketPhysics();
        this.ai = new CricketAI();
        this.effects = null;
        this.ui = new UIManager();
        this.input = new InputManager();
        this.animationController = new AnimationController();

        this.ballInPlay = false;
        this.lastBallResult = null;
        this.ballTrajectory = null;

        window.gameInstance = this;
    }

    /**
     * Initialize new match
     */
    initMatch(mode, team1, team2) {
        this.matchState.mode = mode;
        this.matchState.team1 = team1;
        this.matchState.team2 = team2;
        this.matchState.maxOvers = { quick: 5, t20: 20, odi: 50, test: 15 }[mode];
        this.matchState.inning = 1;
        this.matchState.batStats = team1.players.map(name => ({
            name, runs: 0, balls: 0, fours: 0, sixes: 0, out: false, howOut: null
        }));
        this.matchState.bowlStats = team2.players.map(name => ({
            name, balls: 0, runs: 0, wickets: 0
        }));

        this.matchState.isGameActive = true;
        this.ui.updateAll(this.matchState);
        this.ui.hideMenu();
    }

    /**
     * Play a batting shot
     */
    playShot(shotIdx) {
        if (!this.matchState.isGameActive) return;
        if (this.ballInPlay) return;

        const shots = [
            { name: 'Cover Drive', power: 0.85, angle: 45 },
            { name: 'Straight Drive', power: 0.90, angle: 0 },
            { name: 'Flick', power: 0.65, angle: -30 },
            { name: 'Pull', power: 0.95, angle: 90 },
            { name: 'Hook', power: 1.0, angle: 85 },
            { name: 'Cut', power: 0.80, angle: 60 },
            { name: 'Sweep', power: 0.70, angle: -60 },
            { name: 'Reverse Sweep', power: 0.60, angle: -45 },
            { name: 'Upper Cut', power: 0.85, angle: 70 },
            { name: 'Lofted Drive', power: 0.80, angle: 30 },
            { name: 'Paddle Sweep', power: 0.55, angle: -50 },
            { name: 'Ramp', power: 0.65, angle: -20 },
            { name: 'Helicopter', power: 0.95, angle: 50 },
            { name: 'Defend', power: 0.30, angle: 0 },
            { name: 'Drop', power: 0.15, angle: 0 }
        ];

        const shot = shots[shotIdx];
        if (!shot) return;

        // Calculate outcome
        this.calculateBallResult(shot);

        // Update UI
        this.ui.addCommentary(`${this.matchState.batStats[this.matchState.striker].name} plays ${shot.name}`);
        this.ui.updateAll(this.matchState);

        // Check game end
        this.checkGameEnd();
    }

    /**
     * Calculate ball result
     */
    calculateBallResult(shot) {
        const batter = this.matchState.batStats[this.matchState.striker];
        const bowler = this.matchState.bowlStats[this.matchState.bowler];

        const power = Math.random();
        const timing = Math.random() + 0.3; // 0.3 to 1.3
        const quality = power * timing * shot.power;

        let runs = 0;
        let isWicket = false;
        let commentary = '';

        // Wicket probability
        const wicketChance = 0.12 * (1 - timing);
        if (Math.random() < wicketChance) {
            isWicket = true;
            this.matchState.wickets++;
            batter.out = true;
            batter.howOut = 'bowled';
            commentary = `WICKET! ${batter.name} is out!`;

            if (this.matchState.striker < 10) {
                this.matchState.striker++;
            }
        } else {
            // Run calculation
            if (quality > 0.9) {
                runs = 6;
                batter.sixes++;
                commentary = `SIX! Magnificent ${shot.name} by ${batter.name}!`;
            } else if (quality > 0.7) {
                runs = 4;
                batter.fours++;
                commentary = `FOUR! Excellent execution!`;
            } else if (quality > 0.5) {
                runs = 2;
                commentary = `Two runs!`;
            } else if (quality > 0.3) {
                runs = 1;
                commentary = `Single taken!`;
            } else {
                commentary = `Dot ball`;
            }

            this.matchState.score += runs;
            batter.runs += runs;

            // Rotate strike
            if (runs % 2 === 1) {
                [this.matchState.striker, this.matchState.nonStriker] =
                [this.matchState.nonStriker, this.matchState.striker];
            }
        }

        // Update bowler stats
        bowler.balls++;
        bowler.runs += runs;

        // Update match stats
        this.matchState.balls++;
        this.matchState.runs = this.matchState.score;
        this.matchState.strikeRate = batter.balls > 0
            ? ((batter.runs / batter.balls) * 100).toFixed(1)
            : 0;
        this.matchState.runRate = this.matchState.balls > 0
            ? ((this.matchState.score / this.matchState.balls) * 6).toFixed(2)
            : 0;

        // Store result
        this.lastBallResult = { runs, isWicket, shot, commentary };
    }

    /**
     * Simulate AI batsman
     */
    simulateAIBat() {
        const shotIdx = this.ai.decideBattingShot(this.matchState);
        this.playShot(shotIdx);
    }

    /**
     * Bowl next ball (AI)
     */
    bowlNextBall() {
        const delivery = this.ai.decideBowlingDelivery(this.matchState);

        // Calculate ball physics
        this.physics.deliverBall(delivery.speed, delivery.type, delivery.line, delivery.length);

        // Update UI
        const bowler = this.matchState.bowlStats[this.matchState.bowler];
        this.ui.addCommentary(`${bowler.name} bowls ${delivery.type}...`);
    }

    /**
     * Check if game should end
     */
    checkGameEnd() {
        const ballsInOver = this.matchState.balls % 6;

        // End of over
        if (ballsInOver === 0 && this.matchState.balls > 0) {
            // Change bowler
            if (this.matchState.bowler < this.matchState.bowlStats.length - 1) {
                this.matchState.bowler++;
            }

            // Rotate strike
            [this.matchState.striker, this.matchState.nonStriker] =
            [this.matchState.nonStriker, this.matchState.striker];
        }

        // End of innings
        if (this.matchState.balls >= this.matchState.maxOvers * 6 || this.matchState.wickets >= 10) {
            this.endInning();
        }
    }

    /**
     * End current inning
     */
    endInning() {
        if (this.matchState.inning === 1) {
            this.matchState.target = this.matchState.score + 1;
            const inning1Score = {
                score: this.matchState.score,
                wickets: this.matchState.wickets,
                balls: this.matchState.balls
            };

            // Simulate opposition innings
            this.matchState.opposition.score = Math.max(
                this.matchState.score - 5,
                Math.floor(Math.random() * (this.matchState.score + 20))
            );
            this.matchState.opposition.wickets = Math.floor(Math.random() * 8) + 2;
            this.matchState.opposition.balls = this.matchState.maxOvers * 6;

            // Reset for second inning
            this.matchState.inning = 2;
            this.matchState.balls = 0;
            this.matchState.wickets = 0;
            this.matchState.score = 0;
            this.matchState.striker = 0;
            this.matchState.nonStriker = 1;
            this.matchState.bowler = 0;
            this.matchState.batStats = this.matchState.batStats.map(b => ({ ...b, runs: 0, balls: 0 }));

            this.ui.addCommentary(`End of Inning 1: ${this.matchState.team1.name} scored ${inning1Score.score}/${inning1Score.wickets}`);
        } else {
            // Match complete
            this.endMatch();
        }
    }

    /**
     * End match
     */
    endMatch() {
        this.matchState.isGameActive = false;

        const result = this.matchState.opposition.score > this.matchState.score
            ? { winner: this.matchState.team2.name, margin: 10 - this.matchState.opposition.wickets, type: 'wickets' }
            : { winner: this.matchState.team1.name, margin: this.matchState.score - this.matchState.opposition.score, type: 'runs' };

        const resultText = `${result.winner} wins by ${result.margin} ${result.type}!`;
        this.ui.addCommentary(`🏆 MATCH OVER! ${resultText}`);
        this.ui.showResult(this.matchState, result);
    }

    /**
     * Reset match
     */
    resetMatch() {
        this.matchState.isGameActive = false;
        this.ui.showMenu();
    }

    /**
     * Update game state (called from main loop)
     */
    update(deltaTime) {
        if (!this.matchState.isGameActive) return;

        // Update physics
        if (this.ballInPlay) {
            const ballInfo = this.physics.update(deltaTime);
            if (this.scene) {
                this.scene.setBallPosition(
                    this.physics.ballPosition.x,
                    this.physics.ballPosition.y,
                    this.physics.ballPosition.z
                );
            }
        }

        // Update animations
        this.animationController.update(deltaTime);

        // Update effects
        if (this.effects) {
            this.effects.update(deltaTime);
        }
    }

    /**
     * Render frame
     */
    render() {
        if (this.scene) {
            this.scene.render();
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketGame;
}
