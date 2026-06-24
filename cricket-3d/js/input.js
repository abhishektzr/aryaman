/**
 * Input Manager
 * Handles mouse, keyboard, and touch input
 */

class InputManager {
    constructor() {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.touchX = 0;
        this.touchY = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Mouse
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        document.addEventListener('mousedown', (e) => {
            this.handleMouseDown(e);
        });

        document.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // Touch
        document.addEventListener('touchstart', (e) => {
            this.touchX = e.touches[0].clientX;
            this.touchY = e.touches[0].clientY;
            this.handleTouchStart(e);
        });

        document.addEventListener('touchmove', (e) => {
            this.touchX = e.touches[0].clientX;
            this.touchY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        });

        // Window
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Handle keyboard input
     */
    handleKeyDown(e) {
        const key = e.key.toLowerCase();

        // Numeric keys for shots
        if (key >= '1' && key <= '9') {
            const shotIdx = parseInt(key) - 1;
            if (window.gameInstance) {
                window.gameInstance.playShot(shotIdx);
            }
        }

        // Camera switching
        switch (key) {
            case 'b':
                if (window.gameInstance && window.gameInstance.camera) {
                    window.gameInstance.camera.setCamera('broadcast');
                }
                break;
            case 'c':
                if (window.gameInstance && window.gameInstance.camera) {
                    window.gameInstance.camera.setCamera('batting');
                }
                break;
            case 'p':
                if (window.gameInstance && window.gameInstance.camera) {
                    window.gameInstance.camera.setCamera('replay');
                }
                break;
            case 'escape':
                // Pause menu
                break;
        }
    }

    /**
     * Handle mouse down
     */
    handleMouseDown(e) {
        // For future context menu or special actions
    }

    /**
     * Handle click
     */
    handleClick(e) {
        // Click is mainly handled by buttons
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        const touch = e.touches[0];
        // Handle touch input
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        // Swipe detection and actions
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (window.gameInstance && window.gameInstance.scene) {
            window.gameInstance.scene.onWindowResize();
        }
    }

    /**
     * Check if key is pressed
     */
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    /**
     * Get mouse position
     */
    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }

    /**
     * Get touch position
     */
    getTouchPosition() {
        return { x: this.touchX, y: this.touchY };
    }

    /**
     * Get mouse to normalized device coordinates
     */
    getMouseNDC() {
        return {
            x: (this.mouseX / window.innerWidth) * 2 - 1,
            y: -(this.mouseY / window.innerHeight) * 2 + 1
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}
