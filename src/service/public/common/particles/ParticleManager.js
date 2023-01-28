import { types as particleTypes } from "./Particle.js";

export class ParticleManager {
  constructor({ game, types = particleTypes }) {
    this.game = game;
    this.types = types;
    this.particles = [];
  }

  addParticle(type, x, y) {
    this.particles.push(new this.types[type]({ x, y, game: this.game }));
  }

  addParticles(type, x, y, count) {
    for (let i = 0; i < count; i++) {
      this.addParticle(type, x, y);
    }
  }

  update(deltaTime) {
    for (const particle of this.particles) {
      particle.update(deltaTime);
    }
    this.particles = this.particles.filter(particle => !particle.dead);
  }

  draw(ctx) {
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }
}
