/**
 * AI System
 * Handles AI for batters and bowlers
 */

class CricketAI {
    constructor() {
        this.matchState = null;
    }

    /**
     * Decide next batting shot
     */
    decideBattingShot(matchState) {
        const batter = matchState.batStats[matchState.striker];
        const runRate = matchState.runs / (matchState.balls / 6 || 1);
        const requiredRR = (matchState.target - matchState.runs) / ((matchState.maxOvers * 6 - matchState.balls) / 6 || 1);
        const ballsLeft = matchState.maxOvers * 6 - matchState.balls;

        // Shot selection logic
        const shots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // All shot indexes

        // Early in innings, play defensively
        if (matchState.balls < 30 && batter.balls < 20) {
            return this.weightedRandom([13, 0, 1, 4], [0.3, 0.3, 0.2, 0.2]); // Defend, Drive, Flick, Pull
        }

        // Middle innings, build attack
        if (matchState.balls >= 30 && matchState.balls < 90) {
            return this.weightedRandom([1, 2, 4, 5, 6], [0.25, 0.25, 0.2, 0.15, 0.15]);
        }

        // Death overs, aggressive
        if (ballsLeft < 24) {
            return this.weightedRandom([4, 5, 7, 8, 12], [0.2, 0.25, 0.2, 0.15, 0.2]);
        }

        return Math.floor(Math.random() * shots.length);
    }

    /**
     * Decide bowling delivery
     */
    decideBowlingDelivery(matchState) {
        const bowler = matchState.bowlStats[matchState.bowler];
        const ballsInOver = matchState.balls % 6;

        // Varied deliveries
        const deliveries = [
            'fast', 'fast', 'inswing', 'outswing', 'bouncer', 'yorker',
            'slider', 'flipper', 'googly', 'offbreak', 'legbreak'
        ];

        // First ball of over
        if (ballsInOver === 0) {
            return { type: this.weightedChoice(['fast', 'inswing', 'outswing']), speed: 85 + Math.random() * 10 };
        }

        // Death overs - yorkers and slower balls
        if (matchState.balls > matchState.maxOvers * 6 - 24) {
            return { type: this.weightedChoice(['yorker', 'flipper', 'slower']), speed: 70 + Math.random() * 15 };
        }

        // Default - mix of deliveries
        return {
            type: deliveries[Math.floor(Math.random() * deliveries.length)],
            speed: 75 + Math.random() * 20,
            line: (Math.random() - 0.5) * 2,
            length: Math.random()
        };
    }

    /**
     * Weighted random selection
     */
    weightedRandom(choices, weights) {
        const random = Math.random();
        let sum = 0;

        for (let i = 0; i < choices.length; i++) {
            sum += weights[i];
            if (random < sum) return choices[i];
        }

        return choices[choices.length - 1];
    }

    /**
     * Weighted choice between strings
     */
    weightedChoice(choices) {
        const weights = Array(choices.length).fill(1 / choices.length);
        return this.weightedRandom(choices, weights);
    }

    /**
     * Decide field placement
     */
    decideFieldPlacement(matchState) {
        const fielding = [];
        const battingLine = matchState.strikeRate || 0.5;

        if (battingLine > 0.8) {
            // Aggressive batting, place slips
            fielding.push({ position: 'slip', x: -3, z: -1 });
            fielding.push({ position: 'gully', x: 3, z: -1 });
        }

        // Mid-on and mid-off
        fielding.push({ position: 'mid-on', x: -10, z: 5 });
        fielding.push({ position: 'mid-off', x: 10, z: 5 });

        return fielding;
    }

    /**
     * Estimate match outcome
     */
    predictMatchOutcome(matchState) {
        if (matchState.inning === 1) return { prediction: 'In progress', confidence: 0 };

        const runsNeeded = matchState.target - matchState.score;
        const ballsRemaining = matchState.maxOvers * 6 - matchState.balls;
        const wicketsRemaining = 10 - matchState.wickets;

        if (runsNeeded <= 0) {
            return { prediction: 'Winning', confidence: 1.0 };
        }

        const requiredRR = runsNeeded / (ballsRemaining / 6);
        const currentRR = matchState.score / (matchState.balls / 6 || 1);

        if (requiredRR > 15 && wicketsRemaining < 3) {
            return { prediction: 'Losing', confidence: 0.8 };
        }

        if (currentRR > requiredRR + 2) {
            return { prediction: 'Winning', confidence: 0.7 };
        }

        return { prediction: 'Close', confidence: 0.5 };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketAI;
}
