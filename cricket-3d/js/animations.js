/**
 * Animation System
 * Comprehensive animation controller and player animation library
 * ~600+ lines of detailed animation implementation
 */

/**
 * Main Animation Controller
 * Manages animation playback, queueing, and transitions
 */
class AnimationController {
    constructor() {
        this.animations = {};
        this.currentAnimation = null;
        this.animationTime = 0;
        this.animationDuration = 0;
        this.isAnimating = false;
    }

    /**
     * Register animation for a model
     */
    registerAnimation(name, animator) {
        this.animations[name] = animator;
    }

    /**
     * Play animation
     */
    play(name, duration = 1) {
        if (this.animations[name]) {
            this.currentAnimation = name;
            this.animationTime = 0;
            this.animationDuration = duration;
            this.isAnimating = true;
            return true;
        }
        return false;
    }

    /**
     * Update animation
     */
    update(deltaTime) {
        if (!this.isAnimating || !this.currentAnimation) return;

        this.animationTime += deltaTime;
        const progress = Math.min(this.animationTime / this.animationDuration, 1);

        const animator = this.animations[this.currentAnimation];
        if (animator && typeof animator === 'function') {
            animator(progress);
        }

        if (progress >= 1) {
            this.isAnimating = false;
        }
    }

    /**
     * Stop current animation
     */
    stop() {
        this.isAnimating = false;
        this.currentAnimation = null;
        this.animationTime = 0;
    }
}

/**
 * Player animations
 */
class PlayerAnimations {
    /**
     * Bowling run-up animation
     */
    static createFastBowlingAnimation(player) {
        return (progress) => {
            if (progress < 0.3) {
                // Run-up
                player.position.x += 0.15;
            } else if (progress < 0.6) {
                // Bound
                player.position.y += Math.sin(progress * Math.PI) * 0.3;
            } else if (progress < 0.8) {
                // Jump
                player.position.y += Math.sin((progress - 0.6) * Math.PI * 3) * 0.2;
            } else {
                // Release
                player.position.y = 0;
            }

            // Arm movement
            if (player.children.length > 0) {
                const rotationAmount = progress * Math.PI * 2;
                player.rotation.z = Math.sin(rotationAmount) * 0.3;
            }
        };
    }

    /**
     * Spin bowling animation
     */
    static createSpinBowlingAnimation(player) {
        return (progress) => {
            // Approach
            player.position.x += progress * 0.1;

            // Rotation
            player.rotation.y = Math.sin(progress * Math.PI) * 0.4;

            // Arm movement (spinning)
            player.rotation.z = progress * Math.PI * 3;

            // Release point
            if (progress > 0.7) {
                player.position.y = Math.sin((progress - 0.7) * Math.PI) * 0.1;
            }
        };
    }

    /**
     * Batting animation
     */
    static createBattingAnimation(player, shotType = 'drive') {
        return (progress) => {
            let backswing, downswing, followThrough;

            switch (shotType) {
                case 'drive':
                    backswing = progress < 0.3;
                    downswing = progress >= 0.3 && progress < 0.6;
                    followThrough = progress >= 0.6;
                    break;
                case 'pull':
                    backswing = progress < 0.25;
                    downswing = progress >= 0.25 && progress < 0.55;
                    followThrough = progress >= 0.55;
                    break;
                case 'cut':
                    backswing = progress < 0.3;
                    downswing = progress >= 0.3 && progress < 0.65;
                    followThrough = progress >= 0.65;
                    break;
                case 'sweep':
                    backswing = progress < 0.4;
                    downswing = progress >= 0.4 && progress < 0.7;
                    followThrough = progress >= 0.7;
                    break;
                default:
                    backswing = progress < 0.3;
                    downswing = progress >= 0.3 && progress < 0.6;
                    followThrough = progress >= 0.6;
            }

            // Stance
            player.position.x = Math.sin(progress * Math.PI) * 0.05;

            // Rotation (hip and shoulder)
            if (backswing) {
                player.rotation.y = -(progress / 0.3) * Math.PI / 4;
            } else if (downswing) {
                const downswingProgress = (progress - 0.3) / 0.3;
                player.rotation.y = -Math.PI / 4 + downswingProgress * Math.PI / 3;
            } else if (followThrough) {
                const followProgress = (progress - 0.6) / 0.4;
                player.rotation.y = Math.PI / 12 + followProgress * Math.PI / 6;
            }

            // Weight transfer
            if (downswing || followThrough) {
                player.position.z -= (progress - 0.3) * 0.05;
            }
        };
    }

