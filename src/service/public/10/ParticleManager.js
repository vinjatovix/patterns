import { CollisionAnimation } from "./CollisionAnimation.js";

const fireImage = new Image();
fireImage.src = "../img/fire.png";

class Particle {
  constructor({ x, y, game }) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.dead = false;
    this.vx = Math.random() * 0.5 - 0.25;
    this.vy = Math.random() * 0.5 - 0.25;
    this.life = 1000;
    this.opacity = 1;
    this.size = Math.random() * 5 + 15;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime - this.game.speed;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime;
    this.opacity = this.life / 1000;
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
class BloodParticles extends Particle {
  constructor({ x, y, game, life = 650, size = 2, color = "red" }) {
    super({ x, y, game });
    this.vx = Math.random() * 0.5 - 0.25;
    this.vy = Math.random() * 0.5 - 0.25;
    this.life = life;
    this.size = 1;
    this.color = "red";
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.size *= 1.06;
  }
}

export class DustParticle extends Particle {
  constructor({ x, y, game, life = 650 }) {
    super({ x, y, game });
    this.vx = -Math.random() * game.speed * 0.08;
    this.vy = Math.random() * 0.05 - 0.03;
    this.y = Math.random() + y;
    this.life = life;
    this.size = Math.random() * 10 + 5;
    this.color = "rgba(28, 28, 28, 0.678)";
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.size *= 0.95;
  }
}

class SplashFireParticle extends Particle {
  constructor({ x, y, game }) {
    super({ x, y, game });
    this.vx = (Math.random() * 4 - 2) * 0.3;
    this.vy = -Math.random() * 0.25;
    this.gravity = 0;
    this.life = 350;
    this.size = Math.random() * 100 + 50;
    this.image = fireImage;
    // this.angle = Math.random() * Math.PI * 2;
    // this.angleSpeed = Math.random() * 0.1 - 0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.size *= Math.random() * 0.1 + 0.92;
    this.gravity += 0.01;
    this.y += this.gravity;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
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

export class ParticleManager {
  constructor({ game }) {
    this.game = game;
    this.particles = [];
    this.collisions = [];
  }

  addParticle(particle) {
    this.particles.push(particle);
  }

  collision(x, y) {
    this.collisions.push(new CollisionAnimation({ x, y, game: this.game }));
    for (let i = 0; i < 10; i++) {
      this.addParticle(
        new BloodParticles({
          x,
          y,
          game: this.game
        })
      );
    }
  }

  dust(x, y) {
    this.addParticle(
      new DustParticle({
        x,
        y,
        game: this.game,
        life: 650
      })
    );
  }

  splashFire(x, y) {
    for (let i = 0; i < 30; i++) {
      this.addParticle(
        new SplashFireParticle({
          x,
          y,
          game: this.game
        })
      );
    }
  }

  fire(x, y) {
    this.addParticle(
      new FireParticle({
        x,
        y,
        game: this.game
      })
    );
  }

  update(deltaTime) {
    for (const collision of this.collisions) {
      collision.update(deltaTime);
    }
    for (const particle of this.particles) {
      particle.update(deltaTime);
    }
    this.collisions = this.collisions.filter(collision => !collision.dead);
    this.particles = this.particles.filter(particle => !particle.dead);
  }

  draw(ctx) {
    for (const collision of this.collisions) {
      collision.draw(ctx);
    }
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }
}
