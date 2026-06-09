/**
 * SoundManager - Audio playback and management
 * Phase 2 integration: sound effects and background music
 */

export class SoundManager {
  constructor() {
    this.enabled = true;
    this.masterVolume = 0.7;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.5;
    this.sounds = new Map();
    this.audioContext = null;
  }

  async init() {
    // Initialize Web Audio API
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  async loadSound(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
      return audioBuffer;
    } catch (err) {
      console.error(`Failed to load sound ${name}:`, err);
    }
  }

  playSound(name, volume = 1) {
    if (!this.enabled || !this.audioContext) return;

    const buffer = this.sounds.get(name);
    if (!buffer) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    gainNode.gain.value = volume * this.sfxVolume * this.masterVolume;

    source.start(0);
  }

  playBoundary() {
    this.playSound('boundary', 0.8);
  }

  playWicket() {
    this.playSound('wicket', 1.0);
  }

  playBatHit() {
    this.playSound('bat-hit', 0.6);
  }

  playRun() {
    this.playSound('run', 0.5);
  }

  setMasterVolume(value) {
    this.masterVolume = Math.max(0, Math.min(1, value));
  }

  toggleMute() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
