const fireImage = new Image();
fireImage.src = "../../img/fire.png";

class Particle {
  constructor({ x, y, game, color = `hsl(${Math.random() * 360}, 100%, 50%)`, size = Math.random() * 5 + 15 }) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.dead = false;
    this.size = size;
    this.color = color;
    this.vx = Math.random() * 0.5 - 0.25;
    this.vy = Math.random() * 0.5 - 0.25;
    this.life = 1000;
    this.maxLife = 1000;
    this.opacity = 1;
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime - this.game.speed;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime;
    this.opacity = this.life / this.maxLife;
    if (this.life <= 0 || this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
class BloodParticle extends Particle {
  constructor({ x, y, game }) {
    super({ x, y, game });
    this.vx = Math.random() * 0.5 - 0.25;
    this.vy = Math.random() * 0.5 - 0.25;
    this.life = 650;
    this.maxLife = 650;
    this.size = 2;
    this.color = "red";
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.size *= 1.03;
  }
}

class DustParticle extends Particle {
  constructor({ x, y, game }) {
    super({ x, y, game });
    this.vx = -Math.random() * game.speed * 0.08;
    this.vy = Math.random() * 0.05 - 0.03;
    this.y = Math.random() + y;
    this.life = 650;
    this.size = Math.random() * 10 + 5;
    this.color = "rgba(28, 28, 28, 0.678)";
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.size *= 0.95;
  }
}

class FireParticle extends Particle {
  constructor({ x, y, game }) {
    super({ x, y, game });
    this.vx = -1;
    this.vy = 0;
    this.life = 1000;
    this.size = Math.random() * 100 + 50;
    this.image = fireImage;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = Math.random() * 0.1 - 0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.size *= Math.random() * 0.1 + 0.92;
    this.angle += this.angleSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

class SplashParticle extends Particle {
  constructor({ x, y, game }) {
    super({ x, y, game });
    this.vx = (Math.random() * 4 - 2) * 0.3;
    this.vy = -Math.random() * 0.25;
    this.gravity = 0;
    this.life = 350;
    this.size = Math.random() * 10 + 10;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.size *= Math.random() * 0.1 + 0.92;
    this.gravity += 0.01;
    this.y += this.gravity;
  }
}

class SplashFireParticle extends SplashParticle {
  constructor({ x, y, game }) {
    super({ x, y, game });
    this.vx = (Math.random() * 4 - 2) * 0.3;
    this.vy = -Math.random() * 0.25;
    this.gravity = 0;
    this.life = 350;
    this.size = Math.random() * 100 + 50;
    this.image = fireImage;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size);
  }
}

class SplashWater extends SplashParticle {
  constructor({ x, y, game }) {
    super({ x, y, game });
    this.vx = (Math.random() * 4 - 2) * 0.3;
    this.vy = -Math.random() * 0.25;
    this.gravity = 0;
    this.life = 350;
    this.color = "blue";
  }
}

export const types = {
  blood: BloodParticle,
  dust: DustParticle,
  fire: FireParticle,
  splashFire: SplashFireParticle,
  splashWater: SplashWater
};
