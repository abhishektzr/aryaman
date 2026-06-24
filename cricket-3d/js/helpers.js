/**
 * Cricket Game Helpers and Utilities
 * Common helper functions used throughout the game
 * ~150+ lines of helper utilities
 */

/**
 * Cricket-specific helper functions
 */
class CricketHelpers {
    /**
     * Calculate strike rate
     */
    static calculateStrikeRate(runs, balls) {
        if (balls === 0) return 0;
        return ((runs / balls) * 100).toFixed(2);
    }

    /**
     * Calculate run rate
     */
    static calculateRunRate(runs, overs) {
        if (overs === 0) return 0;
        return (runs / overs).toFixed(2);
    }

    /**
     * Calculate economy rate (bowling)
     */
    static calculateEconomy(runsGiven, ballsBowled) {
        if (ballsBowled === 0) return 0;
        const overs = ballsBowled / 6;
        return (runsGiven / overs).toFixed(2);
    }

    /**
     * Calculate batting average
     */
    static calculateAverage(totalRuns, timesOut) {
        if (timesOut === 0) return 0;
        return (totalRuns / timesOut).toFixed(2);
    }

    /**
     * Calculate bowling average
     */
    static calculateBowlingAverage(runsConceded, wickets) {
        if (wickets === 0) return 0;
        return (runsConceded / wickets).toFixed(2);
    }

    /**
     * Format overs properly (e.g., 5.3 overs)
     */
    static formatOvers(balls) {
        const overs = Math.floor(balls / 6);
        const remainingBalls = balls % 6;
        return `${overs}.${remainingBalls}`;
    }

    /**
     * Parse overs to balls
     */
    static parseovers(oversString) {
        const parts = oversString.split('.');
        const overs = parseInt(parts[0]);
        const balls = parseInt(parts[1]) || 0;
        return overs * 6 + balls;
    }

    /**
     * Get match status text
     */
    static getMatchStatus(matchState) {
        const overs = CricketHelpers.formatOvers(matchState.balls);
        const runRate = CricketHelpers.calculateRunRate(
            matchState.runs,
            matchState.balls / 6
        );

        return `${matchState.score}/${matchState.wickets} in ${overs} ov (RR: ${runRate})`;
    }

    /**
     * Get shot emoji
     */
    static getShotEmoji(shotType) {
        const emojis = {
            0: '⚽', // Cover Drive
            1: '↗️', // Straight Drive
            2: '←', // Flick
            3: '⬇️', // Pull
            4: '⬅️', // Hook
            5: '↘️', // Cut
            6: '⤴️', // Sweep
            7: '⤵️', // Reverse Sweep
            8: '📈', // Upper Cut
            9: '🔺', // Lofted Drive
            10: '🎪', // Paddle Sweep
            11: '⬆️', // Ramp
            12: '🚁', // Helicopter
            13: '🛡️', // Defend
            14: '🚶' // Leave
        };

        return emojis[shotType] || '🏏';
    }

    /**
     * Get delivery type emoji
     */
    static getDeliveryEmoji(deliveryType) {
        const emojis = {
            'fast': '⚡',
            'inswing': '↙️',
            'outswing': '↗️',
            'legbreak': '↻',
            'offbreak': '↺',
            'googly': '🌀',
            'flipper': '📘',
            'slider': '→',
            'yorker': '↓',
            'slower': '🐌'
        };

        return emojis[deliveryType] || '🎯';
    }

    /**
     * Predict match outcome probability
     */
    static predictOutcomeProbability(runs, target, ballsRemaining, wicketsRemaining) {
        if (!target || ballsRemaining === 0) return 0.5;

        const runsNeeded = target - runs;
        const oversRemaining = ballsRemaining / 6;

        if (runsNeeded <= 0) return 1.0;
        if (runsNeeded > (oversRemaining * 15)) return 0.1; // Very high required RR

        // Simple probability based on required RR
        const requiredRR = runsNeeded / oversRemaining;
        const currentRR = runs / (Math.floor((120 - ballsRemaining) / 6) + 0.001);

        let probability = currentRR / (requiredRR + 0.001);
        probability *= (wicketsRemaining / 10); // Factor in wickets

        return Math.min(Math.max(probability, 0), 1);
    }

    /**
     * Get player role emoji
     */
    static getRoleEmoji(role) {
        const emojis = {
            'Batter': '🏏',
            'Bowler': '🎯',
            'All-rounder': '⚙️',
            'Wicketkeeper': '🥅'
        };

        return emojis[role] || '👤';
    }

