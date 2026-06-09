/**
 * Controls - Button grid and mobile touch handling
 * Phase 2: Mobile-optimized controls
 */

export class Controls {
  constructor() {
    this.container = document.getElementById('controls');
    this.buttons = [];
    this.disabled = false;
    this.setupTouchHandling();
  }

  setupTouchHandling() {
    // Prevent default touch behaviors (zoom, scroll)
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('#cv')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  buildBattingControls(onShot) {
    this.clear();
    const shots = [
      { emoji: '🛡️', name: 'DEFEND', hint: 'Safe block', action: 'DEFEND' },
      { emoji: '🏏', name: 'DRIVE', hint: 'Straight', action: 'DRIVE' },
      { emoji: '✂️', name: 'CUT', hint: 'Point/3rd', action: 'CUT' },
      { emoji: '🚀', name: 'LOFT', hint: 'Go big!', action: 'LOFT' },
    ];

    shots.forEach(shot => {
      const btn = this.createButton(shot, () => onShot(shot.action));
      this.container.appendChild(btn);
      this.buttons.push(btn);
    });

    this.setEnabled(true);
  }

  buildBowlingControls(isSpin, onDeliver) {
    this.clear();

    const deliveries = isSpin ? [
      { emoji: '🔄', name: 'OFF-BREAK', hint: 'Turns away', action: 'OFF-BREAK' },
      { emoji: '🌀', name: 'LEG-SPIN', hint: 'Turns in', action: 'LEG-SPIN' },
      { emoji: '🎭', name: 'GOOGLY', hint: 'Wrong un!', action: 'GOOGLY' },
      { emoji: '🔀', name: 'DOOSRA', hint: 'Other way', action: 'DOOSRA' },
    ] : [
      { emoji: '⚡', name: 'FAST', hint: 'Good length', action: 'FAST' },
      { emoji: '💥', name: 'BOUNCER', hint: 'Short pitch', action: 'BOUNCER' },
      { emoji: '🎯', name: 'YORKER', hint: 'At toes', action: 'YORKER' },
      { emoji: '↙️', name: 'INSWING', hint: 'Swings in', action: 'INSWING' },
    ];

    deliveries.forEach(delivery => {
      const btn = this.createButton(delivery, () => onDeliver(delivery.action));
      this.container.appendChild(btn);
      this.buttons.push(btn);
    });

    this.setEnabled(false); // Wait for aim target
  }

  createButton(config, onClick) {
    const btn = document.createElement('div');
    btn.className = 'ctl dis';
    btn.innerHTML = `
      <div class="em">${config.emoji}</div>
      <div class="cn">${config.name}</div>
      <div class="ch">${config.hint}</div>
    `;
    btn.addEventListener('click', () => {
      if (!this.disabled) onClick();
    });

    // Mobile touch feedback
    btn.addEventListener('touchstart', () => btn.style.opacity = '0.8');
    btn.addEventListener('touchend', () => btn.style.opacity = '1');

    return btn;
  }

  clear() {
    this.container.innerHTML = '';
    this.buttons = [];
  }

  setEnabled(enabled) {
    this.disabled = !enabled;
    this.buttons.forEach(btn => {
      btn.classList.toggle('dis', !enabled);
    });
  }

  highlight(index) {
    this.buttons.forEach((btn, i) => {
      if (i === index) {
        btn.style.borderColor = '#ffb300';
        btn.style.boxShadow = '0 0 10px rgba(255,179,0,0.5)';
      } else {
        btn.style.borderColor = '#2c3445';
        btn.style.boxShadow = 'none';
      }
    });
  }
}

export const controls = new Controls();
