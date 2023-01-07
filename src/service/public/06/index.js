document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas1");
  // @ts-ignore
  const ctx = canvas.getContext("2d");
  // @ts-ignore
  canvas.width = 500;
  // @ts-ignore
  canvas.height = 800;

  const worm = new Image();
  worm.src = "../img/enemy_worm.png";
  const ghost = new Image();
  ghost.src = "../img/enemy_ghost.png";
  const spider = new Image();
  spider.src = "../img/enemy_spider.png";

  const enemies = Object.freeze({
    worm: {
      image: worm,
      spriteWidth: 229,
      spriteHeight: 171,
      frames: 5,
      interval: 120
    },
    ghost: {
      image: ghost,
      spriteWidth: 261,
      spriteHeight: 209,
      frames: 5,
      interval: 80
    },
    spider: {
      image: spider,
      spriteWidth: 310,
      spriteHeight: 175,
      frames: 5,
      interval: 20
    }
  });

  class SpriteManager {
    constructor({ image, spriteWidth, spriteHeight, frames, interval }) {
      this.image = image;
      this.width = spriteWidth;
      this.height = spriteHeight;
      this.frames = frames;
      this.interval = interval;
      this.frameX = 0;
      this.timer = 0;
      this.frame = this.frameX * this.width;
    }
    update(deltaTime) {
      if (this.timer >= this.interval) {
        if (this.frameX < this.frames) this.frameX++;
        else this.frameX = 0;
        this.frame = this.frameX * this.width;
        this.timer = 0;
      } else {
        this.timer += deltaTime;
      }
    }
  }
  class Enemy {
    constructor(game, type) {
      this.game = game;
      this.sprite = new SpriteManager(type);
      this.size = Math.random() * 0.25 + 0.25;
      this.width = this.sprite.width * this.size;
      this.height = this.sprite.height * this.size;
      this.y = 0;
      this.x = 0;
      this.vx = 0;
      this.vy = 0;
    }

    checkOffScreen() {
      if (
        this.x > this.game.width ||
        this.x + this.width < 0 ||
        this.y > this.game.height ||
        this.y + this.height < 0
      ) {
        this.offScreen = true;
      }
    }
    update(deltaTime) {
      this.sprite.update(deltaTime);
      this.x += this.vx * deltaTime;
      this.y += this.vy * deltaTime;
      this.checkOffScreen();
    }
    draw(ctx) {
      ctx.drawImage(
        this.sprite.image,
        this.sprite.frame,
        0,
        this.sprite.width,
        this.sprite.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game, enemies.worm);
      this.y = this.game.height - this.height;
      this.x = this.game.width;
      this.vx = Math.random() * -0.03 - 0.01;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game, enemies.ghost);
      this.y = Math.random() * (game.height - this.height) * 0.75 + (game.height - this.height) * 0.1;
      this.x = this.game.width;
      this.angle = 0;
      this.vx = Math.random() * -0.05 - 0.05;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle * 0.05) * 0.5;
      this.angle += deltaTime * Math.random() * 0.2 + 0.1;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      super.draw(ctx);
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game, enemies.spider);
      this.y = 0 - this.height;
      this.x = Math.random() * (game.width - this.width);
      this.vy = this.size * 0.1;
      this.bottom = this.game.height * 0.3 + Math.random() * 300 - 200;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += this.vy * deltaTime;
      if (this.y > this.bottom) {
        this.vy = -Math.abs(this.vy);
      }
    }

    draw(ctx) {
      super.draw(ctx);
      if (this.y > 0) {
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, 0);
        ctx.lineTo(this.x + this.width / 2, this.y + 10);
        ctx.stroke();
      }
    }
  }

  class SpawnManager {
    constructor({ type, game, spawnInterval = 4000 }) {
      this.type = type;
      this.game = game;
      this.spawnInterval = spawnInterval;
      this.spawnTimer = 0;
      this.entities = [];
    }
    update(deltaTime) {
      this.spawnTimer += deltaTime;
      if (this.spawnTimer >= this.spawnInterval) {
        this.#add();
        this.spawnTimer = 0;
        this.entities = this.entities.filter(entity => !entity.offScreen).sort((a, b) => a.size - b.size);
      }
      this.entities.forEach(entity => entity.update(deltaTime));
    }
    #add() {
      this.entities.push(new this.type(this.game));
    }
  }

  class Game {
    constructor({ ctx, width, height }) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
    }

    settings({ enemies }) {
      for (const element of enemies) {
        this.enemies.push(new SpawnManager({ ...element, game: this }));
      }
    }
    update(deltaTime) {
      this.enemies.forEach(spawn => spawn.update(deltaTime));
    }
    draw() {
      this.enemies.forEach(spawn => spawn.entities.forEach(entity => entity.draw(this.ctx)));
    }
    run(deltaTime) {
      this.update(deltaTime);
      this.draw();
    }
  }

  class Clock {
    constructor() {
      this.time = 0;
      this.lastTime = 0;
      this.deltaTime = 0;
    }
    update() {
      this.time = Date.now();
      this.deltaTime = this.time - this.lastTime;
      this.lastTime = this.time;

      return this.deltaTime;
    }
  }

  // @ts-ignore
  const game = new Game({ ctx, width: canvas.width, height: canvas.height });
  game.settings({
    enemies: [
      { type: Worm, spawnInterval: 4000 },
      { type: Ghost, spawnInterval: 1000 },
      { type: Spider, spawnInterval: 2000 }
    ]
  });

  const clock = new Clock();

  const animate = (timestamp = 0) => {
    // @ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.run(clock.update());
    requestAnimationFrame(animate);
  };

  animate();
});
