export class Boundary {
  static width = 48;
  static height = 48;
  constructor({ x, y, width = Boundary.width, height = Boundary.height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  #getOverlaps({ x, y, width, height }) {
    const playerTop = y;
    const playerBottom = y + height;
    const playerLeft = x;
    const playerRight = x + width;

    const boundaryTop = this.y;
    const boundaryLeft = this.x;
    const boundaryRight = this.x + this.width;
    const boundaryBottom = this.y + this.height;

    const bottomOverlap = playerBottom >= boundaryTop && playerTop <= boundaryTop;
    const leftOverlap = playerLeft <= boundaryRight && playerRight >= boundaryRight;
    const rightOverlap = playerRight >= boundaryLeft && playerLeft <= boundaryLeft;
    const topOverlap = playerTop <= boundaryBottom && playerBottom >= boundaryBottom;

    return { bottomOverlap, leftOverlap, rightOverlap, topOverlap };
  }

  detectCollision(entity) {
    const { bottomOverlap, leftOverlap, rightOverlap, topOverlap } = this.#getOverlaps(entity);

    return {
      top: topOverlap && (leftOverlap || rightOverlap),
      bottom: bottomOverlap && (leftOverlap || rightOverlap),
      left: leftOverlap && (topOverlap || bottomOverlap),
      right: rightOverlap && (topOverlap || bottomOverlap)
    };
  }

  detectMinimumAreaOverlap({ x, y, width, height, min = 0.5 }) {
    const { top, bottom, left, right } = this.detectCollision({ x, y, width, height });

    if (top || bottom || left || right) {
      const playerArea = width * height;
      const overlapArea = (width - Math.abs(this.x - x)) * (height - Math.abs(this.y - y));
      const overlapPercentage = overlapArea / playerArea;

      return overlapPercentage > min;
    }
  }

  update({ collisions, movability, speed }) {
    if (collisions.top || movability.down) this.y -= speed;
    if (collisions.bottom || movability.up) this.y += speed;
    if (collisions.left || movability.right) this.x -= speed;
    if (collisions.right || movability.left) this.x += speed;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
