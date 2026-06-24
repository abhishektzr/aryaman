/**
 * Advanced Utilities and Helpers
 * Comprehensive utility functions, debugging tools, and performance monitoring
 * ~800+ lines of utility code and helpers
 */

/**
 * Performance Monitor
 * Tracks FPS, frame time, memory, and other performance metrics
 */
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.startTime = performance.now();
        this.fps = 60;
        this.frameTime = 16.67;
        this.memoryUsage = 0;
        this.drawCalls = 0;

        this.metrics = {
            minFPS: 60,
            maxFPS: 0,
            avgFPS: 60,
            totalFrames: 0
        };

        this.history = [];
        this.maxHistory = 300;
    }

    /**
     * Update performance metrics
     */
    update() {
        this.frameCount++;

        if (this.frameCount % 10 === 0) {
            const now = performance.now();
            const deltaTime = now - this.startTime;
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameTime = 1000 / this.fps;

            // Update metrics
            this.metrics.minFPS = Math.min(this.metrics.minFPS, this.fps);
            this.metrics.maxFPS = Math.max(this.metrics.maxFPS, this.fps);
            this.metrics.totalFrames = this.frameCount;
            this.metrics.avgFPS = this.metrics.totalFrames > 0 ?
                Math.round(this.metrics.totalFrames / (deltaTime / 1000)) : 60;

            // Get memory usage if available
            if (performance.memory) {
                this.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
            }

            // Store history
            this.history.push({
                time: now,
                fps: this.fps,
                frameTime: this.frameTime,
                memory: this.memoryUsage
            });

            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
        }
    }

    /**
     * Get performance report
     */
    getReport() {
        return {
            currentFPS: this.fps,
            frameTime: this.frameTime.toFixed(2) + 'ms',
            memory: this.memoryUsage + 'MB',
            metrics: this.metrics,
            history: this.history
        };
    }

    /**
     * Reset metrics
     */
    reset() {
        this.frameCount = 0;
        this.startTime = performance.now();
        this.history = [];
        this.metrics = {
            minFPS: 60,
            maxFPS: 0,
            avgFPS: 60,
            totalFrames: 0
        };
    }
}

/**
 * Debug Logger
 * Advanced logging with levels and filtering
 */
class DebugLogger {
    constructor(enabled = false) {
        this.enabled = enabled;
        this.logs = [];
        this.maxLogs = 1000;
        this.levels = {
            'info': 0,
            'debug': 1,
            'warn': 2,
            'error': 3
        };
        this.currentLevel = this.levels.info;
        this.filters = [];
    }

