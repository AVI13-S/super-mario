import { Game } from './game.js';

const canvas = document.getElementById('canvas');
const game = new Game(canvas);

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('gameover-screen');
const clearScreen = document.getElementById('clear-screen');

document.getElementById('start-btn').addEventListener('click', () => {
  startScreen.classList.add('hidden');
  game.resetFullGame();
});

document.getElementById('retry-btn').addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');
  game.resetFullGame();
});

document.getElementById('replay-btn').addEventListener('click', () => {
  clearScreen.classList.add('hidden');
  game.resetFullGame(); // Runs the exact same reset logic
});

document.getElementById('next-btn').addEventListener('click', () => {
  clearScreen.classList.add('hidden');
  game.nextLevel();
});

game.run();