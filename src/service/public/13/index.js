import { CanvasManager } from "../common/canvasManager/CanvasManager.js";
import { Controls } from "./Controls.js";
import { RPGGame } from "./RPGgame.js";
import { Player } from "./Player.js";

import { playerStates, maps } from "./cfg.js";

window.addEventListener("DOMContentLoaded", function () {
  const mainCanvas = document.getElementById("mainCanvas");
  const canvasManager = new CanvasManager({ canvasCollection: { mainCanvas } });
  canvasManager.set2DCanvas({ canvas: "mainCanvas", width: 1024, height: 576 });

  const controls = new Controls();
  const player = new Player({ ...canvasManager.getCenter("mainCanvas"), controls, states: playerStates });
  const game = new RPGGame({ canvasManager, controls, player, maps });

  function animate() {
    game.update();
    game.draw();
    requestAnimationFrame(animate);
  }

  animate();
});
