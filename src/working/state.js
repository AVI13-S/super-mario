import { STATE } from './constants.js';

export function resolvePlayerState(body, input, previousState) {
  if (!body.onGround) {
    return body.vy < 0 ? STATE.JUMP : STATE.FALL;
  }
  if (input.duck) {
    return STATE.DUCK;
  }
  if (body.skidding || (previousState === STATE.SKID && Math.abs(body.vx) > 0.05)) {
    return STATE.SKID;
  }
  if (Math.abs(body.vx) < 0.05) {
    return STATE.IDLE;
  }
  if (Math.abs(body.vx) > body.physics.walkMaxSpeed + 0.05) {
    return STATE.RUN;
  }
  return STATE.WALK;
}
 