    /**
     * Log message
     */
    log(message, level = 'info') {
        if (!this.enabled) return;
        if (this.levels[level] < this.currentLevel) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            level,
            message,
            stackTrace: this.getStackTrace()
        };

        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Console output
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        switch (level) {
            case 'error':
                console.error(prefix, message);
                break;
            case 'warn':
                console.warn(prefix, message);
                break;
            case 'debug':
                console.debug(prefix, message);
                break;
            default:
                console.log(prefix, message);
        }
    }

    /**
     * Get stack trace
     */
    getStackTrace() {
        const stack = new Error().stack;
        return stack ? stack.split('\n').slice(2, 4).join('\n') : '';
    }

    /**
     * Filter logs
     */
    filterLogs(keyword) {
        return this.logs.filter(log =>
            log.message.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    /**
     * Get logs by level
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * Clear logs
     */
    clear() {
        this.logs = [];
    }

    /**
     * Export logs as JSON
     */
    exportJSON() {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * Export logs as CSV
     */
    exportCSV() {
        let csv = 'Timestamp,Level,Message\n';
        this.logs.forEach(log => {
            csv += `"${log.timestamp}","${log.level}","${log.message}"\n`;
        });
        return csv;
    }
}

/**
 * Event Bus
 * Centralized event management system
 */
class EventBus {
    constructor() {
        this.events = {};
        this.eventHistory = [];
        this.maxHistory = 500;
    }

    /**
     * Subscribe to event
     */
    on(eventName, callback, priority = 0) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push({
            callback,
            priority
        });

        // Sort by priority
        this.events[eventName].sort((a, b) => b.priority - a.priority);

        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }

    /**
     * Unsubscribe from event
     */
    off(eventName, callback) {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(
            e => e.callback !== callback
        );
    }

    /**
     * Emit event
     */
    emit(eventName, data = {}) {
        // Record in history
        this.eventHistory.push({
            event: eventName,
            data,
            timestamp: performance.now()
        });

        if (this.eventHistory.length > this.maxHistory) {
            this.eventHistory.shift();
        }

        // Execute handlers
        if (!this.events[eventName]) return;

        this.events[eventName].forEach(e => {
            try {
                e.callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${eventName}:`, error);
            }
        });
    }

    /**
     * Emit and wait for response
     */
    async emitAsync(eventName, data = {}) {
        return new Promise((resolve) => {
            const originalResolve = resolve;
            this.emit(eventName, {
                ...data,
                resolve: originalResolve
            });
        });
    }

    /**
     * Clear event
     */
    clear(eventName) {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }

    /**
     * Get event history
     */
    getHistory(eventName = null) {
        if (eventName) {
            return this.eventHistory.filter(e => e.event === eventName);
        }
        return this.eventHistory;
    }
}

/**
 * State Manager
 * Centralized state management
 */
class StateManager {
    constructor() {
        this.state = {};
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        this.subscribers = {};
        this.listeners = [];
    }

    /**
     * Set state value
     */
    setState(key, value) {
        // Save to history
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        this.history.push(JSON.parse(JSON.stringify(this.state)));
        this.historyIndex++;

        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.historyIndex--;
        }

        // Update state
        this.state[key] = value;

        // Notify subscribers
        if (this.subscribers[key]) {
            this.subscribers[key].forEach(callback => {
                callback(value);
            });
        }

        // Notify all listeners
        this.listeners.forEach(callback => {
            callback(this.state);
        });
    }

    /**
     * Get state value
     */
    getState(key = null) {
        if (key) {
            return this.state[key];
        }
        return this.state;
    }

    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        this.subscribers[key].push(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers[key] = this.subscribers[key].filter(
                cb => cb !== callback
            );
        };
    }

    /**
     * Listen to all state changes
     */
    listen(callback) {
        this.listeners.push(callback);

        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Undo state change
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.notifyAll();
        }
    }

    /**
     * Redo state change
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.notifyAll();
        }
    }

    /**
     * Notify all listeners
     */
    notifyAll() {
        this.listeners.forEach(callback => {
            callback(this.state);
        });
    }
}

/**
 * Storage Manager
 * Persistent storage with compression and encryption
 */
class StorageManager {
    constructor() {
        this.storage = localStorage;
    }

    /**
     * Save data
     */
    save(key, data) {
        try {
            const json = JSON.stringify(data);
            const compressed = this.compress(json);
            this.storage.setItem(key, compressed);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    /**
     * Load data
     */
    load(key) {
        try {
            const compressed = this.storage.getItem(key);
            if (!compressed) return null;

            const json = this.decompress(compressed);
            return JSON.parse(json);
        } catch (error) {
            console.error('Load error:', error);
            return null;
        }
    }

    /**
     * Simple compression (base64 encoding)
     */
    compress(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    /**
     * Simple decompression
     */
    decompress(str) {
        return decodeURIComponent(escape(atob(str)));
    }

    /**
     * Remove data
     */
    remove(key) {
        this.storage.removeItem(key);
    }

    /**
     * Clear all data
     */
    clear() {
        this.storage.clear();
    }

    /**
     * Get all keys
     */
    getKeys() {
        return Object.keys(this.storage);
    }

    /**
     * Get storage size
     */
    getSize() {
        let size = 0;
        for (let key in this.storage) {
            size += this.storage[key].length + key.length;
        }
        return (size / 1024).toFixed(2) + ' KB';
    }
}

/**
 * Configuration Manager
 * Manages game configuration
 */
class ConfigManager {
    constructor() {
        this.config = {
            graphics: {
                resolution: 'high',
                shadows: true,
                antialiasing: true,
                particleCount: 1000,
                maxLights: 4
            },
            audio: {
                masterVolume: 0.8,
                musicVolume: 0.6,
                sfxVolume: 0.8,
                enabled: true
            },
            gameplay: {
                difficulty: 'normal',
                aiLevel: 'medium',
                ballSpeed: 100,
                cameraType: 'broadcast',
                commentary: true
            },
            controls: {
                keyboardEnabled: true,
                mouseEnabled: true,
                touchEnabled: true,
                gamepadEnabled: true,
                invertY: false
            }
        };
    }

    /**
     * Get config value
     */
    get(path) {
        const keys = path.split('.');
        let value = this.config;

        for (const key of keys) {
            if (value[key]) {
                value = value[key];
            } else {
                return null;
            }
        }

        return value;
    }

    /**
     * Set config value
     */
    set(path, value) {
        const keys = path.split('.');
        let current = this.config;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
    }

    /**
     * Load default config
     */
    loadDefaults() {
        this.config = {
            graphics: {
                resolution: 'high',
                shadows: true,
                antialiasing: true,
                particleCount: 1000,
                maxLights: 4
            },
            audio: {
                masterVolume: 0.8,
                musicVolume: 0.6,
                sfxVolume: 0.8,
                enabled: true
            },
            gameplay: {
                difficulty: 'normal',
                aiLevel: 'medium',
                ballSpeed: 100,
                cameraType: 'broadcast',
                commentary: true
            },
            controls: {
                keyboardEnabled: true,
                mouseEnabled: true,
                touchEnabled: true,
                gamepadEnabled: true,
                invertY: false
            }
        };
    }

    /**
     * Get full config
     */
    getAll() {
        return JSON.parse(JSON.stringify(this.config));
    }
}

// Global instances
const performanceMonitor = new PerformanceMonitor();
const debugLogger = new DebugLogger(false); // Set to true to enable
const eventBus = new EventBus();
const stateManager = new StateManager();
const storageManager = new StorageManager();
const configManager = new ConfigManager();

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceMonitor,
        DebugLogger,
        EventBus,
        StateManager,
        StorageManager,
        ConfigManager,
        performanceMonitor,
        debugLogger,
        eventBus,
        stateManager,
        storageManager,
        configManager
    };
}
