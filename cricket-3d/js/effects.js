/**
 * Visual Effects System
 */

class EffectsManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.explosions = [];
    }

    /**
     * Boundary celebration effect
     */
    createBoundaryEffect(position) {
        const particles = [];
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = 10 + Math.random() * 10;

            particles.push({
                position: position.clone(),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * speed,
                    Math.random() * 5 + 5,
                    Math.sin(angle) * speed
                ),
                life: 2,
                maxLife: 2,
                size: 0.2
            });
        }

        this.particles.push(...particles);
        return particles;
    }

    /**
     * Wicket effect (sparks)
     */
    createWicketEffect(position) {
        const sparks = [];
        for (let i = 0; i < 15; i++) {
            sparks.push({
                position: position.clone(),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 15,
                    Math.random() * 10,
                    (Math.random() - 0.5) * 15
                ),
                life: 1,
                maxLife: 1,
                size: 0.1,
                color: 0xff6b35
            });
        }

        this.particles.push(...sparks);
        return sparks;
    }

    /**
     * Ball impact dust
     */
    createImpactDust(position) {
        const dust = [];
        for (let i = 0; i < 10; i++) {
            dust.push({
                position: position.clone(),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 5,
                    Math.random() * 3,
                    (Math.random() - 0.5) * 5
                ),
                life: 1.5,
                maxLife: 1.5,
                size: 0.15,
                color: 0x8b6914
            });
        }

        this.particles.push(...dust);
        return dust;
    }

    /**
     * Crowd reaction effect
     */
    createCrowdReaction(position) {
        // Flash stadium lights
        const lights = this.scene.children.filter(obj => obj instanceof THREE.Light);
        lights.forEach(light => {
            if (light instanceof THREE.PointLight) {
                const originalIntensity = light.intensity;
                light.intensity *= 1.5;
                setTimeout(() => {
                    light.intensity = originalIntensity;
                }, 100);
            }
        });
    }

    /**
     * Fireworks celebration
     */
    createFireworks(position) {
        const fireworks = [];
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const velocity = 20 + Math.random() * 20;
            const colors = [0xff0000, 0xffb300, 0x00ff00, 0x0066ff];

            fireworks.push({
                position: position.clone(),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * velocity,
                    (Math.random() - 0.3) * velocity,
                    Math.sin(angle) * velocity
                ),
                life: 3,
                maxLife: 3,
                size: 0.3,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        this.particles.push(...fireworks);
        return fireworks;
    }

    /**
     * Update all particles
     */
    update(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.velocity.y -= 9.81 * deltaTime; // gravity
            particle.position.addScaledVector(particle.velocity, deltaTime);
            return particle.life > 0;
        });
    }

    /**
     * Draw particles (in 2D canvas overlay)
     */
    drawParticles(ctx, width, height) {
        // This would draw particles on a 2D canvas if needed
        // For now, handled through Three.js
    }

    /**
     * LUT/Filter effect for match situation
     */
    applyMatchFilter(matchSituation) {
        // Tint screen based on match situation
        switch (matchSituation) {
            case 'wicket':
                // Red flash
                return { color: 0xff0000, intensity: 0.2, duration: 0.3 };
            case 'boundary':
                // Gold flash
                return { color: 0xffb300, intensity: 0.3, duration: 0.2 };
            case 'pressure':
                // Blue tint
                return { color: 0x0066ff, intensity: 0.1, duration: 0.5 };
            default:
                return null;
        }
    }

    /**
     * Screen shake effect
     */
    createScreenShake(intensity = 0.5) {
        return {
            intensity: intensity,
            duration: 0.2,
            startTime: Date.now()
        };
    }

    /**
     * Slow motion effect
     */
    createSlowMoEffect(duration = 0.5) {
        return {
            active: true,
            duration: duration,
            timeScale: 0.3,
            startTime: Date.now()
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EffectsManager;
}
