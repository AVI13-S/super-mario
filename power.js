import { POWER } from "./constants.js";

export class PowerSystem {
  constructor(availablePowers, onChange) {
    this.availablePowers = availablePowers;
    this.onChange = onChange;
    this.power = POWER.SMALL;
    this.invincibleTimer = 0;
  }

  setPower(power) {
    if (!this.availablePowers.includes(power)) {
      console.warn(
        `Power level "${power}" has no animations defined; ignoring.`,
      );
      return;
    }
    if (this.power != power) {
      this.power = power;
      this.onChange?.(power);
    }
  }

  downgrade() {
    if (this.power === POWER.FIRE) {
      this.setPower(POWER.BIG);
    } else if (this.power === POWER.BIG) {
      this.setPower(POWER.SMALL);
    } else {
      return false; 
    }
    this.invincibleTimer = 1.5;
    return true;
  }

  reset() {
    this.power = POWER.SMALL;
    this.invincibleTimer = 0;
  }

  tick(dt) {
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
  }

  get isInvincible() {
    return this.invincibleTimer > 0;
  }
}
