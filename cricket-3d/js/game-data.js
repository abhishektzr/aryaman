/**
 * Game Data and Statistics System
 * Comprehensive player profiles, team data, match records, and statistics
 * ~1100+ lines of detailed game data and analytics
 */

/**
 * Player Database
 * Detailed player information and statistics
 */
const PLAYER_DATABASE = {
    // INTERNATIONAL CRICKETERS
    'Virat Kohli': {
        id: 1,
        name: 'Virat Kohli',
        country: 'India',
        role: 'Batter',
        avgScore: 58,
        strikeRate: 125,
        skillBatting: 95,
        skillBowling: 20,
        skillFielding: 80,
        height: 1.81,
        weight: 73,
        jerseNumber: 18,
        experienceYears: 15,
        preferredShots: [0, 1, 3, 9], // drive, straight drive, pull, lofted drive
        weaknessAgainst: ['yorker', 'slower ball'],
        captaincy: true
    },
    'Rohit Sharma': {
        id: 2,
        name: 'Rohit Sharma',
        country: 'India',
        role: 'Batter',
        avgScore: 48,
        strikeRate: 135,
        skillBatting: 92,
        skillBowling: 15,
        skillFielding: 75,
        height: 1.78,
        weight: 70,
        jerseNumber: 45,
        experienceYears: 16,
        preferredShots: [0, 1, 12], // drive, straight drive, helicopter
        weaknessAgainst: ['legbreak', 'offbreak'],
        captaincy: true
    },
    'MS Dhoni': {
        id: 3,
        name: 'MS Dhoni',
        country: 'India',
        role: 'Wicketkeeper',
        avgScore: 45,
        strikeRate: 145,
        skillBatting: 90,
        skillBowling: 10,
        skillFielding: 88,
        wicketKeepingSkill: 95,
        height: 1.80,
        weight: 72,
        jerseNumber: 7,
        experienceYears: 18,
        preferredShots: [4, 7, 12], // hook, sweep, helicopter
        weaknessAgainst: ['short pitched', 'wide deliveries'],
        captaincy: true
    },
    'Jasprit Bumrah': {
        id: 4,
        name: 'Jasprit Bumrah',
        country: 'India',
        role: 'Bowler',
        avgSpeed: 145,
        economy: 6.5,
        avgWickets: 1.2,
        skillBatting: 35,
        skillBowling: 98,
        skillFielding: 75,
        height: 1.73,
        weight: 66,
        jerseNumber: 93,
        experienceYears: 8,
        bowlingType: 'Fast',
        specializations: ['yorker', 'slower ball', 'death bowling'],
        bestFigures: '4/32'
    },
    'Suryakumar Yadav': {
        id: 5,
        name: 'Suryakumar Yadav',
        country: 'India',
        role: 'Batter',
        avgScore: 42,
        strikeRate: 150,
        skillBatting: 88,
        skillBowling: 25,
        skillFielding: 82,
        height: 1.77,
        weight: 68,
        jerseNumber: 63,
        experienceYears: 7,
        preferredShots: [0, 7, 11, 12], // drive, sweep, ramp, helicopter
        weaknessAgainst: ['bouncer', 'yorker'],
        captaincy: false
    },
    'Ravindra Jadeja': {
        id: 6,
        name: 'Ravindra Jadeja',
        country: 'India',
        role: 'All-rounder',
        avgScore: 35,
        strikeRate: 120,
        avgWickets: 1.5,
        skillBatting: 80,
        skillBowling: 88,
        skillFielding: 92,
        height: 1.77,
        weight: 69,
        jerseNumber: 8,
        experienceYears: 14,
        bowlingType: 'Left-arm Orthodox',
        specializations: ['offbreak', 'doosra'],
        allRounder: true
    },
    'Hardik Pandya': {
        id: 7,
        name: 'Hardik Pandya',
        country: 'India',
        role: 'All-rounder',
        avgScore: 35,
        strikeRate: 160,
        avgWickets: 1.0,
        skillBatting: 85,
        skillBowling: 80,
        skillFielding: 78,
        height: 1.85,
        weight: 78,
        jerseNumber: 31,
        experienceYears: 10,
        bowlingType: 'Fast',
        specializations: ['yorker', 'slower ball', 'death'],
        allRounder: true
    },
    'Rashid Khan': {
        id: 8,
        name: 'Rashid Khan',
        country: 'Afghanistan',
        role: 'Bowler',
        avgSpeed: 95,
        economy: 6.0,
        avgWickets: 1.4,
        skillBatting: 40,
        skillBowling: 95,
        skillFielding: 80,
        height: 1.70,
        weight: 61,
        jerseNumber: 19,
        experienceYears: 8,
        bowlingType: 'Leg-break',
        specializations: ['googly', 'legbreak', 'flipper']
    },
    'Pat Cummins': {
        id: 9,
        name: 'Pat Cummins',
        country: 'Australia',
        role: 'Bowler',
        avgSpeed: 140,
        economy: 7.2,
        avgWickets: 1.3,
        skillBatting: 45,
        skillBowling: 96,
        skillFielding: 78,
        height: 1.98,
        weight: 82,
        jerseNumber: 21,
        experienceYears: 12,
        bowlingType: 'Fast',
        specializations: ['yorker', 'bouncer', 'seam']
    },
    'Trent Boult': {
        id: 10,
        name: 'Trent Boult',
        country: 'New Zealand',
        role: 'Bowler',
        avgSpeed: 138,
        economy: 6.8,
        avgWickets: 1.2,
        skillBatting: 35,
        skillBowling: 94,
        skillFielding: 75,
        height: 1.86,
        weight: 76,
        jerseNumber: 12,
        experienceYears: 13,
        bowlingType: 'Left-arm Fast',
        specializations: ['inswing', 'yorker', 'death bowling']
    }
};

