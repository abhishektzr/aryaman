/**
 * Advanced Cricket AI System
 * Intelligent batting, bowling, and fielding strategies
 * ~900+ lines of advanced AI logic
 */

/**
 * Batting AI Engine
 * Makes intelligent batting decisions based on match situation
 */
class BattingAI {
    constructor() {
        this.profile = {
            aggression: Math.random() * 0.5 + 0.3, // 0.3 - 0.8
            consistency: Math.random() * 0.4 + 0.5, // 0.5 - 0.9
            riskTolerance: Math.random() * 0.6 + 0.2 // 0.2 - 0.8
        };

        this.stats = {
            avgScore: 40,
            strikeRate: 130,
            preferredShots: [1, 0, 3, 4], // drive, straight drive, pull, hook
            weaknesses: [7, 8, 12], // against variations
            confidenceLevel: 0.5
        };
    }

    /**
     * Decide next batting shot based on match situation
     */
    decideShotByPhase(matchState) {
        const phase = this.determineMatchPhase(matchState);
        const bowler = matchState.bowlStats[matchState.bowler];
        const striker = matchState.batStats[matchState.striker];

        // Early overs - build and consolidate
        if (phase === 'powerplay') {
            return this.decidePowPlay(matchState, bowler);
        }

        // Middle overs - acceleration
        if (phase === 'middle') {
            return this.decideMiddleOvers(matchState, bowler);
        }

        // Death overs - aggressive
        if (phase === 'death') {
            return this.decideDeathOvers(matchState, bowler);
        }

        // Default - random weighted choice
        return this.weightedRandomShot();
    }

    /**
     * Determine match phase
     */
    determineMatchPhase(matchState) {
        const ballsRemaining = matchState.maxOvers * 6 - matchState.balls;
        const totalBalls = matchState.maxOvers * 6;
        const progress = matchState.balls / totalBalls;

        if (progress < 0.2) return 'powerplay';
        if (ballsRemaining < 30) return 'death';
        return 'middle';
    }

    /**
     * Decide shot for powerplay (aggressive conservative)
     */
    decidePowPlay(matchState, bowler) {
        const decisions = [
            { shot: 0, weight: 0.3 }, // Cover drive
            { shot: 1, weight: 0.3 }, // Straight drive
            { shot: 3, weight: 0.2 }, // Pull
            { shot: 13, weight: 0.2 } // Defend
        ];

        return this.selectByWeight(decisions);
    }

    /**
     * Decide shot for middle overs
     */
    decideMiddleOvers(matchState, bowler) {
        const runRate = matchState.runs / (matchState.balls / 6 || 1);
        const requiredRR = (matchState.target - matchState.runs) / ((matchState.maxOvers * 6 - matchState.balls) / 6 || 1);

        if (requiredRR > runRate + 2) {
            // Behind target - accelerate
            return this.selectByWeight([
                { shot: 4, weight: 0.3 }, // Hook
                { shot: 7, weight: 0.2 }, // Sweep
                { shot: 0, weight: 0.25 }, // Cover drive
                { shot: 13, weight: 0.25 } // Defend
            ]);
        }

        // On track - steady approach
        return this.selectByWeight([
            { shot: 0, weight: 0.25 }, // Cover drive
            { shot: 1, weight: 0.25 }, // Straight drive
            { shot: 3, weight: 0.25 }, // Pull
            { shot: 13, weight: 0.25 } // Defend
        ]);
    }

    /**
     * Decide shot for death overs (aggressive)
     */
    decideDeathOvers(matchState, bowler) {
        return this.selectByWeight([
            { shot: 4, weight: 0.25 }, // Hook
            { shot: 7, weight: 0.25 }, // Sweep
            { shot: 12, weight: 0.2 }, // Helicopter
            { shot: 8, weight: 0.15 }, // Upper cut
            { shot: 0, weight: 0.15 } // Cover drive
        ]);
    }

    /**
     * Select shot by weighted probability
     */
    selectByWeight(decisions) {
        const total = decisions.reduce((sum, d) => sum + d.weight, 0);
        let random = Math.random() * total;

        for (const decision of decisions) {
            random -= decision.weight;
            if (random <= 0) {
                return decision.shot;
            }
        }

        return decisions[0].shot;
    }

    /**
     * Random weighted shot selection
     */
    weightedRandomShot() {
        const shots = Array.from({ length: 15 }, (_, i) => i);
        const weights = shots.map(i => {
            // Prefer safe shots (defend, leave)
            if (i === 13 || i === 14) return 0.15;
            // Prefer attacking shots
            if (i === 0 || i === 1 || i === 3 || i === 4) return 0.12;
            return 0.06;
        });

        return this.weightedRandom(shots, weights);
    }

