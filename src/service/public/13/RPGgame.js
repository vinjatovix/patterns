import Clock from "../common/clock/Clock.js";
import { Game } from "../common/game/Game.js";
import { SpriteManager } from "../common/sprites/SpriteManager.js";
import { Map } from "./Map.js";

const familiarImage = new Image();
familiarImage.src = "../img/embySprite.png";

const enemyImage = new Image();
enemyImage.src = "../img/draggleSprite.png";

class BattleMode {
  constructor({ canvasManager, image, player, enemy }) {
    this.canvasManager = canvasManager;
    this.image = image;
    this.player = player;
    this.playerX = this.canvasManager.mainCanvas.width * 0.3 - this.player.width * 0.25;
    this.playerY = this.canvasManager.mainCanvas.height * 0.6 - this.player.height * 0.2;
    this.enemy = enemy;
    this.enemyX = (this.canvasManager.mainCanvas.width - this.enemy.width) * 1.74;
    this.enemyY = (this.canvasManager.mainCanvas.height - this.enemy.height) * 0.58;
    this.ui = document.getElementById("battleInterface");
    this.ui.style.opacity = 1;
    this.button1 = document.getElementById("attack1");
    this.button2 = document.getElementById("attack2");
    this.button3 = document.getElementById("attack3");
    this.end = false;
    this.button1.addEventListener("click", () => {});
    this.button2.addEventListener("click", () => {});
    this.button3.addEventListener("click", () => {
      this.end = true;
    });
  }

  update(deltaTime) {
    this.player.update(deltaTime);
    this.enemy.update(deltaTime);
  }

  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, this.canvasManager.mainCanvas.width, this.canvasManager.mainCanvas.height);
    this.player.draw(ctx, this.playerX, this.playerY);
    ctx.save();
    ctx.scale(0.5, 0.5);
    this.enemy.draw(ctx, this.enemyX, this.enemyY);

    ctx.restore();
  }
}

export class RPGGame extends Game {
  constructor({ canvasManager, controls, player, maps }) {
    super(canvasManager.mainCanvas.width, canvasManager.mainCanvas.height, new Clock());
    this.canvasManager = canvasManager;
    this.controls = controls;
    this.player = player;
    this.view = "map";
    this.maps = { outdoor1: new Map({ ...maps.outdoor1, controls }) };
    this.battleBackground = new Image();
    this.battleBackground.src = "../img/battleBackground.png";
    this.background = this.maps.outdoor1;
    this.lastMap = null;
    this.blackScreen = document.getElementById("blackScreen");
    this.flashInterval = 150;
    this.flashTimer = 0;
    this.flashCounter = 0;
    this.battleMode = null;
  }

  #switchMap(destination) {
    this.blackScreen.style.opacity = 1;
    this.lastMap = this.background;
    this.background = this.maps[destination];
    this.background.battle = false;
    this.blackScreen.style.opacity = 0;
    this.battleMode && (this.battleMode.ui.style.opacity = 0);
    this.battleMode = null;
  }
  #blackScreenFlash(deltaTime, view, destination) {
    this.flashTimer += deltaTime;
    if (this.flashTimer > this.flashInterval) {
      this.flashTimer = 0;
      this.flashCounter++;
      this.blackScreen.style.opacity = 1;
    }
    if (this.flashCounter <= 6 && this.flashTimer > this.flashInterval * 0.25) {
      this.blackScreen.style.opacity = 0;
    }

    if (this.flashCounter > 6) {
      this.view = view;
      this.flashCounter = 0;
      if (view === "map") {
        this.#switchMap(destination);
      }
      if (view === "battle") {
        this.battleMode = new BattleMode({
          canvasManager: this.canvasManager,
          image: this.battleBackground,
          player: new SpriteManager({ image: familiarImage, width: 86, height: 89, maxFrameX: 3, fps: 8 }),
          enemy: new SpriteManager({ image: enemyImage, width: 86, height: 89, maxFrameX: 3, fps: 6 })
        });
      }
    }
  }

  #updateMap(deltaTime) {
    if (this.background.battle) {
      this.#blackScreenFlash(deltaTime, "battle");
    } else {
      this.player.update(deltaTime);
      this.background.update(this.player);
    }
  }

  update() {
    const deltaTime = this.clock.update();
    if (this.view === "map") {
      this.#updateMap(deltaTime);
    }
    if (this.view === "battle" && this.battleMode) {
      this.battleMode.update(deltaTime);
      if (this.battleMode.end) {
        this.#blackScreenFlash(deltaTime, "map", "outdoor1");
      }
    }
  }

  #drawMap(ctx) {
    this.background.draw(ctx);
    this.player.draw(ctx);
    this.background.drawForeground(ctx);
  }

  draw() {
    const ctx = this.canvasManager.getCtx("mainCanvas");
    if (this.view === "map") {
      this.#drawMap(ctx);
    }

    if (this.view === "battle" && this.battleMode) {
      this.battleMode.draw(ctx);
      this.blackScreen.style.opacity = 0;
    }
    this.controls.debug && super.draw(ctx);
  }
}
