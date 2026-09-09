export class SpriteAnimator {
  constructor(frameDuration = 0.09) {
    this.frameDuration = frameDuration;
    this.allAnimations = {};      
    this.currentAnimationName = null;
    this.frames = [];
    this.index = 0;
    this.elapsed = 0;
    this.loop = true;
    this.finished = false;
  }
 
  setAnimationSet(animationsByName) {
    this.allAnimations = animationsByName;
  }
 

  changeAnimation(name, { loop = true } = {}) {
    if (this.currentAnimationName === name) return;
    const frames = this.allAnimations[name];
    if (!frames || frames.length === 0) return;
 
    this.currentAnimationName = name;
    this.frames = frames;
    this.index = 0;
    this.elapsed = 0;
    this.loop = loop;
    this.finished = false; 
  }
 
  update(dt) {
    if (this.finished || this.frames.length <= 1) return;
    this.elapsed += dt;
    while (this.elapsed >= this.frameDuration) {
      this.elapsed -= this.frameDuration;
      this.index++;
      if (this.index >= this.frames.length) {
        if (this.loop) {
          this.index = 0;
        } else {
          this.index = this.frames.length - 1;
          this.finished = true;
        }
      }
    }
  }
 
  get currentFrame() {
    return this.frames[this.index] || null;
  }
}
 

export function flattenAnimations(animations) {
  const flat = {};
  for (const power of Object.keys(animations)) {
    for (const state of Object.keys(animations[power])) {
      flat[`${power}_${state}`] = animations[power][state];
    }
  }
  return flat;
}
 