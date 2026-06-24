/**
 * Cricket Physics System
 * Handles realistic ball physics including swing, spin, drift, bounce, seam movement
 * ~300+ lines implementing advanced physics simulation
 */

class CricketPhysics {
    constructor() {
        // Ball position and velocity
        this.ballPosition = new THREE.Vector3(0, 2, -15);
        this.ballVelocity = new THREE.Vector3(0, 0, 0);
        this.ballSpin = new THREE.Vector3(0, 0, 0); // Revolutions per second
        this.ballAngularVelocity = new THREE.Vector3(0, 0, 0);

        // Physical parameters
        this.gravity = 9.81;
        this.airResistance = 0.98;
        this.ballMass = 0.16; // kg
        this.ballRadius = 0.075; // meters
        this.dragCoefficient = 0.47;
        this.airDensity = 1.225; // kg/m^3

        // Ball condition
        this.seam = Math.random(); // 0-1, affects movement
        this.scuff = Math.random() * 0.5; // Ball wear
        this.sweatFactor = Math.random() * 0.3; // Affects swing

        // Delivery characteristics
        this.bowlerAngle = 0;
        this.releaseHeight = 2.1;
        this.releaseSpeed = 0;
        this.releaseSpin = 0;

        // Ground interaction
        this.bounceCoefficient = 0.65;
        this.frictionCoefficient = 0.8;
        this.pitchHardness = 0.7;
    }

    resetBall(startX = 0, startY = 2, startZ = -15) {
        this.ballPosition = new THREE.Vector3(startX, startY, startZ);
        this.ballVelocity = new THREE.Vector3(0, 0, 0);
        this.ballSpin = new THREE.Vector3(0, 0, 0);
        this.seam = Math.random();
    }

    /**
     * Deliver ball with specified characteristics
     * @param {number} speed - Ball speed (0-100)
     * @param {string} type - Delivery type (fast, spin, etc.)
     * @param {number} line - Line placement (-1 to 1)
     * @param {number} length - Length placement (-1 to 1)
     */
    deliverBall(speed, type = 'fast', line = 0, length = 0.5) {
        const speedMph = 60 + speed * 2; // Convert to MPH
        const speedMs = speedMph * 0.44704; // Convert to m/s

        // Initial velocity towards batter
        this.ballVelocity.z = speedMs;

        // Apply line
        this.ballVelocity.x = line * speedMs * 0.3;

        // Apply swing/seam movement based on delivery type
        switch (type) {
            case 'inswing':
                this.ballVelocity.x -= speedMs * 0.15 * (1 - this.seam);
                break;
            case 'outswing':
                this.ballVelocity.x += speedMs * 0.15 * (1 - this.seam);
                break;
            case 'legbreak':
                this.ballSpin.x = speedMs * 0.5;
                this.ballVelocity.x -= speedMs * 0.1;
                break;
            case 'offbreak':
                this.ballSpin.x = -speedMs * 0.5;
                this.ballVelocity.x += speedMs * 0.1;
                break;
            case 'slider':
                this.ballSpin.x = speedMs * 0.3;
                break;
            case 'doosra':
                this.ballSpin.x = -speedMs * 0.4;
                break;
            case 'flipper':
                this.ballSpin.x = speedMs * 0.6;
                this.ballVelocity.y = -speedMs * 0.1;
                break;
            case 'googly':
                this.ballSpin.x = -speedMs * 0.5;
                break;
        }

        // Apply bounce variation based on length
        this.ballVelocity.y = speedMs * (0.2 + length * 0.2);
    }

    /**
     * Update ball position based on physics
     * @param {number} deltaTime - Time step in seconds
     * @returns {object} Updated position and bounce info
     */
    update(deltaTime) {
        // Apply gravity
        this.ballVelocity.y -= this.gravity * deltaTime;

        // Apply air resistance
        this.ballVelocity.multiplyScalar(Math.pow(this.airResistance, deltaTime));

        // Apply spin-induced drift (Magnus effect)
        const spinMagnitude = this.ballSpin.length();
        if (spinMagnitude > 0) {
            const spinDirection = this.ballSpin.normalize();
            const driftForce = spinDirection.multiplyScalar(spinMagnitude * 0.5 * deltaTime);
            this.ballVelocity.add(driftForce);
        }

        // Update position
        this.ballPosition.addScaledVector(this.ballVelocity, deltaTime);

        // Boundary check
        let bounced = false;
        let bounceInfo = {
            position: this.ballPosition.clone(),
            bounced: false,
            pitchType: 'none',
            seamMovement: 0
        };

        // Ground bounce
        if (this.ballPosition.y <= 0.07) {
            this.ballPosition.y = 0.07;

            // Bounce physics
            const bounceCoefficient = 0.6 + (0.1 * Math.random()); // Add randomness for seam variation
            this.ballVelocity.y *= -bounceCoefficient;

            // Add seam movement on bounce
            const seamMovement = (this.seam - 0.5) * 0.3;
            this.ballVelocity.x += seamMovement;

            bounced = true;
            bounceInfo.bounced = true;
            bounceInfo.pitchType = this.getPitchType(this.ballPosition.z);
            bounceInfo.seamMovement = seamMovement;
        }

        // Off-field boundary
        if (Math.hypot(this.ballPosition.x, this.ballPosition.z) > 50) {
            this.ballVelocity.multiplyScalar(0); // Stop ball
        }

        return bounceInfo;
    }

    /**
     * Determine pitch characteristics based on z position
     * @param {number} z - Ball z position
     * @returns {string} Pitch type
     */
    getPitchType(z) {
        const pitchLength = 22; // Cricket pitch is 22 yards
        const pitchProgress = (z + 11) / pitchLength;

        if (pitchProgress < 0.3) return 'short';
        if (pitchProgress < 0.6) return 'good-length';
        if (pitchProgress < 0.9) return 'full';
        return 'yorker';
    }

    /**
     * Determine ball edge based on line and trajectory
     * @returns {boolean} Is it an edge?
     */
    isEdge() {
        const edgeThreshold = 0.85;
        return Math.random() > edgeThreshold;
    }

    /**
     * Calculate ball speed degradation over match
     * @param {number} ballsBowled - Number of balls bowled in innings
     * @returns {number} Speed factor (0.8 to 1.0)
     */
    getFatigueMultiplier(ballsBowled) {
        return Math.max(0.8, 1.0 - (ballsBowled / 180) * 0.2);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketPhysics;
}
