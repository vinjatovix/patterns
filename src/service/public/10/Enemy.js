import { FloatingMessage } from "./FloatingMsgs.js";
import { SpriteManager } from "./SpriteManager.js";

const flyImage = new Image();
flyImage.src = "../img/enemy_fly.png";

const plantImage = new Image();
plantImage.src = "../img/enemy_plant.png";

const spiderImage = new Image();
spiderImage.src = "../img/enemy_spider_big.png";

class Enemy {
  constructor({ game, image, width, height, maxFrameX, fps }) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.spriteManager = new SpriteManager({
      image,
      width,
      height,
      maxFrameX,
      fps
    });
    this.offScreen = false;
    this.dead = false;
  }

  update(deltaTime) {
    this.spriteManager.update(deltaTime);
    this.x += this.speedX - this.game.speed;
    if (this.x < 0) {
      this.offScreen = true;
    }

    this.y += this.speedY;
  }

  checkCollision(entity) {
    {
      if (
        entity.x < this.x + this.width &&
        entity.x + entity.width > this.x &&
        entity.y < this.y + this.height &&
        entity.y + entity.height > this.y
      ) {
        this.game.particles.collision(this.x + this.width * 0.5, this.y + this.height * 0.5);
        this.offScreen = true;
        if (["ROLL", "DIVE"].includes(entity.currentState.state)) {
          this.game.score++;
          this.game.floatingMessages.push(
            new FloatingMessage({
              x: this.x + this.width * 0.5,
              y: this.y + this.height * 0.5,
              value: "+1",
              targetX: 100,
              targetY: 30
            })
          );
        } else {
          entity.setState("HIT", 0);
        }
      }
    }
  }

  draw(ctx, x, y) {
    if (this.game.debug) ctx.strokeRect(x, y, this.width, this.height);
    this.spriteManager.draw(ctx, x, y);
  }
}

export class FlyingEnemy extends Enemy {
  constructor({ game }) {
    super({
      game,
      image: flyImage,
      width: 60,
      height: 44,
      maxFrameX: 5,
      fps: 10
    });
    this.game = game;
    this.x = this.game.width;
    this.y = Math.random() * (this.game.height - this.height) * 0.5;
    this.speedX = -Math.random() - 1;
    this.angle = Math.random() * 2 * Math.PI;
    this.angleSpeed = Math.random() * 0.1 + 0.05;
  }

  update(deltaTime) {
    // never 0 and proportional to game speed
    this.speedX = -Math.random() - 1 - this.game.speed;
    super.update(deltaTime);

    if (this.y < 0) {
      this.y = 0;
    }
    this.y += Math.sin(this.angle * 0.05) * 0.5;
    this.angle += deltaTime * this.angleSpeed;
  }

  draw(ctx) {
    super.draw(ctx, this.x, this.y);
  }
}

export class GroundEnemy extends Enemy {
  constructor({ game }) {
    super({
      game,
      image: plantImage,
      width: 60,
      height: 87,
      maxFrameX: 1,
      fps: 10
    });
    this.game = game;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = 0;
    this.speedY = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.speedX = -this.game.speed;
  }

  draw(ctx) {
    super.draw(ctx, this.x, this.y);
  }
}

export class ClimbingEnemy extends Enemy {
  constructor({ game }) {
    super({
      game,
      image: spiderImage,
      width: 120,
      height: 144,
      maxFrameX: 5,
      fps: 10
    });
    this.game = game;
    this.x = this.game.width;
    this.y = Math.random() * (this.game.height - this.height) * 0.5;
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.speedX = -this.game.speed;
    if (this.y + this.height < 0) {
      this.speedY = 1;
    }
    if (this.y >= this.game.height * 0.5 - this.game.groundMargin + this.height - Math.random() * 100) {
      this.speedY = -1;
    }
  }

  draw(ctx) {
    super.draw(ctx, this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
    ctx.lineTo(this.x + this.width * 0.5, 0);
    ctx.stroke();
  }
}
