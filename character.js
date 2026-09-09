import { STATE, POWER, DIRECTION } from "./constants.js";
import { PhysicsBody } from "./physics-body.js";
import { resolvePlayerState } from "./state-machine.js";
import { PowerSystem } from "./power-system.js";
import { SpriteAnimator, flattenAnimations } from "./animator.js";

export class Character {
  constructor(config, startPos = { x: 0, y: 0 }) {
    if (!config || !config.animations) {
      throw new Error("Character requires a config with an `animations` map.");
    }
    this.name = config.name || "unnamed";
    this.sheet = config.sheet;
    this.animations = config.animations;

    this.body = new PhysicsBody(startPos, config.physics || {});

    this.animator = new SpriteAnimator(config.frameDuration ?? 0.09);
    this.animator.setAnimationSet(flattenAnimations(this.animations));

    this.power = new PowerSystem(Object.keys(this.animations), () =>
      this._applyAnimationForState(),
    );

    this.state = STATE.IDLE;
    this.alive = true;

    this._applyAnimationForState();
  }

  get x() {
    return this.body.x;
  }
  set x(v) {
    this.body.x = v;
  }
  get y() {
    return this.body.y;
  }
  set y(v) {
    this.body.y = v;
  }
  get vx() {
    return this.body.vx;
  }
  set vx(v) {
    this.body.vx = v;
  }
  get vy() {
    return this.body.vy;
  }
  set vy(v) {
    this.body.vy = v;
  }
  get facing() {
    return this.body.facing;
  }
  get onGround() {
    return this.body.onGround;
  }

  setPower(power) {
    this.power.setPower(power);
  }

  downgrade() {
    if (!this.power.downgrade()) {
      this.die();
    }
  }

  die() {
    this.alive = false;
    this.state = STATE.DEAD;
    this.body.vx = 0;
    this.body.vy = this.body.physics.jumpImpulse.walk * 0.6; // classic little death hop
    this._applyAnimationForState();
  }

  respawnAt(pos) {
    this.alive = true;
    this.body.x = pos.x;
    this.body.y = pos.y;
    this.body.vx = 0;
    this.body.vy = 0;
    this.state = STATE.IDLE;
    this._applyAnimationForState();
  }

  update(dt, input = {}, world = null) {
    if (!this.alive) {
      this.body.integrate(world, input);
      this.animator.update(dt);
      return;
    }

    this.power.tick(dt);
    this.body.handleHorizontalMovement(input);
    this.body.handleJump(input);
    this.body.integrate(world, input);

    this.state = resolvePlayerState(this.body, input, this.state);
    this._applyAnimationForState();
    this.animator.update(dt); // animation timing stays real-time (dt in seconds)
  }

  _applyAnimationForState() {
    const power = this.power.power;
    const name = `${power}_${this.state}`;
    const fallback = `${power}_${STATE.IDLE}`;
    const noLoop = this.state === STATE.DEAD || this.state === STATE.WIN;
    if (this.animator.allAnimations[name]) {
      this.animator.changeAnimation(name, { loop: !noLoop });
    } else {
      this.animator.changeAnimation(fallback, { loop: true });
    }
  }

  draw(ctx) {
    const frame = this.animator.currentFrame;
    if (!frame || !this.sheet) return;

    if (
      this.power.isInvincible &&
      Math.floor(this.power.invincibleTimer * 20) % 2 == 0
    ) {
      return;
    }

    ctx.save();
    if (this.body.facing === DIRECTION.LEFT) {
      ctx.translate(this.body.x + frame.w, this.body.y);
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.sheet,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        0,
        0,
        frame.w,
        frame.h,
      );
    } else {
      ctx.drawImage(
        this.sheet,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        this.body.x,
        this.body.y,
        frame.w,
        frame.h,
      );
    }
    ctx.restore();
  }

  getBounds() {
    const frame = this.animator.currentFrame;
    const w = frame ? frame.w : 16;
    const h = frame ? frame.h : 16;
    return { x: this.body.x, y: this.body.y, w, h };
  }
}