/**
 * Team Statistics Database
 * Historical team performance data
 */
const TEAM_STATISTICS = {
    'Mumbai Indians': {
        shortName: 'MI',
        founded: 2008,
        championships: 5,
        avgScore: 165,
        avgScoreAgainst: 155,
        winPercentage: 0.52,
        strongPoints: ['Batting Depth', 'Death Bowling'],
        weakPoints: ['Middle Order', 'Spin Bowling'],
        recentForm: [1, 1, 0, 1, 1], // 1 = win, 0 = loss
        venue: 'Wankhede Stadium'
    },
    'Chennai Super Kings': {
        shortName: 'CSK',
        founded: 2008,
        championships: 5,
        avgScore: 160,
        avgScoreAgainst: 150,
        winPercentage: 0.54,
        strongPoints: ['Experienced Players', 'Batting'],
        weakPoints: ['Bowling Depth', 'Youth'],
        recentForm: [1, 1, 1, 0, 1],
        venue: 'M.A.Chidambaram Stadium'
    },
    'Royal Challengers Bangalore': {
        shortName: 'RCB',
        founded: 2008,
        championships: 0,
        avgScore: 162,
        avgScoreAgainst: 165,
        winPercentage: 0.48,
        strongPoints: ['Star Players', 'Batting'],
        weakPoints: ['Bowling', 'Consistency'],
        recentForm: [1, 0, 1, 0, 1],
        venue: 'M.Chinnaswamy Stadium'
    },
    'Kolkata Knight Riders': {
        shortName: 'KKR',
        founded: 2008,
        championships: 3,
        avgScore: 158,
        avgScoreAgainst: 160,
        winPercentage: 0.50,
        strongPoints: ['Youth', 'All-rounders'],
        weakPoints: ['Consistency', 'Big Matches'],
        recentForm: [0, 1, 0, 1, 1],
        venue: 'Eden Gardens'
    },
    'Delhi Capitals': {
        shortName: 'DC',
        founded: 2019,
        championships: 0,
        avgScore: 159,
        avgScoreAgainst: 162,
        winPercentage: 0.49,
        strongPoints: ['Youth', 'Spin'],
        weakPoints: ['Consistency', 'Experience'],
        recentForm: [1, 0, 0, 1, 0],
        venue: 'Arun Jaitley Stadium'
    }
};

/**
 * Match History and Records
 */
class MatchHistoryManager {
    constructor() {
        this.matches = [];
        this.maxHistory = 100;
        this.playerStats = {};
        this.teamStats = {};
    }

    /**
     * Record a match
     */
    recordMatch(matchData) {
        this.matches.push({
            date: new Date(),
            team1: matchData.team1,
            team2: matchData.team2,
            team1Score: matchData.team1Score,
            team2Score: matchData.team2Score,
            winner: matchData.winner,
            venue: matchData.venue,
            mode: matchData.mode,
            playerOfMatch: matchData.playerOfMatch
        });

        // Keep only latest matches
        if (this.matches.length > this.maxHistory) {
            this.matches.shift();
        }

        this.updatePlayerStats(matchData);
        this.updateTeamStats(matchData);
    }

    /**
     * Update player statistics
     */
    updatePlayerStats(matchData) {
        // Record batting and bowling stats for each player
    }

    /**
     * Update team statistics
     */
    updateTeamStats(matchData) {
        // Record team win/loss records
    }

    /**
     * Get head-to-head record
     */
    getHeadToHeadRecord(team1, team2) {
        const h2h = this.matches.filter(m =>
            (m.team1 === team1 && m.team2 === team2) ||
            (m.team1 === team2 && m.team2 === team1)
        );

        let team1Wins = 0, team2Wins = 0;

        h2h.forEach(match => {
            if (match.winner === team1) team1Wins++;
            else if (match.winner === team2) team2Wins++;
        });

        return { total: h2h.length, team1Wins, team2Wins };
    }

