export const AudioAssets = {
  bgm: new Audio("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/music/main_theme.ogg"),
  sfxJump: new Audio("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/sound/small_jump.ogg"),
  sfxCoin: new Audio("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/sound/coin.ogg"),
  sfxStomp: new Audio("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/sound/stomp.ogg"),
  sfxDeath: new Audio("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/sound/mario_die.wav")
};

AudioAssets.bgm.loop = true;
AudioAssets.bgm.volume = 0.45;

export function playSound(audioObj) {
  try {
    audioObj.currentTime = 0;
    audioObj.play().catch(() => {});
  } catch (e) {}
}

export function startMusic() {
  try {
    AudioAssets.bgm.currentTime = 0;
    AudioAssets.bgm.play().catch(() => {});
  } catch (e) {}
}

export function stopMusic() {
  try {
    AudioAssets.bgm.pause();
  } catch (e) {}
}

function loadImage(src) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  return img;
}

export const Sprites = {
  mario: loadImage("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/graphics/mario_bros.png"),
  tiles: loadImage("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/graphics/tile_set.png"),
  enemies: loadImage("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/graphics/enemies.png"),
  items: loadImage("https://raw.githubusercontent.com/justinmeister/Mario-Level-1/master/resources/graphics/item_objects.png")
};

export const MARIO_CLIPS = {
  idle:  { x: 178, y: 32, w: 12, h: 16 },
  walk1: { x: 80,  y: 32, w: 15, h: 16 },
  walk2: { x: 96,  y: 32, w: 15, h: 16 },
  walk3: { x: 112, y: 32, w: 16, h: 16 },
  jump:  { x: 144, y: 32, w: 16, h: 16 },
  climb: { x: 160, y: 32, w: 16, h: 16 },
  dead:  { x: 160, y: 32, w: 16, h: 16 }
};

export const TILE_CLIPS = {
  ground:     { x: 0,   y: 0,   w: 16, h: 16 },
  brick:      { x: 16,  y: 0,   w: 16, h: 16 },
  mystery1:   { x: 384, y: 0,   w: 16, h: 16 },
  mystery2:   { x: 400, y: 0,   w: 16, h: 16 },
  mystery3:   { x: 416, y: 0,   w: 16, h: 16 },
  spentBlock: { x: 432, y: 0,   w: 16, h: 16 },
  stairBlock: { x: 0,   y: 16,  w: 16, h: 16 },
  cloudLeft:  { x: 0,   y: 320, w: 16, h: 24 },
  cloudMid:   { x: 16,  y: 320, w: 16, h: 24 },
  cloudRight: { x: 32,  y: 320, w: 16, h: 24 },
  bushLeft:   { x: 176, y: 144, w: 16, h: 16 },
  bushMid:    { x: 192, y: 144, w: 16, h: 16 },
  bushRight:  { x: 208, y: 144, w: 16, h: 16 }
};

export const GOOMBA_CLIPS = [
  { x: 0,  y: 16, w: 16, h: 16 },
  { x: 16, y: 16, w: 16, h: 16 }
];

export const COIN_CLIPS = [
  { x: 0,  y: 96, w: 16, h: 16 },
  { x: 16, y: 96, w: 16, h: 16 },
  { x: 32, y: 96, w: 16, h: 16 },
  { x: 48, y: 96, w: 16, h: 16 }
];