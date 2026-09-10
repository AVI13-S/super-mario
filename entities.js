export class EntityManager {
  constructor() {
    this.enemies = [];
    this.worldCoins = [];
    this.poppingCoins = [];
  }

  loadForLevel(levelManager) {
    this.enemies = levelManager.getEnemies();
    this.worldCoins = levelManager.getCoins();
    this.poppingCoins = [];
  }

  addPoppingCoin(x, y) {
    this.poppingCoins.push({ x, y, vy: -6.0, life: 22 });
  }

  updatePoppingCoins() {
    for (let i = this.poppingCoins.length - 1; i >= 0; i--) {
      const c = this.poppingCoins[i];
      c.y += c.vy;
      c.vy += 0.42;
      if (--c.life <= 0) this.poppingCoins.splice(i, 1);
    }
  }
}