    /**
     * Format large numbers
     */
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Get match title based on format
     */
    static getMatchTitle(format) {
        const titles = {
            'quick': 'T5 Quick Match',
            't20': 'T20 Match',
            'odi': 'ODI Match',
            'test': 'Test Match',
            'ipl': 'IPL Match',
            'cwc': 'World Cup'
        };

        return titles[format] || 'Cricket Match';
    }

    /**
     * Validate cricket data
     */
    static validateMatchData(matchData) {
        const errors = [];

        if (!matchData.team1 || !matchData.team2) {
            errors.push('Teams not defined');
        }

        if (matchData.score < 0 || matchData.wickets < 0) {
            errors.push('Invalid score or wickets');
        }

        if (matchData.balls < 0) {
            errors.push('Invalid ball count');
        }

        if (matchData.wickets > 10) {
            errors.push('Too many wickets');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Generate match commentary
     */
    static generateCommentary(event, matchState) {
        const commentaries = {
            'boundary4': [
                `Four! Beautiful shot to the boundary!`,
                `That's a boundary! Excellent placement!`,
                `Four runs! The fielders can't catch that one!`,
                `Cracking shot! Four more!`
            ],
            'boundary6': [
                `SIX! Over the boundary!`,
                `That's a huge six!`,
                `Out of the stadium! Six runs!`,
                `Magnificent! Over the rope for six!`
            ],
            'wicket': [
                `WICKET! What a delivery!`,
                `AND HE'S OUT! Great moment!`,
                `WICKET DOWN! The bowler strikes!`,
                `Got him! The batter is dismissed!`
            ],
            'dot': [
                `Dot ball. No runs.`,
                `Blocked safely.`,
                `No runs off that delivery.`,
                `Quiet ball.`
            ]
        };

        const texts = commentaries[event] || ['Play continues'];
        return texts[Math.floor(Math.random() * texts.length)];
    }

    /**
     * Get ball color based on delivery type
     */
    static getBallColor(deliveryType) {
        const colors = {
            'fast': 0xff0000,
            'inswing': 0xff6600,
            'outswing': 0xff9900,
            'legbreak': 0x0066ff,
            'offbreak': 0x6600ff,
            'googly': 0xff0099,
            'flipper': 0x00ffff,
            'slider': 0xffff00,
            'yorker': 0xcc00ff
        };

        return colors[deliveryType] || 0xffffff;
    }

    /**
     * Get shot difficulty
     */
    static getShotDifficulty(shotIndex) {
        const difficulties = [
            'Medium',   // 0: Cover Drive
            'Medium',   // 1: Straight Drive
            'Hard',     // 2: Flick
            'Medium',   // 3: Pull
            'Hard',     // 4: Hook
            'Hard',     // 5: Cut
            'Hard',     // 6: Sweep
            'Expert',   // 7: Reverse Sweep
            'Expert',   // 8: Upper Cut
            'Hard',     // 9: Lofted Drive
            'Expert',   // 10: Paddle Sweep
            'Expert',   // 11: Ramp
            'Expert',   // 12: Helicopter
            'Easy',     // 13: Defend
            'Easy'      // 14: Leave
        ];

        return difficulties[shotIndex] || 'Unknown';
    }

    /**
     * Calculate player rating
     */
    static calculatePlayerRating(stats) {
        const batting = stats.avgScore ? Math.min((stats.avgScore / 100) * 100, 100) : 0;
        const bowling = stats.avgWickets ? Math.min((stats.avgWickets / 3) * 100, 100) : 0;
        const fielding = stats.fieldingSkill || 0;

        const weights = {
            batting: 0.4,
            bowling: 0.4,
            fielding: 0.2
        };

        return Math.round(
            (batting * weights.batting +
             bowling * weights.bowling +
             fielding * weights.fielding)
        );
    }

    /**
     * Get team color
     */
    static getTeamColor(teamName) {
        const colors = {
            'Mumbai Indians': 0x0066ff,
            'Chennai Super Kings': 0xffdd00,
            'Royal Challengers Bangalore': 0xff0000,
            'Kolkata Knight Riders': 0x9932cc,
            'Delhi Capitals': 0x0033cc
        };

        return colors[teamName] || 0xffffff;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketHelpers;
}
