/**
 * EventBus - Pub/Sub system for decoupled game events
 * Allows GameState to publish events without coupling to listeners
 */

class EventBus {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    };
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in event handler for '${event}':`, err);
      }
    });
  }

  clear(event) {
    if (event) {
      delete this.subscribers[event];
    } else {
      this.subscribers = {};
    }
  }
}

export const eventBus = new EventBus();

// Game events that can be published
export const EVENTS = {
  // Match flow
  MATCH_START: 'match-start',
  INNING_START: 'inning-start',
  INNING_END: 'inning-end',
  MATCH_END: 'match-end',

  // Ball events
  BALL_PLAYED: 'ball-played',
  BOUNDARY: 'boundary',
  WICKET: 'wicket',
  RUN: 'run',
  DOT_BALL: 'dot-ball',

  // Game state
  SCORE_CHANGED: 'score-changed',
  WICKETS_CHANGED: 'wickets-changed',
  OVERS_CHANGED: 'overs-changed',

  // Gameplay
  REVIEW_CHALLENGE: 'review-challenge',
  REVIEW_COMPLETE: 'review-complete',
  BOWLER_CHANGED: 'bowler-changed',

  // UI
  SCREEN_CHANGE: 'screen-change',
  COMMENTARY_UPDATE: 'commentary-update',
};