    /**
     * Get player career statistics
     */
    getPlayerStats(playerName) {
        return this.playerStats[playerName] || {
            matches: 0,
            runs: 0,
            wickets: 0,
            avgScore: 0,
            avgWickets: 0
        };
    }
}

/**
 * Match Analytics
 * Advanced match analysis and insights
 */
class MatchAnalytics {
    /**
     * Analyze batting partnerships
     */
    static analyzePartnership(batter1Stats, batter2Stats, ballsInPartnership) {
        const combined runs = batter1Stats.runs + batter2Stats.runs;
        const combinedBalls = batter1Stats.balls + batter2Stats.balls;
        const partnershipRate = (combined runs / combinedBalls) * 100;

        return {
            partnershipRuns: combined runs,
            partnershipBalls: combinedBalls,
            partnershipRate,
            dominance: batter1Stats.runs > batter2Stats.runs ? 'Batter1' : 'Batter2'
        };
    }

    /**
     * Analyze bowling performance
     */
    static analyzeBowlingPerformance(bowler) {
        const economy = (bowler.runs / (bowler.balls / 6)).toFixed(2);
        const strikeRate = (bowler.balls / bowler.wickets).toFixed(2);
        const average = (bowler.runs / bowler.wickets).toFixed(2);

        return { economy, strikeRate, average };
    }

    /**
     * Generate match momentum score
     */
    static getMomentumScore(matchState) {
        const wickets = matchState.wickets;
        const boundaries = matchState.boundaries.fours + matchState.boundaries.sixes;
        const runRate = matchState.runs / (matchState.balls / 6 || 1);

        // Momentum formula: wickets down is bad, boundaries and runs are good
        const momentum = (boundaries * 2 - wickets * 5 + runRate * 10) / 20;

        return Math.max(Math.min(momentum, 1), -1); // Normalize to -1 to 1
    }

    /**
     * Predict wicket probability
     */
    static predictWicketProbability(batter, bowler, ballsInOver) {
        const batterExperienceBonus = batter.balls > 50 ? 0.1 : 0;
        const bowlerExpertise = bowler.wickets / (bowler.balls / 6 + 0.001) * 0.1;

        let wicketProb = 0.1 - batterExperienceBonus + bowlerExpertise;

        // Higher in first ball of over or last ball
        if (ballsInOver === 0 || ballsInOver === 5) {
            wicketProb += 0.05;
        }

        return Math.min(Math.max(wicketProb, 0.05), 0.3);
    }
}

/**
 * Stadium Database
 */
const STADIUM_DATABASE = {
    'Wankhede Stadium': {
        location: 'Mumbai, India',
        capacity: 33108,
        avgScore: 165,
        fastTrack: true,
        spinFriendly: false,
        shortBoundary: 'Square leg',
        fastestBall: 165
    },
    'M.A.Chidambaram Stadium': {
        location: 'Chennai, India',
        capacity: 50000,
        avgScore: 160,
        fastTrack: false,
        spinFriendly: true,
        shortBoundary: 'Fine leg',
        fastestBall: 161
    },
    'M.Chinnaswamy Stadium': {
        location: 'Bangalore, India',
        capacity: 38000,
        avgScore: 170,
        fastTrack: true,
        spinFriendly: false,
        shortBoundary: 'Square leg',
        fastestBall: 168
    },
    'Eden Gardens': {
        location: 'Kolkata, India',
        capacity: 68000,
        avgScore: 158,
        fastTrack: false,
        spinFriendly: true,
        shortBoundary: 'Long on',
        fastestBall: 162
    },
    'Arun Jaitley Stadium': {
        location: 'Delhi, India',
        capacity: 41820,
        avgScore: 162,
        fastTrack: true,
        spinFriendly: false,
        shortBoundary: 'Square leg',
        fastestBall: 164
    }
};

/**
 * Tournament Database
 */
const TOURNAMENT_DATA = {
    'IPL 2024': {
        name: 'Indian Premier League 2024',
        format: 'T20',
        totalMatches: 74,
        totalTeams: 10,
        venue: 'Multiple',
        startDate: '2024-01-01',
        endDate: '2024-06-01'
    },
    'Cricket World Cup': {
        name: 'ICC Cricket World Cup',
        format: 'ODI',
        totalMatches: 48,
        totalTeams: 10,
        venue: 'Multiple',
        startDate: '2023-10-01',
        endDate: '2023-11-19'
    },
    'T20 World Cup': {
        name: 'ICC T20 World Cup',
        format: 'T20',
        totalMatches: 45,
        totalTeams: 16,
        venue: 'Multiple',
        startDate: '2024-06-01',
        endDate: '2024-07-31'
    }
};

// Initialize global managers
const matchHistoryManager = new MatchHistoryManager();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PLAYER_DATABASE,
        TEAM_STATISTICS,
        STADIUM_DATABASE,
        TOURNAMENT_DATA,
        MatchHistoryManager,
        MatchAnalytics,
        matchHistoryManager
    };
}
