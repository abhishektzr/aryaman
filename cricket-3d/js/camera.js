/**
 * Camera System
 * Multiple camera angles for broadcast, batting, bowling, etc.
 */

class CameraSystem {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.currentCamera = 'broadcast';
        this.cameraTarget = new THREE.Vector3(0, 1, 0);
        this.cameraPosition = new THREE.Vector3(0, 10, 20);
        this.smoothing = 0.08;
        this.replayRotation = 0;
        this.replayRadius = 30;
        this.replayHeight = 15;
    }

    /**
     * Set camera type
     */
    setCamera(type) {
        this.currentCamera = type;
        this.updateCameraPosition();

        // Update UI button
        document.querySelectorAll('.camera-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    /**
     * Update camera position based on current type
     */
    updateCameraPosition() {
        const targetPos = new THREE.Vector3(0, 1, 0);

        switch (this.currentCamera) {
            case 'broadcast':
                this.cameraPosition.set(0, 12, 25);
                targetPos.set(0, 1, 0);
                break;

            case 'batting':
                this.cameraPosition.set(-4, 1.5, 2);
                targetPos.set(0, 1, 0);
                break;

            case 'bowling':
                this.cameraPosition.set(0, 2, -18);
                targetPos.set(0, 1, 0);
                break;

            case 'stump':
                this.cameraPosition.set(2, 1.2, -0.5);
                targetPos.set(0, 0.8, 0);
                break;

            case 'replay':
                // Will be updated in animate loop
                break;
        }

        this.cameraTarget = targetPos;
    }

    /**
     * Smooth camera transition
     */
    updateCamera() {
        if (this.currentCamera === 'replay') {
            this.updateReplayCamera();
        } else {
            // Smooth interpolation
            this.camera.position.lerp(this.cameraPosition, this.smoothing);
            this.camera.lookAt(this.cameraTarget);
        }
    }

    /**
     * Replay camera (rotating around action)
     */
    updateReplayCamera() {
        this.replayRotation += 0.005;

        const x = Math.cos(this.replayRotation) * this.replayRadius;
        const z = Math.sin(this.replayRotation) * this.replayRadius;

        this.camera.position.set(x, this.replayHeight, z);
        this.camera.lookAt(0, 1, 0);
    }

    /**
     * Focus on batter
     */
    focusOnBatter() {
        this.cameraPosition.set(-4, 1.5, 2);
        this.cameraTarget.set(0, 1, 0);
    }

    /**
     * Focus on bowler
     */
    focusOnBowler() {
        this.cameraPosition.set(0, 2, -18);
        this.cameraTarget.set(0, 1, 0);
    }

    /**
     * Focus on catch fielder
     */
    focusOnFielder(fielderPosition) {
        const direction = fielderPosition.clone().normalize();
        this.cameraPosition.copy(fielderPosition).add(direction.multiplyScalar(5));
        this.cameraPosition.y = Math.max(this.cameraPosition.y, 5);
        this.cameraTarget.copy(fielderPosition);
    }

    /**
     * Follow ball trajectory
     */
    followBall(ballPosition) {
        const direction = ballPosition.clone().normalize();
        this.cameraPosition.copy(ballPosition).add(direction.multiplyScalar(-5));
        this.cameraPosition.y = Math.max(this.cameraPosition.y, 2);
        this.cameraTarget.copy(ballPosition);
    }

    /**
     * Celebrate camera angle
     */
    celebrationCamera() {
        this.cameraPosition.set(0, 8, 15);
        this.cameraTarget.set(0, 1, 0);
    }

    /**
     * Wide stadium view
     */
    wideStadiumView() {
        this.cameraPosition.set(0, 25, 40);
        this.cameraTarget.set(0, 5, 0);
    }

    /**
     * Get current camera position
     */
    getPosition() {
        return this.camera.position.clone();
    }

    /**
     * Get current camera target
     */
    getTarget() {
        return this.cameraTarget.clone();
    }

    /**
     * Get current camera type
     */
    getCurrentCamera() {
        return this.currentCamera;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraSystem;
}
