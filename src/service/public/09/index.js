import Clock from "./Clock.js";
import Player from "./Player.js";
import InputHandler from "./InputHandler.js";
import { drawStatusText } from "./utils.js";

window.addEventListener("DOMContentLoaded", function () {
  const loading = document.getElementById("loading");
  loading.style.display = "none";

  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const clock = new Clock();
  const player = new Player({ game: { width: canvas.width, height: canvas.height } });
  const input = new InputHandler();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = clock.update();
    drawStatusText({ ctx, input, player });
    player.update(input.lastKey);
    player.draw(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate();
});
