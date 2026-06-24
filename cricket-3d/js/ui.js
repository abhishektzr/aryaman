/**
 * UI Manager
 * Handles HUD, scoreboard, and UI elements
 */

class UIManager {
    constructor() {
        this.matchState = null;
        this.commentaryHistory = [];
        this.shotHistory = [];
    }

    /**
     * Initialize UI
     */
    init() {
        this.updateShotButtons();
    }

    /**
     * Update entire scoreboard
     */
    updateScoreboard(matchState) {
        this.matchState = matchState;

        // Update scores
        document.getElementById('team1Score').textContent = `${matchState.score}/${matchState.wickets}`;
        document.getElementById('team2Score').textContent = `${matchState.opposition.score}/${matchState.opposition.wickets}`;

        // Update overs
        const overs = Math.floor(matchState.balls / 6);
        const balls = matchState.balls % 6;
        document.getElementById('team1Overs').textContent = `${overs}.${balls} ov`;

        const oppOvers = Math.floor(matchState.opposition.balls / 6);
        const oppBalls = matchState.opposition.balls % 6;
        document.getElementById('team2Overs').textContent = `${oppOvers}.${oppBalls} ov`;

        // Team names
        document.getElementById('team1Name').textContent = matchState.team1.name;
        document.getElementById('team2Name').textContent = matchState.team2.name;
    }

    /**
     * Update batsman info
     */
    updateBatsman(matchState) {
        const batter = matchState.batStats[matchState.striker];
        if (!batter) return;

        document.getElementById('batsmanName').textContent = batter.name;
        document.getElementById('batsmanRuns').textContent = batter.runs;
        document.getElementById('batsmanBalls').textContent = batter.balls;

        const sr = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '-';
        document.getElementById('batsmanSR').textContent = sr;

        document.getElementById('batsmanFours').textContent = batter.fours || 0;
        document.getElementById('batsmanSixes').textContent = batter.sixes || 0;
    }

    /**
     * Update bowler info
     */
    updateBowler(matchState) {
        const bowler = matchState.bowlStats[matchState.bowler];
        if (!bowler) return;

        document.getElementById('bowlerName').textContent = bowler.name;
        document.getElementById('bowlerBalls').textContent = bowler.balls;
        document.getElementById('bowlerRuns').textContent = bowler.runs;

        const economy = bowler.balls > 0 ? ((bowler.runs / bowler.balls) * 6).toFixed(2) : '-';
        document.getElementById('bowlerEconomy').textContent = economy;

        document.getElementById('bowlerWickets').textContent = bowler.wickets || 0;
    }

    /**
     * Update match statistics
     */
    updateMatchStats(matchState) {
        document.getElementById('inningNo').textContent = matchState.inning;

        const rr = matchState.balls > 0 ? ((matchState.score / matchState.balls) * 6).toFixed(2) : '-';
        document.getElementById('runRate').textContent = rr;

        if (matchState.inning === 2 && matchState.target) {
            const reqRuns = matchState.target - matchState.score;
            const ballsLeft = matchState.maxOvers * 6 - matchState.balls;
            const reqRR = ballsLeft > 0 ? ((reqRuns / ballsLeft) * 6).toFixed(2) : '-';
            document.getElementById('reqRR').textContent = reqRR;
        }
    }

    /**
     * Add commentary
     */
    addCommentary(text) {
        document.getElementById('commentary').textContent = text;
        this.commentaryHistory.push({
            text: text,
            time: new Date(),
            type: this.getCommentaryType(text)
        });

        // Keep last 50 comments
        if (this.commentaryHistory.length > 50) {
            this.commentaryHistory.shift();
        }
    }

    /**
     * Get commentary type for styling
     */
    getCommentaryType(text) {
        if (text.includes('WICKET') || text.includes('out')) return 'wicket';
        if (text.includes('SIX') || text.includes('FOUR')) return 'boundary';
        if (text.includes('Dot')) return 'dot';
        return 'regular';
    }

