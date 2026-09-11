import { Sprites, TILE_CLIPS, MARIO_CLIPS, GOOMBA_CLIPS, COIN_CLIPS } from './assets.js';
import { TILE_SIZE } from './level.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  }

  render(game) {
    const { player, levelManager, entityManager, tick } = game;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let cameraX = player.x - this.canvas.width / 3;
    cameraX = Math.max(0, Math.min(cameraX, levelManager.mapW * TILE_SIZE - this.canvas.width));

    this.ctx.save();
    this.ctx.translate(-Math.floor(cameraX), 0);

    levelManager.getScenery().forEach((s) => {
      if (s.type === 'cloud') {
        this.drawTile(TILE_CLIPS.cloudLeft, s.x, s.y);
        this.drawTile(TILE_CLIPS.cloudMid, s.x + 32, s.y);
        this.drawTile(TILE_CLIPS.cloudRight, s.x + 64, s.y);
      } else if (s.type === 'bush') {
        this.drawTile(TILE_CLIPS.bushLeft, s.x, s.y);
        this.drawTile(TILE_CLIPS.bushMid, s.x + 32, s.y);
        this.drawTile(TILE_CLIPS.bushRight, s.x + 64, s.y);
      }
    });

    
    const startCol = Math.floor(cameraX / TILE_SIZE);
    const endCol = Math.min(levelManager.mapW, startCol + Math.ceil(this.canvas.width / TILE_SIZE) + 2);
    const qFrame = Math.floor(tick / 14) % 3;
    const mysteryClip = qFrame === 0 ? TILE_CLIPS.mystery1 : qFrame === 1 ? TILE_CLIPS.mystery2 : TILE_CLIPS.mystery3;

    for (let r = 0; r < levelManager.mapH; r++) {
      for (let c = startCol; c < endCol; c++) {
        const t = levelManager.getTile(c, r);
        const px = c * TILE_SIZE;
        const py = r * TILE_SIZE;
        if (t === 1) this.drawTile(TILE_CLIPS.ground, px, py);
        else if (t === 2) this.drawTile(TILE_CLIPS.brick, px, py);
        else if (t === 3) this.drawTile(mysteryClip, px, py);
        else if (t === 4) this.drawTile(TILE_CLIPS.spentBlock, px, py);
        else if (t === 5) this.drawTile(TILE_CLIPS.stairBlock, px, py);
      }
    }

    this.drawPipes(levelManager.getPipes());
    this.drawCastle(game.CASTLE_X, game.CASTLE_Y);

    
    this.ctx.fillStyle = '#00c800';
    this.ctx.beginPath();
    this.ctx.arc(game.FLAG_X + 4, game.FLAG_TOP_Y - 4, 8, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(game.FLAG_X + 2, game.FLAG_TOP_Y, 4, game.FLAG_BOTTOM_Y - game.FLAG_TOP_Y);
    this.ctx.fillStyle = '#00c800';
    this.ctx.beginPath();
    this.ctx.moveTo(game.FLAG_X - 24, game.flagY);
    this.ctx.lineTo(game.FLAG_X + 2, game.flagY + 12);
    this.ctx.lineTo(game.FLAG_X + 2, game.flagY - 12);
    this.ctx.fill();

    
    const coinFrame = Math.floor(tick / 8) % 4;
    const coinClip = COIN_CLIPS[coinFrame];
    entityManager.worldCoins.concat(entityManager.poppingCoins).forEach((c) => {
      this.ctx.drawImage(Sprites.items, coinClip.x, coinClip.y, coinClip.w, coinClip.h, c.x, c.y, 22, 22);
    });

    const gFrame = Math.floor(tick / 10) % 2;
    entityManager.enemies.forEach((e) => {
      if (!e.alive) return;
      const clip = GOOMBA_CLIPS[gFrame];
      this.ctx.drawImage(Sprites.enemies, clip.x, clip.y, clip.w, clip.h, e.x, e.y, e.w, e.h);
    });

    if (player.visible) {
      this.ctx.save();
      let mClip = MARIO_CLIPS.idle;
      if (game.gameState === 'DYING') mClip = MARIO_CLIPS.dead;
      else if (game.gameState.startsWith('FLAG')) mClip = MARIO_CLIPS.climb;
      else if (!player.grounded) mClip = MARIO_CLIPS.jump;
      else if (Math.abs(player.vx) > 0.2 || game.gameState === 'WALK_TO_CASTLE') {
        const walkIdx = Math.floor(tick / 5) % 3;
        mClip = walkIdx === 0 ? MARIO_CLIPS.walk1 : walkIdx === 1 ? MARIO_CLIPS.walk2 : MARIO_CLIPS.walk3;
      }

      if (player.facing === -1 && game.gameState !== 'DYING') {
        this.ctx.translate(player.x + player.w, player.y);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(Sprites.mario, mClip.x, mClip.y, mClip.w, mClip.h, 0, 0, player.w, player.h);
      } else {
        this.ctx.drawImage(Sprites.mario, mClip.x, mClip.y, mClip.w, mClip.h, player.x, player.y, player.w, player.h);
      }
      this.ctx.restore();
    }

    this.ctx.restore();

    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px monospace';
    this.ctx.fillText(`MARIO`, 25, 28);
    this.ctx.fillText(player.score.toString().padStart(6, '0'), 25, 48);
    this.ctx.fillText(`COINS`, 135, 28);
    this.ctx.fillText(`x${player.coins.toString().padStart(2, '0')}`, 145, 48);
    this.ctx.fillText(`WORLD`, 235, 28);
    this.ctx.fillText(levelManager.levelName, 245, 48);
    this.ctx.fillText(`LIVES`, 335, 28);
    this.ctx.fillText(`x${Math.max(0, player.lives)}`, 345, 48);
    this.ctx.fillText(`TIME`, 435, 28);
    this.ctx.fillText(game.time.toString().padStart(3, '0'), 445, 48);
  
  }

  drawTile(clip, dx, dy) {
    this.ctx.drawImage(Sprites.tiles, clip.x, clip.y, clip.w, clip.h, dx, dy, TILE_SIZE, TILE_SIZE);
  }

  drawPipes(pipes) {
    pipes.forEach(p => {
      const width = TILE_SIZE * 2;
      const height = p.height * TILE_SIZE;

      this.ctx.fillStyle = '#00a800';
      this.ctx.fillRect(p.x - 2, p.y, width + 4, TILE_SIZE);
      this.ctx.fillStyle = '#80d010';
      this.ctx.fillRect(p.x - 2, p.y, width + 4, 4);
      this.ctx.fillStyle = '#000000';
      this.ctx.strokeRect(p.x - 2, p.y, width + 4, TILE_SIZE);

      this.ctx.fillStyle = '#00a800';
      this.ctx.fillRect(p.x, p.y + TILE_SIZE, width, height - TILE_SIZE);
      this.ctx.fillStyle = '#80d010';
      this.ctx.fillRect(p.x + 4, p.y + TILE_SIZE, 6, height - TILE_SIZE);
      this.ctx.fillStyle = '#000000';
      this.ctx.strokeRect(p.x, p.y + TILE_SIZE, width, height - TILE_SIZE);
    });
  }

  drawCastle(x, y) {
    this.ctx.fillStyle = '#b84418';
    this.ctx.fillRect(x + 16, y + 64, 112, 96);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(x + 52, y + 100, 40, 60);
  }

}