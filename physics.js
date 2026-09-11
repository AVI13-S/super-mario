import { TILE_SIZE } from './level.js';
import { keys } from './player.js';
import { AudioAssets, playSound, stopMusic } from './assets.js';

const GRAVITY = 0.44;
const GROUND_FRICTION = 0.86;
const AIR_FRICTION = 0.98;
const WALK_ACCEL = 0.45;
const WALK_MAX_SPEED = 3.4;
const RUN_MAX_SPEED = 5;
const JUMP_VELOCITY = -11.2;

export function updatePhysics(game) {
  const { player, levelManager, entityManager } = game;

  if (game.gameState == 'DYING') {
    game.deathTimer++;
    player.vy += GRAVITY;
    player.y += player.vy;
    if (game.deathTimer > 90) game.respawn();
    return;
  }

  if (game.gameState == 'FLAG_SLIDE') {
    if (game.flagY < game.FLAG_BOTTOM_Y - 24) game.flagY += 3;
    if (player.y < game.FLAG_BOTTOM_Y - player.h) player.y += 3;
    if (game.flagY >= game.FLAG_BOTTOM_Y - 24 && player.y >= game.FLAG_BOTTOM_Y - player.h) {
      game.flagY = game.FLAG_BOTTOM_Y - 24;
      player.y = game.FLAG_BOTTOM_Y - player.h;
      game.gameState = 'FLAG_BOTTOM_WAIT';
      game.flagWaitTimer = 0;
    }
    return;
  }

  if (game.gameState == 'FLAG_BOTTOM_WAIT') {
    game.flagWaitTimer++;
    if (game.flagWaitTimer > 28) {
      player.x = game.FLAG_X + 16;
      player.facing = 1;
      game.gameState = 'WALK_TO_CASTLE';
    }
    return;
  }

  if (game.gameState == 'WALK_TO_CASTLE') {
    player.vy += GRAVITY;
    player.y += player.vy;
    if (player.y >= 13 * TILE_SIZE - player.h) {
      player.y = 13 * TILE_SIZE - player.h;
      player.vy = 0;
      player.grounded = true;
    }
    player.vx = 2.0;
    player.x += player.vx;

    if (player.x >= game.CASTLE_DOOR_X) {
      player.visible = false;
      game.gameState = 'CLEARED';
      setTimeout(() => game.showClearScreen(), 1200);
    }
    return;
  }

  if (game.gameState !== 'PLAYING') return;

  
  if (keys.jump && player.grounded) {
    const runBoost = Math.abs(player.vx) > 3 ? -0.6 : 0;
    player.vy = JUMP_VELOCITY + runBoost;
    player.grounded = false;
    playSound(AudioAssets.sfxJump);
  }

  const topSpeed = keys.shift ? RUN_MAX_SPEED : WALK_MAX_SPEED;
  if (keys.left) { player.vx -= WALK_ACCEL; player.facing = -1; }
  if (keys.right) { player.vx += WALK_ACCEL; player.facing = 1; }

  player.vx *= player.grounded ? GROUND_FRICTION : AIR_FRICTION;
  if (Math.abs(player.vx) > topSpeed) player.vx = Math.sign(player.vx) * topSpeed;

  player.x += player.vx;
  if (player.x < 0) { player.x = 0; player.vx = 0; }

  let left = Math.floor(player.x / TILE_SIZE);
  let right = Math.floor((player.x + player.w) / TILE_SIZE);
  let top = Math.floor(player.y / TILE_SIZE);
  let bottom = Math.floor((player.y + player.h - 0.1) / TILE_SIZE);

  if (player.vx > 0) {
    for (let y = top; y <= bottom; y++) {
      if (levelManager.getTile(right, y) > 0) {
        player.x = right * TILE_SIZE - player.w;
        player.vx = 0;
        break;
      }
    }
  } else if (player.vx < 0) {
    for (let y = top; y <= bottom; y++) {
      if (levelManager.getTile(left, y) > 0) {
        player.x = (left + 1) * TILE_SIZE;
        player.vx = 0;
        break;
      }
    }
  }

  player.vy += GRAVITY;
  player.y += player.vy;

  left = Math.floor(player.x / TILE_SIZE);
  right = Math.floor((player.x + player.w - 0.1) / TILE_SIZE);
  top = Math.floor(player.y / TILE_SIZE);
  bottom = Math.floor((player.y + player.h) / TILE_SIZE);

  player.grounded = false;
  if (player.vy > 0) {
    for (let x = left; x <= right; x++) {
      if (levelManager.getTile(x, bottom) > 0) {
        player.y = bottom * TILE_SIZE - player.h;
        player.vy = 0;
        player.grounded = true;
        break;
      }
    }
  } else if (player.vy < 0) {
    for (let x = left; x <= right; x++) {
      const t = levelManager.getTile(x, top);
      if (t > 0) {
        player.y = (top + 1) * TILE_SIZE;
        player.vy = 0;
        if (t === 3) {
          levelManager.setTile(x, top, 4);
          player.coins++;
          player.score += 200;
          playSound(AudioAssets.sfxCoin);
          entityManager.addPoppingCoin(x * TILE_SIZE + 8, top * TILE_SIZE - 12);
        }
        break;
      }
    }
  }

  
  if (player.x + player.w >= game.FLAG_X && player.x <= game.FLAG_X + 16 && player.y <= game.FLAG_BOTTOM_Y) {
    stopMusic();
    game.gameState = 'FLAG_SLIDE';
    player.vx = 0;
    player.vy = 0;
    player.x = game.FLAG_X - 10;
    player.score += Math.max(100, Math.floor((game.FLAG_BOTTOM_Y - player.y) * 15));
    return;
  }

  
  for (let i = entityManager.worldCoins.length - 1; i >= 0; i--) {
    const c = entityManager.worldCoins[i];
    if (player.x < c.x + 20 && player.x + player.w > c.x && player.y < c.y + 24 && player.y + player.h > c.y) {
      entityManager.worldCoins.splice(i, 1);
      player.coins++;
      player.score += 100;
      playSound(AudioAssets.sfxCoin);
    }
  }

  
  entityManager.enemies.forEach((e) => {
    if (!e.alive) return;
    e.vy += GRAVITY;
    e.y += e.vy;

    let eLeft = Math.floor(e.x / TILE_SIZE);
    let eRight = Math.floor((e.x + e.w - 0.1) / TILE_SIZE);
    let eBottom = Math.floor((e.y + e.h) / TILE_SIZE);

    if (e.vy > 0) {
      for (let x = eLeft; x <= eRight; x++) {
        if (levelManager.getTile(x, eBottom) > 0) {
          e.y = eBottom * TILE_SIZE - e.h;
          e.vy = 0;
          e.grounded = true;
          break;
        }
      }
    }

    
    if (e.grounded) {
      const nextX = e.x + (e.vx > 0 ? e.w + 2 : -2);
      const groundTileAhead = Math.floor(nextX / TILE_SIZE);
      const tileBelowAhead = levelManager.getTile(groundTileAhead, Math.floor((e.y + e.h + 2) / TILE_SIZE));

      if (tileBelowAhead == 0) {
        e.vx *= -1;
      }
    }

    e.x += e.vx;

    if (e.x <= 0) {
      e.x = 0;
      e.vx *= -1;
    }

    eLeft = Math.floor(e.x / TILE_SIZE);
    eRight = Math.floor((e.x + e.w) / TILE_SIZE);
    const eMidY = Math.floor((e.y + e.h / 2) / TILE_SIZE);

    if (e.vx < 0 && levelManager.getTile(eLeft, eMidY) > 0) e.vx *= -1;
    if (e.vx > 0 && levelManager.getTile(eRight, eMidY) > 0) e.vx *= -1;

    if (player.x < e.x + e.w && player.x + player.w > e.x && player.y < e.y + e.h && player.y + player.h > e.y) {
      if (player.vy > 0 && player.y + player.h - player.vy <= e.y + 14) {
        e.alive = false;
        player.vy = -7.5;
        player.score += 100;
        playSound(AudioAssets.sfxStomp);
      } else {
        game.handlePlayerDeath();
      }
    }
  });

  entityManager.updatePoppingCoins();

  if (player.y > game.canvas.height + 60) {
    game.handlePlayerDeath();
  }
}