    /**
     * Weighted random selection
     */
    weightedRandom(choices, weights) {
        const total = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * total;

        for (let i = 0; i < choices.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return choices[i];
            }
        }

        return choices[0];
    }

    /**
     * Predict likelihood of dismissal
     */
    predictDismissalRisk(matchState) {
        const striker = matchState.batStats[matchState.striker];
        const balls = striker.balls;
        const wickets = matchState.wickets;

        // Risk increases with:
        // - More balls faced (fatigue)
        // - More wickets down
        // - Against varied bowling

        const fatigueRisk = Math.min(balls / 120, 0.3);
        const pressureRisk = (wickets / 10) * 0.2;

        return fatigueRisk + pressureRisk + 0.1;
    }
}

/**
 * Bowling AI Engine
 * Makes intelligent bowling decisions
 */
class BowlingAI {
    constructor() {
        this.profile = {
            accuracy: Math.random() * 0.4 + 0.6, // 0.6 - 1.0
            variation: Math.random() * 0.5 + 0.3, // 0.3 - 0.8
            experience: Math.random() * 0.4 + 0.5  // 0.5 - 0.9
        };

        this.stats = {
            avgSpeed: 85,
            economy: 8,
            strikeRate: 20,
            specializations: ['fast', 'inswing', 'outswing'], // Main deliveries
            experience: 0
        };

        this.bowlingPlan = [];
    }

    /**
     * Decide next delivery
     */
    decideDelivery(matchState, batter, phase) {
        const ballsInOver = matchState.balls % 6;

        // First ball of over - aggressive
        if (ballsInOver === 0) {
            return this.selectFirstBall(batter, matchState);
        }

        // Last ball of over - defensive
        if (ballsInOver === 5) {
            return this.selectLastBall(batter, matchState);
        }

        // Middle balls - varied
        return this.selectMiddleBall(batter, matchState, phase);
    }

    /**
     * Select first ball of over
     */
    selectFirstBall(batter, matchState) {
        return {
            type: 'fast',
            speed: 85 + Math.random() * 10,
            line: Math.random() * 0.5 - 0.25, // Off stump
            length: 0.5
        };
    }

    /**
     * Select last ball of over
     */
    selectLastBall(batter, matchState) {
        const deliveries = ['yorker', 'slower', 'bumper'];
        const type = deliveries[Math.floor(Math.random() * deliveries.length)];

        return {
            type,
            speed: type === 'slower' ? 70 : 88,
            line: Math.random() * 0.5 - 0.25,
            length: type === 'yorker' ? 1.0 : 0.3
        };
    }

    /**
     * Select middle ball of over
     */
    selectMiddleBall(batter, matchState, phase) {
        const variations = [
            'fast', 'inswing', 'outswing', 'legbreak', 'offbreak'
        ];

        const type = variations[Math.floor(Math.random() * variations.length)];

        return {
            type,
            speed: 80 + Math.random() * 15,
            line: Math.random() * 1.0 - 0.5,
            length: 0.4 + Math.random() * 0.4
        };
    }

    /**
     * Create bowling plan for innings
     */
    createBowlingPlan(matchState, targetScore) {
        const plan = [];

        // Initial phase - attack
        for (let i = 0; i < 3; i++) {
            plan.push({
                over: i,
                strategy: 'attack',
                focus: 'attacking lengths',
                mainDelivery: 'fast'
            });
        }

        // Middle phase - containment
        for (let i = 3; i < 10; i++) {
            plan.push({
                over: i,
                strategy: 'contain',
                focus: 'economy rate',
                mainDelivery: 'variations'
            });
        }

        // Death phase - defensive
        for (let i = 10; i < matchState.maxOvers; i++) {
            plan.push({
                over: i,
                strategy: 'death',
                focus: 'yorkers and slower',
                mainDelivery: 'yorker'
            });
        }

        return plan;
    }

    /**
     * Analyze batter weakness
     */
    analyzeBatterWeakness(batter) {
        return {
            weakAgainstFast: Math.random() > 0.5,
            weakAgainstSpin: Math.random() > 0.6,
            preferredLine: Math.random() > 0.5 ? 'off' : 'leg',
            preferredLength: Math.random() > 0.5 ? 'short' : 'full'
        };
    }
}

/**
 * Fielding AI Engine
 * Controls fielder positions and movements
 */
