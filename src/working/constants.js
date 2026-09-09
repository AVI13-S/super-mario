export const STATE = Object.freeze({
  IDLE: "idle",
  WALK: "walk",
  RUN: "run",
  JUMP: "jump",
  FALL: "fall",
  DUCK: "duck",
  SKID: "skid",
  DEAD: "dead",
  WIN: "win",
});

export const POWER = Object.freeze({
  SMALL: "small",
  BIG: "big",
  FIRE: "fire",
});

export const DIRECTION = Object.freeze({
  LEFT: -1,
  RIGHT: 1,
});

const DEFAULT_PHYSICS = {
  walkAccel: 0.037,
  runAccel: 0.055,
  releaseDecel: 0.055,
  skidDecel: 0.125,
  walkMaxSpeed: 1.56,
  runMaxSpeed: 2.56,

  terminalVelocity: 4.5,
  gravity: {
    slowAscent: 0.125,
    slowDescent: 0.437,
    fastAscent: 0.109,
    fastDescent: 0.375,
  },
  speedThreshold: 1.0,
  jumpImpulse: {
    walk: -4.0,
    run: -5.0,
  },

  groundY: 400,
};

export const FIXED_TIMESTEP = 1 / 60;

