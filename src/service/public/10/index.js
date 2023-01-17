import Clock from "./Clock.js";
import Player from "./Player.js";
import InputHandler from "./InputHandler.js";
import { City, Forest } from "./BackGround.js";
import { SpawnManager } from "./SpawnManager.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./Enemy.js";
import { UI } from "./UI.js";
import { ParticleManager } from "./ParticleManager.js";

window.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 700;
  const clock = new Clock();

  class Game {
    constructor(width, height, clock) {
      this.clock = clock;
      this.width = width;
      this.height = height;
      this.speed = 0;
      this.maxSpeed = 3;
      this.backGround = Math.random() > 0.5 ? new City({ game: this }) : new Forest({ game: this });
      this.groundMargin = this.backGround["name"] === "city" ? 115 : 50;
      this.player = new Player(this);
      this.enemies = [];
      this.debug = true;
      this.input = new InputHandler({ game: this });
      this.score = 0;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 30000;
      this.gameOver = false;
      this.UI = new UI({ game: this });
      this.particles = new ParticleManager({ game: this });
      this.floatingMessages = [];
    }
    settings({ enemies }) {
      for (const element of enemies) {
        this.enemies.push(new SpawnManager({ ...element, game: this }));
      }
    }

    update() {
      const deltaTime = this.clock.update();
      this.time += deltaTime;
      if (this.time > this.maxTime) {
        this.gameOver = true;
      }

      this.debug = this.input.keys["d"];
      this.backGround.update();
      this.enemies.forEach(spawn => spawn.update(deltaTime));
      this.player.update({ deltaTime, keys: this.input.keys });
      this.particles.update(deltaTime);
      this.floatingMessages.forEach(message => message.update(deltaTime));
      this.floatingMessages = this.floatingMessages.filter(message => !message.dead);
    }

    draw(ctx) {
      this.backGround.draw(ctx);
      this.enemies.forEach(spawn => spawn.draw(ctx));
      this.particles.draw(ctx);
      this.player.draw(ctx);
      if (this.debug) {
        ctx.save();
        ctx.font = "30px Arial";
        ctx.fillText(`${Math.round(this.clock.calculateFPS())} FPS`, this.width - 100, 100);
        ctx.restore();
      }
      this.UI.draw(ctx);
      this.floatingMessages.forEach(message => message.draw(ctx));
    }
  }

  const game = new Game(canvas.width, canvas.height, clock);
  game.settings({
    enemies: [
      { type: GroundEnemy, spawnInterval: 4000, options: { prob: 0.5 } },
      { type: FlyingEnemy, spawnInterval: 2000, options: { spawnOnStop: true } },
      { type: ClimbingEnemy, spawnInterval: 2000, options: { prob: 0.5 } }
    ]
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }
  }
  animate();
});
