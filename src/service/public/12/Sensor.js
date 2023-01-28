import { getIntersection, lerp } from "../common/utils/index.js";

export class Sensor {
  constructor({ car, rayCount = 7, rayLength = 100, raySpread = Math.PI * 0.9 }) {
    this.car = car;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.raySpread = raySpread;
    this.rays = [];
    this.readings = [];
    this.debug = true;
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const direction = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
      const rayAngle = lerp(this.raySpread * 0.5, -this.raySpread * 0.5, direction) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength
      };

      this.rays.push([start, end]);
    }
  }

  #getReading({ id, ray, roadBorders, traffic = [] }) {
    const touches = [];
    const [rayStart, rayEnd] = ray;

    for (const [borderStart, borderEnd] of roadBorders) {
      const touch = getIntersection(rayStart, rayEnd, borderStart, borderEnd);
      if (touch) {
        touches.push(touch);
      }
    }

    for (const car of traffic) {
      if (car.id === id) continue;
      const polygonPoints = car.polygon;
      for (let i = 0; i < polygonPoints.length; i++) {
        const touch = getIntersection(
          rayStart,
          rayEnd,
          polygonPoints[i],
          polygonPoints[(i + 1) % polygonPoints.length]
        );
        if (touch) {
          touches.push(touch);
        }
      }
    }

    if (!touches.length) {
      return null;
    } else {
      const offsets = touches.map(e => e.offset);
      const minOffset = Math.min(...offsets);

      return touches.find(e => e.offset === minOffset);
    }
  }

  update({ roadBorders, traffic, id }) {
    this.#castRays();
    this.readings = [];
    for (const ray of this.rays) {
      const reading = this.#getReading({ ray, roadBorders, traffic, id });
      this.readings.push(reading);
    }
  }

  draw(ctx) {
    if (!this.debug) return;
    for (let i = 0; i < this.rayCount; i++) {
      const end = this.readings[i] ? this.readings[i] : this.rays[i][1];
      // draw ray
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // draw shadow
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
