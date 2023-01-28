import { lerp } from "../common/utils/index.js";

export class Road {
  constructor({ game, lanes = 3 }) {
    this.game = game;
    this.x = game.width * 0.5;
    this.width = game.width * 0.9;
    this.lanes = lanes;
    this.left = this.x - this.width * 0.5;
    this.right = this.x + this.width * 0.5;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight]
    ];
  }

  getLaneCenter(lane = Math.floor(Math.random() * this.lanes)) {
    const laneWidth = this.width / this.lanes;
    return this.left + laneWidth * 0.5 + Math.min(lane, this.lanes - 1) * laneWidth;
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    this.#drawDashedLanes(ctx);
    this.#drawBorders(ctx);
  }

  #drawBorders(ctx) {
    ctx.setLineDash([]);
    this.borders.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  }

  #drawDashedLanes(ctx) {
    for (let i = 1; i <= this.lanes - 1; i++) {
      const x = lerp(this.left, this.right, i / this.lanes);

      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }
}
