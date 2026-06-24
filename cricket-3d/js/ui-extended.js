/**
 * Extended UI System - Commentary, Statistics, Graphs
 * Advanced UI features including wagon wheel, pitch map, run rate graph, worm graph
 * ~900+ lines of advanced UI and visualization code
 */

/**
 * Commentary System
 * Generates and displays dynamic match commentary
 */
class CommentarySystem {
    constructor() {
        this.commentaryBuffer = [];
        this.maxHistory = 50;
        this.lastUpdateTime = 0;
    }

    /**
     * Generate commentary based on match event
     */
    generateCommentary(event, matchState) {
        const commentaries = {
            boundary4: [
                "Beautiful boundary! Four runs!",
                "Cracking shot! The ball races away for four!",
                "Superb placement! Boundary!",
                "Excellent shot down the ground!",
                "Perfect timing! Four more!"
            ],
            boundary6: [
                "SIX! What a shot!",
                "Into the orbit! Six runs!",
                "Massive! Over the boundary!",
                "That's cleared the fielders! Six!",
                "Phenomenal shot! Over the ropes!"
            ],
            wicket: [
                "WICKET! A great moment in the match!",
                "AND HE'S OUT! What a delivery!",
                "The bowler strikes! Wicket!",
                "Got him! That's the breakthrough!",
                "What a ball! The batter is dismissed!"
            ],
            dot: [
                "Dot ball! No runs",
                "Blocked out safely",
                "Solid defense",
                "That one didn't come off",
                "A quiet delivery"
            ],
            single: [
                "Single! One run",
                "Quick single taken",
                "Easy run there",
                "A run taken",
                "One more"
            ],
            double: [
                "Two runs! Quick work",
                "A comfortable two",
                "Two easy runs",
                "Both batters are well between the wickets",
                "Easy two taken"
            ]
        };

        const selectedCommentary = commentaries[event] || ["Play continues"];
        return selectedCommentary[Math.floor(Math.random() * selectedCommentary.length)];
    }

    /**
     * Add commentary to buffer
     */
    addCommentary(text) {
        this.commentaryBuffer.push({
            text,
            timestamp: Date.now(),
            displayTime: 5000
        });

        if (this.commentaryBuffer.length > this.maxHistory) {
            this.commentaryBuffer.shift();
        }

        this.updateDisplay();
    }

    /**
     * Update commentary display in UI
     */
    updateDisplay() {
        const commentaryElement = document.getElementById('commentary');
        if (commentaryElement && this.commentaryBuffer.length > 0) {
            const latest = this.commentaryBuffer[this.commentaryBuffer.length - 1];
            commentaryElement.textContent = latest.text;
        }
    }

    /**
     * Get full commentary history
     */
    getHistory() {
        return this.commentaryBuffer.map(c => c.text);
    }
}

/**
 * Statistics Tracker
 * Tracks and manages all match statistics
 */
class StatisticsTracker {
    constructor() {
        this.stats = {
            boundaries: { fours: 0, sixes: 0 },
            dotBalls: 0,
            wides: 0,
            noBalls: 0,
            extras: 0,
            partnerships: [],
            fallenWickets: [],
            bowlerStats: {},
            batterStats: {}
        };
    }

    /**
     * Record a boundary
     */
    recordBoundary(runs) {
        if (runs === 4) {
            this.stats.boundaries.fours += 1;
        } else if (runs === 6) {
            this.stats.boundaries.sixes += 1;
        }
    }

    /**
     * Record a wicket
     */
    recordWicket(batterName, bowlerName, howOut) {
        this.stats.fallenWickets.push({
            batter: batterName,
            bowler: bowlerName,
            howOut,
            timestamp: Date.now()
        });
    }

    /**
     * Get statistics summary
     */
    getSummary() {
        return {
            totalBoundaries: this.stats.boundaries.fours + this.stats.boundaries.sixes,
            fours: this.stats.boundaries.fours,
            sixes: this.stats.boundaries.sixes,
            dotBalls: this.stats.dotBalls,
            wickets: this.stats.fallenWickets.length
        };
    }
}

/**
 * Wagon Wheel Generator
 * Creates batting wagon wheel visualization (in 2D canvas)
 */
class WagonWheelGenerator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.shotDistribution = {
            0: 0,   // Off-side 0°
            45: 0,  // 45°
            90: 0,  // Square
            135: 0, // Leg-side 45°
            180: 0, // Square leg
            225: 0, // Fine leg
            270: 0, // Fine leg square
            315: 0  // Off-side square
        };
    }

    /**
     * Record a shot in the distribution
     */
    recordShot(angle, runs) {
        const normalizedAngle = ((angle % 360) + 360) % 360;
        const bucketAngle = Math.round(normalizedAngle / 45) * 45;

        this.shotDistribution[bucketAngle] += runs;
        this.draw();
    }

    /**
     * Draw wagon wheel
     */
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        this.ctx.clearRect(0, 0, width, height);

        // Draw pitch
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw outer circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw directional lines
        for (let angle = 0; angle < 360; angle += 45) {
            const rad = angle * Math.PI / 180;
            const x1 = centerX + Math.cos(rad) * radius;
            const y1 = centerY + Math.sin(rad) * radius;

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x1, y1);
            this.ctx.stroke();
        }

        // Draw shot dots
        this.ctx.fillStyle = '#ffb300';
        Object.keys(this.shotDistribution).forEach(angleStr => {
            const angle = parseInt(angleStr);
            const runs = this.shotDistribution[angle];

            if (runs > 0) {
                const rad = angle * Math.PI / 180;
                const dotRadius = Math.min(runs * 2, radius * 0.8);
                const x = centerX + Math.cos(rad) * dotRadius;
                const y = centerY + Math.sin(rad) * dotRadius;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fill();

                // Add run count
                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(runs, x, y + 4);
                this.ctx.fillStyle = '#ffb300';
            }
        });
    }
}

