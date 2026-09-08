import { DEFAULT_PHYSICS, DIRECTION } from './constants.js';

function moveToward(current, target, maxDelta) {
  if (current < target) return Math.min(current + maxDelta, target);
  if (current > target) return Math.max(current - maxDelta, target);
  return current;
}

export class PhysicsBody {
  constructor(startPos = { x: 0, y: 0 }, physicsOverrides = {}) {
    this.physics = { ...DEFAULT_PHYSICS, ...physicsOverrides };
 
    this.x = startPos.x;
    this.y = startPos.y;
    this.vx = 0;
    this.vy = 0;
    this.facing = DIRECTION.RIGHT;
    this.onGround = false;
    this.jumpHeld = false;
    this.skidding = false;
  }
 
  handleHorizontalMovement(input = {}) {
    const p = this.physics;
    const accel = input.run ? p.runAccel : p.walkAccel;
    const maxSpeed = input.run ? p.runMaxSpeed : p.walkMaxSpeed;
    let inputDir = 0;
    if (input.left) inputDir -= 1;
    if (input.right) inputDir += 1;
 
    this.skidding = false;
 
    if (input.duck && this.onGround) {
      this.vx = 0;
      return;
    }
 
    const movingOpposite =
      inputDir != 0 && Math.sign(this.vx) != 0 && Math.sign(this.vx) != inputDir;
 
    if (movingOpposite && this.onGround) {
      this.skidding = true;
      this.vx = moveToward(this.vx, 0, p.skidDecel);
    } else if (inputDir !== 0) {
      this.facing = inputDir > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
      this.vx = moveToward(this.vx, inputDir * maxSpeed, accel);
    } else {
      this.vx = moveToward(this.vx, 0, p.releaseDecel);
    }
  }
 
  handleJump(input = {}) {
    const p = this.physics;
    const wantsJump = !!input.jump;
 
    if (wantsJump && !this.jumpHeld && this.onGround) {
      const isFastJump = Math.abs(this.vx) >= p.speedThreshold;
      this.vy = isFastJump ? p.jumpImpulse.run : p.jumpImpulse.walk;
      this.onGround = false;
    }
    this.jumpHeld = wantsJump;
  }
 
  _currentGravity(input) {
    const p = this.physics;
    const isFast = Math.abs(this.vx) >= p.speedThreshold;
    const ascending = this.vy < 0 && input.jump;
    if (ascending) return isFast ? p.gravity.fastAscent : p.gravity.slowAscent;
    return isFast ? p.gravity.fastDescent : p.gravity.slowDescent;
  }

  integrate(world = null, input = {}) {
    const p = this.physics;
    const gravity = this._currentGravity(input);
    this.vy = Math.min(this.vy + gravity, p.terminalVelocity);
    this.x += this.vx;
    this.y += this.vy;
 
    const groundY = world && typeof world.groundYAt === 'function'
      ? world.groundYAt(this.x)
      : p.groundY;
 
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }
}