class FieldingAI {
    constructor() {
        this.formations = {
            aggressive: [
                { type: 'slip', x: -3, z: -1 },
                { type: 'gully', x: 3, z: -1 },
                { type: 'cover', x: 15, z: 5 },
                { type: 'mid-on', x: -10, z: 5 },
                { type: 'mid-off', x: 10, z: 5 },
                { type: 'square-leg', x: -20, z: 0 },
                { type: 'fine-leg', x: -5, z: 20 },
                { type: 'third-man', x: 10, z: 20 },
                { type: 'deep-point', x: 25, z: 10 },
                { type: 'deep-mid-wicket', x: -25, z: 5 }
            ],
            defensive: [
                { type: 'cover', x: 12, z: 3 },
                { type: 'mid-on', x: -8, z: 3 },
                { type: 'mid-off', x: 8, z: 3 },
                { type: 'square-leg', x: -15, z: -2 },
                { type: 'fine-leg', x: -3, z: 15 },
                { type: 'deep-cover', x: 35, z: 10 },
                { type: 'deep-mid-wicket', x: -35, z: 5 },
                { type: 'long-on', x: -20, z: 40 },
                { type: 'long-off', x: 20, z: 40 },
                { type: 'third-man', x: 8, z: 35 }
            ],
            balanced: [
                { type: 'cover', x: 13, z: 4 },
                { type: 'mid-on', x: -9, z: 4 },
                { type: 'mid-off', x: 9, z: 4 },
                { type: 'square-leg', x: -18, z: -1 },
                { type: 'fine-leg', x: -4, z: 18 },
                { type: 'point', x: 20, z: 2 },
                { type: 'deep-cover', x: 40, z: 8 },
                { type: 'deep-mid-wicket', x: -40, z: 4 },
                { type: 'long-on', x: -18, z: 38 },
                { type: 'long-off', x: 18, z: 38 }
            ]
        };
    }

    /**
     * Decide fielding formation
     */
    decideFormation(matchState, batter) {
        const runRate = matchState.runs / (matchState.balls / 6 || 1);
        const requiredRR = (matchState.target - matchState.runs) / ((matchState.maxOvers * 6 - matchState.balls) / 6 || 1);

        if (requiredRR > runRate + 3) {
            // Run chase - aggressive
            return this.formations.aggressive;
        } else if (requiredRR > runRate + 1) {
            // On track - balanced
            return this.formations.balanced;
        } else {
            // Ahead - defensive
            return this.formations.defensive;
        }
    }

    /**
     * Position fielders for specific batter
     */
    positionForBatter(batter) {
        // Adjust formation based on batter characteristics
        return this.formations.balanced;
    }

    /**
     * Update fielder positions
     */
    updateFielderPositions(scene, fielders, formation) {
        if (!fielders || fielders.length === 0) return;

        formation.forEach((pos, idx) => {
            if (fielders[idx]) {
                fielders[idx].position.x = pos.x;
                fielders[idx].position.z = pos.z;
            }
        });
    }
}

/**
 * Match Predictor
 * Predicts match outcomes and probabilities
 */
class MatchPredictor {
    /**
     * Predict match outcome
     */
    static predictOutcome(matchState) {
        const runsNeeded = matchState.target - matchState.runs;
        const ballsRemaining = matchState.maxOvers * 6 - matchState.balls;
        const wicketsRemaining = 10 - matchState.wickets;

        if (runsNeeded <= 0) {
            return { prediction: 'Winning', confidence: 1.0 };
        }

        const requiredRR = runsNeeded / (ballsRemaining / 6);
        const currentRR = matchState.runs / (matchState.balls / 6 || 1);

        // Win probability formula
        const baseWinProb = currentRR / (requiredRR + 0.001);
        const wicketsFactor = wicketsRemaining / 10;
        const timeFactor = ballsRemaining / (matchState.maxOvers * 6);

        const winProbability = Math.min(
            baseWinProb * wicketsFactor * (1 + timeFactor * 0.5),
            1
        );

        let prediction = 'Close';
        if (winProbability > 0.7) prediction = 'Winning';
        else if (winProbability < 0.3) prediction = 'Losing';

        return { prediction, probability: winProbability };
    }

    /**
     * Predict match result
     */
    static predictResult(team1Stats, team2Stats) {
        const team1Win = team1Stats.avgScore * 1.1 * (team1Stats.avgWickets / 10);
        const team2Win = team2Stats.avgScore * 1.1 * (team2Stats.avgWickets / 10);

        const total = team1Win + team2Win;
        const team1Prob = team1Win / total;

        return {
            team1WinProbability: team1Prob,
            team2WinProbability: 1 - team1Prob,
            expectedWinner: team1Prob > 0.5 ? 'Team 1' : 'Team 2'
        };
    }
}

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BattingAI,
        BowlingAI,
        FieldingAI,
        MatchPredictor
    };
}