    /**
     * Update shot buttons
     */
    updateShotButtons() {
        const shots = [
            { name: 'Cover Drive', emoji: '→', idx: 0 },
            { name: 'Straight Drive', emoji: '↑', idx: 1 },
            { name: 'Flick', emoji: '↙', idx: 2 },
            { name: 'Pull', emoji: '↓', idx: 3 },
            { name: 'Hook', emoji: '⬇', idx: 4 },
            { name: 'Cut', emoji: '↗', idx: 5 },
            { name: 'Sweep', emoji: '⬅', idx: 6 },
            { name: 'Reverse Sweep', emoji: '↖', idx: 7 },
            { name: 'Upper Cut', emoji: '⬆', idx: 8 },
            { name: 'Lofted Drive', emoji: '⬈', idx: 9 },
            { name: 'Paddle Sweep', emoji: '⬇', idx: 10 },
            { name: 'Ramp', emoji: '↖', idx: 11 },
            { name: 'Helicopter', emoji: '🚁', idx: 12 },
            { name: 'Defend', emoji: '🛡', idx: 13 },
            { name: 'Drop', emoji: '.', idx: 14 }
        ];

        const html = shots.map(shot => `
            <button class="shot-btn" onclick="window.gameInstance.playShot(${shot.idx})" title="${shot.name}">
                ${shot.emoji}
            </button>
        `).join('');

        document.getElementById('shotButtons').innerHTML = html;
    }

    /**
     * Update wagon wheel
     */
    updateWagonWheel(shotData) {
        const canvas = document.getElementById('wagonWheelCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 200, 200);

        // Draw wagon wheel grid
        ctx.strokeStyle = '#2a3f5f';
        ctx.lineWidth = 1;

        const centerX = 100, centerY = 100;

        // Draw circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.stroke();

        // Draw lines for fielding positions
        const positions = 8;
        for (let i = 0; i < positions; i++) {
            const angle = (i / positions) * Math.PI * 2;
            const x1 = centerX + Math.cos(angle) * 80;
            const y1 = centerY + Math.sin(angle) * 80;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }

        // Draw shot dots
        if (shotData && shotData.length > 0) {
            shotData.forEach(shot => {
                const angle = shot.angle || 0;
                const distance = (shot.runs / 6) * 80; // Scale runs to distance
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;

                ctx.fillStyle = shot.runs === 6 ? '#ffb300' : shot.runs === 4 ? '#ff6b35' : '#22c55e';
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    /**
     * Show menu
     */
    showMenu() {
        const menu = document.getElementById('menuOverlay');
        if (menu) menu.classList.add('active');
    }

    /**
     * Hide menu
     */
    hideMenu() {
        const menu = document.getElementById('menuOverlay');
        if (menu) menu.classList.remove('active');
    }

    /**
     * Update all UI
     */
    updateAll(matchState) {
        this.updateScoreboard(matchState);
        this.updateBatsman(matchState);
        this.updateBowler(matchState);
        this.updateMatchStats(matchState);
    }

    /**
     * Show match result
     */
    showResult(matchState, result) {
        const resultText = result.winner
            ? `${result.winner} wins!`
            : 'Match Tied!';

        this.addCommentary(`🏆 MATCH OVER! ${resultText}`);
        alert(resultText);
    }

    /**
     * Show pitch map
     */
    showPitchMap() {
        // Canvas-based pitch visualization
    }

    /**
     * Show scoreboard details
     */
    showScorecard(matchState) {
        let html = '<div class="scorecard"><h3>SCORECARD</h3>';
        html += '<h4>Batting</h4>';

        matchState.batStats.forEach((batter, idx) => {
            html += `<div>${batter.name}: ${batter.runs}(${batter.balls})</div>`;
        });

        html += '<h4>Bowling</h4>';
        matchState.bowlStats.forEach((bowler, idx) => {
            const econ = bowler.balls > 0 ? ((bowler.runs / bowler.balls) * 6).toFixed(2) : '-';
            html += `<div>${bowler.name}: ${bowler.runs}/${bowler.wickets} (${bowler.balls})</div>`;
        });

        html += '</div>';
        // Display scorecard
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
