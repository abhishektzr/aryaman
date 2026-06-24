/**
 * Extended Input System and Utilities
 * Comprehensive input handling, gesture recognition, and game utilities
 * ~900+ lines of advanced input and utility code
 */

/**
 * Advanced Input Manager
 * Handles keyboard, mouse, touch, and gamepad input
 */
class AdvancedInputManager {
    constructor() {
        this.keyState = {};
        this.mouseState = {
            x: 0,
            y: 0,
            down: false,
            clicked: false,
            deltaX: 0,
            deltaY: 0
        };
        this.touchState = {
            active: false,
            points: [],
            startX: 0,
            startY: 0,
            deltaX: 0,
            deltaY: 0
        };
        this.gamepadState = {
            connected: false,
            axes: [0, 0, 0, 0],
            buttons: []
        };

        this.inputCallbacks = {};
        this.gestureRecognizers = [];

        this.initializeInputListeners();
    }

    /**
     * Initialize all input listeners
     */
    initializeInputListeners() {
        // Keyboard
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Mouse
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        document.addEventListener('click', (e) => this.handleMouseClick(e));
        document.addEventListener('wheel', (e) => this.handleMouseWheel(e));

        // Touch
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Gamepad
        window.addEventListener('gamepadconnected', (e) => this.handleGamepadConnected(e));
        window.addEventListener('gamepaddisconnected', (e) => this.handleGamepadDisconnected(e));
    }

    /**
     * Handle keyboard down
     */
    handleKeyDown(event) {
        this.keyState[event.key] = true;
        this.keyState[event.code] = true;

        // Trigger callbacks
        if (this.inputCallbacks[`keydown:${event.key}`]) {
            this.inputCallbacks[`keydown:${event.key}`](event);
        }

        // Number pad shortcuts (1-9 for shots)
        if (event.key >= '1' && event.key <= '9') {
            const shotIndex = parseInt(event.key) - 1;
            if (this.inputCallbacks['shot']) {
                this.inputCallbacks['shot'](shotIndex);
            }
        }

        // Space for timing
        if (event.key === ' ') {
            event.preventDefault();
            if (this.inputCallbacks['timing']) {
                this.inputCallbacks['timing']();
            }
        }
    }

    /**
     * Handle keyboard up
     */
    handleKeyUp(event) {
        this.keyState[event.key] = false;
        this.keyState[event.code] = false;

        if (this.inputCallbacks[`keyup:${event.key}`]) {
            this.inputCallbacks[`keyup:${event.key}`](event);
        }
    }

    /**
     * Handle mouse movement
     */
    handleMouseMove(event) {
        this.mouseState.deltaX = event.clientX - this.mouseState.x;
        this.mouseState.deltaY = event.clientY - this.mouseState.y;
        this.mouseState.x = event.clientX;
        this.mouseState.y = event.clientY;

        if (this.inputCallbacks['mousemove']) {
            this.inputCallbacks['mousemove'](this.mouseState);
        }
    }

    /**
     * Handle mouse down
     */
    handleMouseDown(event) {
        this.mouseState.down = true;
        this.mouseState.startX = event.clientX;
        this.mouseState.startY = event.clientY;

        if (this.inputCallbacks['mousedown']) {
            this.inputCallbacks['mousedown'](this.mouseState);
        }
    }

    /**
     * Handle mouse up
     */
    handleMouseUp(event) {
        this.mouseState.down = false;

        if (this.inputCallbacks['mouseup']) {
            this.inputCallbacks['mouseup'](this.mouseState);
        }
    }

    /**
     * Handle mouse click
     */
    handleMouseClick(event) {
        this.mouseState.clicked = true;

        if (this.inputCallbacks['click']) {
            this.inputCallbacks['click']({
                x: event.clientX,
                y: event.clientY,
                target: event.target
            });
        }
    }

    /**
     * Handle mouse wheel
     */
    handleMouseWheel(event) {
        event.preventDefault();

        const direction = event.deltaY > 0 ? 'down' : 'up';
        const amount = Math.abs(event.deltaY);

        if (this.inputCallbacks['wheel']) {
            this.inputCallbacks['wheel']({ direction, amount });
        }
    }

    /**
     * Handle touch start
     */
    handleTouchStart(event) {
        this.touchState.active = true;
        this.touchState.startX = event.touches[0].clientX;
        this.touchState.startY = event.touches[0].clientY;
        this.touchState.points = Array.from(event.touches).map(t => ({
            x: t.clientX,
            y: t.clientY,
            id: t.identifier
        }));

        if (this.inputCallbacks['touchstart']) {
            this.inputCallbacks['touchstart'](this.touchState);
        }
    }

