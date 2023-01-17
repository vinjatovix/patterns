import { SpriteManager } from "./SpriteManager.js";

const collisionImage = new Image();
collisionImage.src = "../img/boom.png";

export class CollisionAnimation {
  constructor({ game, x, y }) {
    this.game = game;
    this.image = collisionImage;
    this.spriteManager = new SpriteManager({
      image: this.image,
      width: 200,
      height: 179,
      maxFrameX: 4,
      fps: 10
    });
    this.sizeModifier = 0.5;
    this.width = this.spriteManager.width * this.sizeModifier;
    this.height = this.spriteManager.height * this.sizeModifier;
    this.x = x;
    this.y = y;
    this.dead = false;
  }

  update(deltaTime) {
    this.spriteManager.update(deltaTime);
    this.x -= this.game.speed;
    if (this.spriteManager.frameX === this.spriteManager.maxFrameX) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.sizeModifier, this.sizeModifier);
    this.spriteManager.draw(ctx, -this.spriteManager.width * 0.5, -this.spriteManager.height * 0.5);
    ctx.restore();
  }
}
