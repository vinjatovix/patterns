export class SpriteManager {
  constructor({ image, width, height, maxFrameX, fps }) {
    this.image = image;
    this.width = width;
    this.maxFrameX = maxFrameX;
    this.height = height;
    this.fps = fps;
    this.frameX = 0;
    this.frameY = 0;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
  }

  update(deltaTime) {
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX++;
      if (this.frameX > this.maxFrameX) {
        this.frameX = 0;
      }
    }
  }

  draw(ctx, x, y) {
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height
    );
  }
}
