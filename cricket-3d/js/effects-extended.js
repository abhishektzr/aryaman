/**
 * Advanced Effects System
 * Particles, celebrations, visual effects, crowd animations
 * ~700+ lines of visual effects code
 */

/**
 * Particle System
 * Creates and manages particle effects
 */
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 1000;
    }

    /**
     * Create explosion particles
     */
    createExplosion(position, color = 0xff6b35, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 15 + 10;

            const particle = {
                position: position.clone(),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * speed,
                    Math.random() * 10 + 5,
                    Math.sin(angle) * speed
                ),
                lifetime: 1 + Math.random() * 0.5,
                maxLifetime: 1.5,
                color,
                size: Math.random() * 0.3 + 0.2,
                gravity: 9.81,
                mesh: this.createParticleMesh(color)
            };

            this.scene.add(particle.mesh);
            this.particles.push(particle);
        }
    }

    /**
     * Create fireworks
     */
    createFireworks(position, burst = true) {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

        if (burst) {
            for (let i = 0; i < 5; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.createExplosion(position.clone(), color, 15);
            }
        }
    }

    /**
     * Create smoke trail
     */
    createSmokeTrail(startPos, endPos, steps = 10) {
        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const pos = new THREE.Vector3();
            pos.lerpVectors(startPos, endPos, progress);

            // Add randomness
            pos.x += (Math.random() - 0.5) * 0.5;
            pos.y += (Math.random() - 0.5) * 0.5;
            pos.z += (Math.random() - 0.5) * 0.5;

            const particle = {
                position: pos,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    Math.random() * 1,
                    (Math.random() - 0.5) * 2
                ),
                lifetime: 0.5,
                maxLifetime: 0.8,
                color: 0x888888,
                size: Math.random() * 0.5 + 0.3,
                mesh: this.createParticleMesh(0x888888, 0.5)
            };

            this.scene.add(particle.mesh);
            this.particles.push(particle);
        }
    }

    /**
     * Create particle mesh
     */
    createParticleMesh(color, opacity = 1) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            sizeAttenuation: true
        });

        return new THREE.Mesh(geometry, material);
    }

    /**
     * Update all particles
     */
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update lifetime
            p.lifetime -= deltaTime;

            if (p.lifetime <= 0) {
                this.scene.remove(p.mesh);
                this.particles.splice(i, 1);
                continue;
            }

            // Apply gravity
            p.velocity.y -= p.gravity * deltaTime;

            // Apply damping
            p.velocity.multiplyScalar(0.95);

            // Update position
            p.position.addScaledVector(p.velocity, deltaTime);

            // Update mesh
            p.mesh.position.copy(p.position);

            // Fade out
            const progress = 1 - (p.lifetime / p.maxLifetime);
            p.mesh.material.opacity = 1 - progress;

            // Update size
            p.mesh.scale.setScalar(p.size * (1 - progress * 0.5));
        }
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles.forEach(p => this.scene.remove(p.mesh));
        this.particles = [];
    }
}

/**
 * Crowd Animation System
 * Manages crowd animations and reactions
 */
class CrowdAnimationSystem {
    constructor(scene) {
        this.scene = scene;
        this.crowdSegments = [];
        this.waveActive = false;
        this.waveProgress = 0;
    }

    /**
     * Create crowd segments
     */
    createCrowd(count = 100) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const distance = 100 + Math.random() * 20;

            const segmentGroup = new THREE.Group();
            segmentGroup.userData.offset = angle;
            segmentGroup.userData.baseScale = 1;

            // Create simple crowd figure
            const crowdMesh = new THREE.Mesh(
                new THREE.ConeGeometry(0.3, 1, 8),
                new THREE.MeshStandardMaterial({ color: 0xff6b35 })
            );

            crowdMesh.position.set(
                Math.cos(angle) * distance,
                0.5,
                Math.sin(angle) * distance
            );

