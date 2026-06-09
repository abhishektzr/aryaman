# 🏏 Cricket Champions - Phase 1 & 2

## Overview

A full-featured Cricket 24-inspired browser game built with modular architecture.

**Current Phase:** 1-2 (Modularization + UI Polish)  
**Target:** Complete Cricket 24 experience (16-19 weeks)

---

## Phase Status

### ✅ Phase 1: Modularization (COMPLETE)
- [x] Folder structure (core, game, ai, ui, features, audio, data)
- [x] EventBus (Pub/Sub decoupled communication)
- [x] GameState (centralized state management)
- [x] Renderer (Canvas 2D graphics)
- [x] SoundManager (Web Audio API)
- [x] Controls (mobile-optimized UI)
- [x] HUD (scoreboard, commentary)
- [x] Vite bundler configuration
- [x] Main entry point bootstrap

### 🚀 Phase 2: UI Polish (IN PROGRESS)
- [ ] Sound effects integration (bat, boundary, wicket)
- [ ] Animation system (sprite sheets, transitions)
- [ ] Mobile responsive layout
- [ ] Performance optimization
- [ ] Unit tests

### 📋 Phase 3: AI Depth (UPCOMING)
- Smart AI (situation-aware batting/bowling)
- Difficulty tiers (Easy, Medium, Hard, Legend)
- Career mode MVP
- Player progression & achievements

### 🎮 Phase 4: Advanced Features (UPCOMING)
- DRS/Review system with Hawk-Eye visuals
- Multiple formats (T10, T20, ODI)
- Dynamic commentary + Text-to-Speech
- Statistics & leaderboards

### ✨ Phase 5: Polish (UPCOMING)
- Performance optimization (<1 MB bundle)
- Accessibility (keyboard, ARIA)
- 3D graphics groundwork (optional)

---

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Output: `dist/` folder

---

## Project Structure

```
src/
├── main.js                 # Entry point, bootstrapping
├── index.html              # Thin HTML template
│
├── core/
│   ├── GameState.js        # Centralized state machine (400 lines)
│   ├── Renderer.js         # Canvas 2D rendering (300 lines)
│   ├── Physics.js          # Ball/fielder physics (WIP)
│   └── EventBus.js         # Pub/Sub event system
│
├── game/
│   ├── Match.js            # Match orchestration (WIP)
│   ├── Batting.js          # Batting mechanics (WIP)
│   ├── Bowling.js          # Bowling mechanics (WIP)
│   └── Fielding.js         # Fielding AI (WIP)
│
├── ai/
│   ├── AIBatter.js         # Smart batter AI (WIP)
│   ├── AIBowler.js         # Smart bowler AI (WIP)
│   └── Difficulty.js       # Difficulty scaling (WIP)
│
├── ui/
│   ├── Controls.js         # Button grid, touch handling
│   ├── HUD.js              # Scoreboard, commentary display
│   └── Screens/            # Screen components (WIP)
│
├── features/
│   ├── CareerMode.js       # Player progression (WIP)
│   ├── DRSSystem.js        # Review system (WIP)
│   ├── Commentary.js       # Dynamic commentary (WIP)
│   └── Statistics.js       # Stats tracking (WIP)
│
├── audio/
│   └── SoundManager.js     # Audio playback & Web Audio API
│
├── data/
│   ├── teams.js            # Team/squad data (WIP)
│   ├── deliveries.js       # Delivery types (WIP)
│   ├── commentary.js       # 100+ commentary templates (WIP)
│   └── config.js           # Game config constants
│
└── utils/
    ├── EventBus.js         # Event system
    └── Helpers.js          # Math, random utilities (WIP)
```

---

## Architecture

### EventBus Pattern
All game events flow through a centralized EventBus:

```javascript
// Publishing events
eventBus.publish(EVENTS.BALL_PLAYED, { runs: 4, shot: 'DRIVE' });

// Subscribing to events
eventBus.subscribe(EVENTS.BALL_PLAYED, (data) => {
  soundManager.playBoundary();
  hud.updateScore(data.runs);
});
```

### GameState
Single source of truth for all game data:

```javascript
gameState.setState({ score: 150, wkts: 3, balls: 85 });
gameState.setScore(4);
gameState.addWicket(batter, 'bowled');
```

### Renderer
Canvas 2D rendering separated from game logic:

```javascript
renderer.clear();
renderer.drawScene(gameState.getState());
renderer.drawStick(x, y, scale, pose, color);
```

---

## Key Decisions

1. **Vanilla JavaScript** - No React/Vue (simpler, smaller bundle)
2. **Canvas 2D (v1.0)** - Three.js deferred to v2.0
3. **EventBus** - Decouples modules, easier debugging
4. **Vite** - Fast dev server, minimal config
5. **Web Audio API** - Native audio playback

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Desktop FPS | 60 | 60 |
| Mobile FPS | 45+ | TBD |
| Bundle size | <500 KB | ~150 KB (Phase 1) |
| Load time | <3s | TBD |
| AI decision time | <50ms | TBD |

---

## Next Steps (Phase 2)

1. **Sound Effects** - Integrate bat hit, boundary, wicket sounds
2. **Animations** - Sprite sheets for player movements
3. **Mobile Layout** - Responsive design for phones/tablets
4. **Performance** - Profile with Lighthouse, optimize
5. **Testing** - Unit tests for core modules

---

## Development Guidelines

### Adding a New Module

1. Create file in appropriate folder (`src/game/`, `src/ai/`, etc.)
2. Export main class/function
3. Subscribe to EventBus events if needed
4. Import in `main.js` for initialization

### Example: New Feature Module

```javascript
// src/features/MyFeature.js
import { eventBus, EVENTS } from '../utils/EventBus.js';

export class MyFeature {
  constructor() {
    eventBus.subscribe(EVENTS.BALL_PLAYED, (data) => {
      this.handleBall(data);
    });
  }

  handleBall(data) {
    console.log('Feature handling ball:', data);
  }
}

// In main.js
import { MyFeature } from './features/MyFeature.js';
const myFeature = new MyFeature();
```

### Code Style

- **Module exports:** Always export named or default class/function
- **Event publishing:** Use constants from `EVENTS`
- **State updates:** Always use `gameState` setters
- **Logging:** Use `console.log` for debug (will be removed in production)
- **Comments:** Only for non-obvious logic

---

## Debugging

### Enable Detailed Logging
```javascript
// In main.js
const DEBUG = true;
if (DEBUG) {
  eventBus.subscribe('*', (event, data) => {
    console.log(`📡 ${event}:`, data);
  });
}
```

### Inspect Game State
```javascript
// In browser console
window.gameState.getState()
```

### Profile Performance
```bash
# Open DevTools → Performance tab → Record
# npm run build && npm run preview
```

---

## Roadmap (16-19 weeks)

| Week | Phase | Focus | Status |
|------|-------|-------|--------|
| 1-2 | 1 | Modularization | ✅ Done |
| 3-5 | 2 | UI Polish | 🚀 In Progress |
| 6-10 | 3 | AI & Career | 📋 Next |
| 11-15 | 4 | Advanced Features | 📋 Later |
| 16-19 | 5 | Polish & Release | 📋 Final |

---

## Contributing

This is a solo project currently. Architecture is designed for team expansion in Phase 3+.

---

## License

MIT

---

## Contact

For questions or feedback: [Your Email]

---

**Last Updated:** Week 2 (Phase 1 Complete)  
**Next Milestone:** Week 5 (Phase 2 Complete)