    /**
     * Handle touch move
     */
    handleTouchMove(event) {
        if (this.touchState.points.length > 0) {
            this.touchState.deltaX = event.touches[0].clientX - this.touchState.points[0].x;
            this.touchState.deltaY = event.touches[0].clientY - this.touchState.points[0].y;

            // Recognize gestures
            this.recognizeGestures();
        }

        this.touchState.points = Array.from(event.touches).map(t => ({
            x: t.clientX,
            y: t.clientY,
            id: t.identifier
        }));

        if (this.inputCallbacks['touchmove']) {
            this.inputCallbacks['touchmove'](this.touchState);
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(event) {
        this.touchState.active = false;
        this.touchState.points = Array.from(event.touches).map(t => ({
            x: t.clientX,
            y: t.clientY,
            id: t.identifier
        }));

        if (this.inputCallbacks['touchend']) {
            this.inputCallbacks['touchend'](this.touchState);
        }
    }

    /**
     * Recognize touch gestures
     */
    recognizeGestures() {
        const deltaX = this.touchState.deltaX;
        const deltaY = this.touchState.deltaY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Swipe right
        if (deltaX > 50 && Math.abs(deltaY) < 30) {
            if (this.inputCallbacks['swiperight']) {
                this.inputCallbacks['swiperight']();
            }
        }

        // Swipe left
        if (deltaX < -50 && Math.abs(deltaY) < 30) {
            if (this.inputCallbacks['swipeleft']) {
                this.inputCallbacks['swipeleft']();
            }
        }

        // Swipe up
        if (deltaY < -50 && Math.abs(deltaX) < 30) {
            if (this.inputCallbacks['swipeup']) {
                this.inputCallbacks['swipeup']();
            }
        }

        // Swipe down
        if (deltaY > 50 && Math.abs(deltaX) < 30) {
            if (this.inputCallbacks['swipedown']) {
                this.inputCallbacks['swipedown']();
            }
        }

        // Two finger pinch
        if (this.touchState.points.length === 2) {
            const p1 = this.touchState.points[0];
            const p2 = this.touchState.points[1];
            const pinchDist = Math.sqrt(
                Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
            );

            if (this.inputCallbacks['pinch']) {
                this.inputCallbacks['pinch']({ distance: pinchDist });
            }
        }
    }

    /**
     * Handle gamepad connected
     */
    handleGamepadConnected(event) {
        console.log('Gamepad connected:', event.gamepad);
        this.gamepadState.connected = true;

        if (this.inputCallbacks['gamepadconnected']) {
            this.inputCallbacks['gamepadconnected'](event.gamepad);
        }
    }

    /**
     * Handle gamepad disconnected
     */
    handleGamepadDisconnected(event) {
        console.log('Gamepad disconnected');
        this.gamepadState.connected = false;

        if (this.inputCallbacks['gamepaddisconnected']) {
            this.inputCallbacks['gamepaddisconnected']();
        }
    }

    /**
     * Register input callback
     */
    registerCallback(event, callback) {
        this.inputCallbacks[event] = callback;
    }

    /**
     * Get key state
     */
    isKeyPressed(key) {
        return this.keyState[key] === true;
    }

    /**
     * Get mouse position
     */
    getMousePosition() {
        return { x: this.mouseState.x, y: this.mouseState.y };
    }

    /**
     * Get touch position
     */
    getTouchPosition() {
        if (this.touchState.points.length > 0) {
            return { x: this.touchState.points[0].x, y: this.touchState.points[0].y };
        }
        return null;
    }

    /**
     * Update gamepad state
     */
    updateGamepad() {
        if (!this.gamepadState.connected) return;

        const gamepads = navigator.getGamepads();
        if (gamepads[0]) {
            this.gamepadState.axes = gamepads[0].axes;
            this.gamepadState.buttons = gamepads[0].buttons.map(b => b.pressed);
        }
    }
}

/**
 * Game Utilities
 * Useful helper functions and utilities
 */
class GameUtilities {
    /**
     * Calculate distance between two points
     */
    static distance(p1, p2) {
        return Math.sqrt(
            Math.pow(p2.x - p1.x, 2) +
            Math.pow(p2.y - p1.y, 2) +
            Math.pow(p2.z - p1.z, 2)
        );
    }

    /**
     * Calculate angle between vectors
     */
    static angle(v1, v2) {
        const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
        return Math.acos(dot / (mag1 * mag2));
    }

    /**
     * Interpolate between two values
     */
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Clamp value between min and max
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Random integer between min and max
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Random float between min and max
     */
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Normalize angle to 0-360
     */
    static normalizeAngle(angle) {
        return ((angle % 360) + 360) % 360;
    }

    /**
     * Convert degrees to radians
     */
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     */
    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Format number with commas
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Format time in MM:SS
     */
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    /**
     * Smooth step function
     */
    static smoothstep(t) {
        return t * t * (3 - 2 * t);
    }

    /**
     * Ease out function
     */
    static easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Ease in function
     */
    static easeIn(t) {
        return t * t * t;
    }

    /**
     * Ease in-out function
     */
    static easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * Sleep for N milliseconds
     */
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Deep clone object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const cloned = {};
            for (const key in obj) {
                cloned[key] = this.deepClone(obj[key]);
            }
            return cloned;
        }
    }

    /**
     * Merge objects
     */
    static merge(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    target[key] = this.merge(target[key] || {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    /**
     * Log with timestamp
     */
    static log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
        console.log(`${prefix} ${message}`);
    }

    /**
     * Assert condition
     */
    static assert(condition, message) {
        if (!condition) {
            this.log(`ASSERTION FAILED: ${message}`, 'error');
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    /**
     * Performance timer
     */
    static startTimer(label) {
        window.timerStart = performance.now();
        return label;
    }

    static endTimer(label) {
        const elapsed = performance.now() - window.timerStart;
        this.log(`${label} took ${elapsed.toFixed(2)}ms`, 'timing');
        return elapsed;
    }
}

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AdvancedInputManager,
        GameUtilities
    };
}