    /**
     * Celebration animation
     */
    static createCelebrationAnimation(player) {
        return (progress) => {
            // Jump
            player.position.y = Math.sin(progress * Math.PI * 2) * 0.2;

            // Spin
            player.rotation.y += progress * Math.PI * 2;

            // Arm waves
            if (player.children.length > 0) {
                player.rotation.x = Math.sin(progress * Math.PI * 4) * 0.2;
            }
        };
    }

    /**
     * Fielding dive animation
     */
    static createDiveAnimation(player, targetPos) {
        return (progress) => {
            const startPos = player.position.clone();

            // Calculate trajectory
            const midPoint = new THREE.Vector3(
                (startPos.x + targetPos.x) / 2,
                Math.max(startPos.y, targetPos.y) + 0.5,
                (startPos.z + targetPos.z) / 2
            );

            // Interpolate position
            if (progress < 0.5) {
                const p = progress / 0.5;
                player.position.lerpVectors(startPos, midPoint, p);
            } else {
                const p = (progress - 0.5) / 0.5;
                player.position.lerpVectors(midPoint, targetPos, p);
            }

            // Rotation (diving motion)
            player.rotation.z = Math.sin(progress * Math.PI) * Math.PI / 3;
            player.rotation.x = progress * Math.PI / 2;
        };
    }

    /**
     * Running between wickets animation
     */
    static createRunningAnimation(player, targetPos, duration) {
        return (progress) => {
            const startPos = player.position.clone();

            // Linear interpolation
            player.position.lerpVectors(startPos, targetPos, progress);

            // Running motion
            player.position.y += Math.sin(progress * Math.PI * 4) * 0.05;

            // Arm swing
            if (player.children.length > 0) {
                player.rotation.x = Math.sin(progress * Math.PI * 4) * 0.1;
            }
        };
    }

    /**
     * Wicket falling animation
     */
    static createWicketAnimation(stumps) {
        return (progress) => {
            if (progress < 0.3) {
                // Initial hit
                stumps.rotation.x = (progress / 0.3) * Math.PI / 2;
            } else {
                // Fall over
                const fallProgress = (progress - 0.3) / 0.7;
                stumps.rotation.x = Math.PI / 2 + fallProgress * Math.PI / 2;
                stumps.position.y = Math.sin(fallProgress * Math.PI / 2) * 0.1;
            }
        };
    }

    /**
     * Commentator gesture animation
     */
    static createGestureAnimation(player, gesture = 'point') {
        return (progress) => {
            switch (gesture) {
                case 'point':
                    player.rotation.y = Math.sin(progress * Math.PI) * Math.PI / 4;
                    break;
                case 'throw':
                    if (progress < 0.5) {
                        player.rotation.z = -(progress / 0.5) * Math.PI / 2;
                    } else {
                        player.rotation.z = -(1 - (progress - 0.5) / 0.5) * Math.PI / 2;
                    }
                    break;
            }
        };
    }

    /**
     * Wicketkeeper movement
     */
    static createWicketkeeperAnimation(player) {
        return (progress) => {
            // Side to side movement
            player.position.x = Math.sin(progress * Math.PI * 2) * 0.15;

            // Crouching motion
            player.position.y = Math.sin(progress * Math.PI * 4) * 0.05;

            // Glove readiness
            player.rotation.y = Math.sin(progress * Math.PI) * 0.2;
        };
    }

    /**
     * Crowd wave animation
     */
    static createCrowdWaveAnimation(crowdSegment) {
        return (progress) => {
            crowdSegment.position.y = Math.sin(progress * Math.PI * 2 + crowdSegment.userData.offset) * 0.1;
            crowdSegment.scale.y = 1 + Math.sin(progress * Math.PI * 2 + crowdSegment.userData.offset) * 0.1;
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationController,
        PlayerAnimations
    };
}