            segmentGroup.add(crowdMesh);
            this.scene.add(segmentGroup);
            this.crowdSegments.push(segmentGroup);
        }
    }

    /**
     * Start crowd wave
     */
    startWave() {
        this.waveActive = true;
        this.waveProgress = 0;
    }

    /**
     * Animate crowd for boundary
     */
    animateBoundary(runs) {
        this.crowdSegments.forEach((segment, idx) => {
            const jumpHeight = runs === 6 ? 0.8 : 0.4;
            const duration = 0.5;

            // Animate jump
            const startY = segment.position.y;
            segment.userData.jumpStartTime = Date.now();
            segment.userData.jumpDuration = duration;
            segment.userData.jumpHeight = jumpHeight;
            segment.userData.jumpStartY = startY;
        });
    }

    /**
     * Animate crowd for wicket
     */
    animateWicket() {
        this.crowdSegments.forEach(segment => {
            segment.userData.celebrateStartTime = Date.now();
            segment.userData.celebratingDuration = 1.0;
        });
    }

    /**
     * Update crowd animations
     */
    update(deltaTime) {
        // Update wave
        if (this.waveActive) {
            this.waveProgress += deltaTime * 2; // Speed of wave

            this.crowdSegments.forEach((segment, idx) => {
                const delayedProgress = this.waveProgress - (idx * 0.02);

                if (delayedProgress > 0 && delayedProgress < 1) {
                    const waveHeight = Math.sin(delayedProgress * Math.PI) * 1.5;
                    segment.position.y = waveHeight;
                    segment.scale.y = 1 + waveHeight * 0.2;
                } else if (delayedProgress >= 1) {
                    segment.position.y = 0;
                    segment.scale.y = 1;
                }
            });

            if (this.waveProgress > 1.5) {
                this.waveActive = false;
            }
        }

        // Update jump animations
        this.crowdSegments.forEach(segment => {
            if (segment.userData.jumpStartTime) {
                const elapsed = (Date.now() - segment.userData.jumpStartTime) / 1000;
                const progress = Math.min(elapsed / segment.userData.jumpDuration, 1);

                if (progress < 1) {
                    const jumpAmount = Math.sin(progress * Math.PI) * segment.userData.jumpHeight;
                    segment.position.y = segment.userData.jumpStartY + jumpAmount;
                } else {
                    segment.position.y = segment.userData.jumpStartY;
                    delete segment.userData.jumpStartTime;
                }
            }

            // Update celebration
            if (segment.userData.celebrateStartTime) {
                const elapsed = (Date.now() - segment.userData.celebrateStartTime) / 1000;
                const progress = Math.min(elapsed / segment.userData.celebratingDuration, 1);

                if (progress < 1) {
                    segment.rotation.z = Math.sin(progress * Math.PI * 4) * 0.3;
                    const celebrateHeight = Math.sin(progress * Math.PI * 2) * 0.5;
                    segment.position.y = celebrateHeight;
                } else {
                    segment.rotation.z = 0;
                    segment.position.y = 0;
                    delete segment.userData.celebrateStartTime;
                }
            }
        });
    }

    /**
     * Clear crowd
     */
    clear() {
        this.crowdSegments.forEach(segment => this.scene.remove(segment));
        this.crowdSegments = [];
    }
}

/**
 * Visual Effects Manager
 * Manages all visual effects in the game
 */
class VisualEffectsManager {
    constructor(scene) {
        this.scene = scene;
        this.particleSystem = new ParticleSystem(scene);
        this.crowdSystem = new CrowdAnimationSystem(scene);
    }

    /**
     * Play wicket effect
     */
    playWicketEffect(position) {
        // Explosion at stump
        this.particleSystem.createExplosion(position, 0xff0000, 30);

        // Crowd reaction
        this.crowdSystem.animateWicket();
    }

    /**
     * Play boundary effect
     */
    playBoundaryEffect(runs) {
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 100,
            5,
            (Math.random() - 0.5) * 100
        );

        // Explosion effect
        const color = runs === 6 ? 0xffff00 : 0x00ff00;
        this.particleSystem.createExplosion(position, color, 15);

        // Crowd reaction
        this.crowdSystem.animateBoundary(runs);

        // Fireworks for 6
        if (runs === 6) {
            this.particleSystem.createFireworks(position.clone());
        }
    }

    /**
     * Play ball trail effect
     */
    playBallTrail(startPos, endPos) {
        this.particleSystem.createSmokeTrail(startPos, endPos);
    }

    /**
     * Update all effects
     */
    update(deltaTime) {
        this.particleSystem.update(deltaTime);
        this.crowdSystem.update(deltaTime);
    }

    /**
     * Clear all effects
     */
    clear() {
        this.particleSystem.clear();
        this.crowdSystem.clear();
    }
}

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        CrowdAnimationSystem,
        VisualEffectsManager
    };
}
