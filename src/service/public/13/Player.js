import { SpriteManager } from "../common/sprites/SpriteManager.js";

export class Player {
  constructor({ x, y, controls, states }) {
    this.controls = controls;
    this.up = new SpriteManager({ ...states.up });
    this.down = new SpriteManager({ ...states.down });
    this.left = new SpriteManager({ ...states.left });
    this.right = new SpriteManager({ ...states.right });
    this.currentSprite = this.down;
    this.width = this.currentSprite.width;
    this.height = this.width;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
  }
  update(deltaTime) {
    this.currentSprite = this[`${this.controls.lastDirection}`];
    this.controls[`${this.controls.lastDirection}`] && this.currentSprite.update(deltaTime);
  }

  #debug(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  draw(ctx) {
    this.currentSprite.draw(ctx, this.x, this.y - (this.currentSprite.height - this.height));
    this.controls.debug && this.#debug(ctx);
  }
}
