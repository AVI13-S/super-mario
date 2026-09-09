import { Character } from "./character.js";

export class CharacterManager {
  constructor(characterConfigs, startPos) {
    this.characters = characterConfigs.map(
      (cfg) => new Character(cfg, startPos),
    );
    this.activeIndex = 0;
    this.selectionLocked = false;
  }

  get active() {
    return this.characters[this.activeIndex];
  }

  lockSelection() {
    this.selectionLocked = true;
  }

  unlockSelection() {
    this.selectionLocked = false;
  }

  switchTo(target) {
    if (this.selectionLocked) {
      console.warn(
        "Character switching is locked for this run — call unlockSelection() first.",
      );
      return;
    }

    const nextIndex =
      typeof target === "number"
        ? target
        : this.characters.findIndex((c) => c.name === target);

    if (nextIndex < 0 || nextIndex === this.activeIndex) return;

    const prev = this.active;
    const next = this.characters[nextIndex];

    next.body.x = prev.body.x;
    next.body.y = prev.body.y;
    next.body.vx = prev.body.vx;
    next.body.vy = prev.body.vy;
    next.body.facing = prev.body.facing;
    next.body.onGround = prev.body.onGround;
    this.activeIndex = nextIndex;
  }

  update(dt, input, world) {
    this.active.update(dt, input, world);
  }

  draw(ctx) {
    this.active.draw(ctx);
  }
}
