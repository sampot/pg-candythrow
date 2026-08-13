import { CandyThrowGame } from "./game.js";

const game = new CandyThrowGame();
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 480;

function loop(ts) {
  const dt = (ts - game.lastTs) / 1000;
  game.lastTs = ts;
  
  game.update(dt);
  game.draw(ctx, canvas.width, canvas.height);
  
  document.getElementById("score").textContent = game.score;
  
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Touch handling
let startX = 0, startY = 0;
canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  startX = (e.clientX - rect.left) * (canvas.width / rect.width);
  startY = (e.clientY - rect.top) * (canvas.height / rect.height);
  game.onDragStart(startX, startY);
});

canvas.addEventListener("pointerup", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  game.onDragEnd(x, y);
});

document.getElementById("btn-restart").addEventListener("click", () => {
  game.start();
});
