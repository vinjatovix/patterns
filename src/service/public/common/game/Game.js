export class Game {
  constructor(width, height, clock) {
    this.width = width;
    this.height = height;
    this.clock = clock;
    this.fontColor = "black";
  }

  update() {
    this.clock.update();
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.fontColor;
    ctx.font = "20px Arial";
    ctx.fillText(`FPS: ${this.clock.calculateFPS()}`, 10, 20);
    ctx.restore();
  }
}