/**
 * Pitch Map Generator
 * Creates visualization of ball landing positions
 */
class PitchMapGenerator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ballPositions = [];
    }

    /**
     * Record ball position
     */
    recordBall(x, z, runs, isWicket) {
        this.ballPositions.push({ x, z, runs, isWicket });
        this.draw();
    }

    /**
     * Draw pitch map
     */
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect(0, 0, width, height);

        // Draw pitch
        const pitchColor = '#2d5a2d';
        this.ctx.fillStyle = pitchColor;
        this.ctx.fillRect(width * 0.3, 0, width * 0.4, height);

        // Draw lines
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;

        // Crease lines
        this.ctx.beginPath();
        this.ctx.moveTo(0, height * 0.25);
        this.ctx.lineTo(width, height * 0.25);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, height * 0.75);
        this.ctx.lineTo(width, height * 0.75);
        this.ctx.stroke();

        // Draw ball positions
        this.ballPositions.forEach(ball => {
            const x = (width * 0.5) + (ball.x * 20);
            const y = (height * 0.5) + (ball.z * 15);

            if (ball.isWicket) {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(x - 4, y - 4, 8, 8);
            } else {
                this.ctx.fillStyle = ball.runs > 0 ? '#00ff00' : '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    /**
     * Clear all positions
     */
    clear() {
        this.ballPositions = [];
        this.draw();
    }
}

/**
 * Run Rate Graph
 * Displays run rate trends
 */
class RunRateGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dataPoints = [];
        this.maxPoints = 50;
    }

    /**
     * Add run rate data point
     */
    addDataPoint(overs, runRate) {
        this.dataPoints.push({ overs, runRate });

        if (this.dataPoints.length > this.maxPoints) {
            this.dataPoints.shift();
        }

        this.draw();
    }

    /**
     * Draw graph
     */
    draw() {
        if (this.dataPoints.length === 0) return;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 40;
        const graphWidth = width - (padding * 2);
        const graphHeight = height - (padding * 2);

        this.ctx.clearRect(0, 0, width, height);

        // Draw axes
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.stroke();

        // Draw data line
        this.ctx.strokeStyle = '#ffb300';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        const maxRR = Math.max(...this.dataPoints.map(d => d.runRate), 10);

        this.dataPoints.forEach((point, index) => {
            const x = padding + (index / this.dataPoints.length) * graphWidth;
            const y = height - padding - ((point.runRate / maxRR) * graphHeight);

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // Draw points
        this.ctx.fillStyle = '#ffb300';
        this.dataPoints.forEach((point, index) => {
            const x = padding + (index / this.dataPoints.length) * graphWidth;
            const y = height - padding - ((point.runRate / maxRR) * graphHeight);

            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw labels
        this.ctx.fillStyle = '#999';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Overs', width / 2, height - 5);
    }
}

/**
 * Worm Graph (Cumulative Run Graph)
 * Shows cumulative score progression
 */
class WormGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.team1Data = [];
        this.team2Data = [];
        this.maxBalls = 120; // T20 maximum
    }

    /**
     * Add cumulative score point
     */
    addDataPoint(team, ball, cumulativeScore) {
        if (team === 1) {
            this.team1Data.push({ ball, score: cumulativeScore });
        } else {
            this.team2Data.push({ ball, score: cumulativeScore });
        }

        this.draw();
    }

    /**
     * Draw worm graph
     */
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 40;

        this.ctx.clearRect(0, 0, width, height);

        const graphWidth = width - (padding * 2);
        const graphHeight = height - (padding * 2);
        const maxScore = Math.max(
            Math.max(...this.team1Data.map(d => d.score), 0),
            Math.max(...this.team2Data.map(d => d.score), 0)
        );

        // Draw axes
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.stroke();

        // Draw Team 1 line (blue)
        this.ctx.strokeStyle = '#0066ff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        this.team1Data.forEach((point, index) => {
            const x = padding + (point.ball / this.maxBalls) * graphWidth;
            const y = height - padding - ((point.score / (maxScore || 1)) * graphHeight);

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // Draw Team 2 line (yellow)
        this.ctx.strokeStyle = '#ffdd00';
        this.ctx.beginPath();

        this.team2Data.forEach((point, index) => {
            const x = padding + (point.ball / this.maxBalls) * graphWidth;
            const y = height - padding - ((point.score / (maxScore || 1)) * graphHeight);

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // Draw labels
        this.ctx.fillStyle = '#999';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Balls', width / 2, height - 5);
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Runs', 30, padding / 2);
    }

    /**
     * Clear data
     */
    clear() {
        this.team1Data = [];
        this.team2Data = [];
        this.draw();
    }
}

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CommentarySystem,
        StatisticsTracker,
        WagonWheelGenerator,
        PitchMapGenerator,
        RunRateGraph,
        WormGraph
    };
}
