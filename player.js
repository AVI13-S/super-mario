export class Player {
  constructor() {
    this.resetStats();
    this.resetPosition();
  }

  resetStats() {
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
  }

  resetPosition() {
    this.x = 64;
    this.y = 384;
    this.w = 24;
    this.h = 30;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.grounded = false;
    this.visible = true;
  }
}

export const keys = { left: false, right: false, jump: false, shift: false };

window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = true;
  if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = true;
  if (['ShiftLeft', 'ShiftRight'].includes(e.code)) keys.shift = true;
  if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) keys.jump = true;
});

window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = false;
  if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = false;
  if (['ShiftLeft', 'ShiftRight'].includes(e.code)) keys.shift = false;
  if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) keys.jump = false;
});