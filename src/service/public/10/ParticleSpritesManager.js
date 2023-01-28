import { ParticleManager } from "../common/particles/ParticleManager.js";
import { CollisionAnimation } from "./CollisionAnimation.js";

export class ParticleSpritesManager extends ParticleManager {
  constructor({ game }) {
    super({ game });
    this.collisions = [];
  }

  collision(x, y) {
    this.addParticles("blood", x, y, 10);
    this.collisions.push(new CollisionAnimation({ x, y, game: this.game }));
  }
  update(deltaTime) {
    super.update(deltaTime);
    for (const c of this.collisions) {
      c.update(deltaTime);
    }
    this.collisions = this.collisions.filter(c => !c.dead);
  }

  draw(ctx) {
    super.draw(ctx);
    for (const c of this.collisions) {
      c.draw(ctx);
    }
  }
}
