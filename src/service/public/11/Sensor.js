import { getIntersection, lerp } from "../common/utils/index.js";

export class Sensor {
  constructor({ car, rayCount = 5 }) {
    this.car = car;
    this.rayCount = rayCount;
    this.rayLength = 125;
    this.raySpread = Math.PI * 2;
    this.readings = [];
  }

  update({ roadBorders, traffic }) {
    this.#castRays();
    this.readings = [];
    for (const ray of this.rays) {
      const reading = this.#getReading(ray, roadBorders, traffic);
      this.readings.push(reading);
    }
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

  #getReading(ray, roadBorders, traffic) {
    const [start, end] = ray;
    let touches = [];

    for (const [borderStart, borderEnd] of roadBorders) {
      const touch = getIntersection(start, end, borderStart, borderEnd);
      if (touch) {
        touches.push(touch);
      }
    }

    for (const car of traffic) {
      const poly = car.polygon;
      for (let i = 0; i < poly.length; i++) {
        const touch = getIntersection(start, end, poly[i], poly[(i + 1) % poly.length]);
        if (touch) {
          touches.push(touch);
        }
      }
    }

    if (!touches || touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map(e => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find(e => e.offset === minOffset);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      const end = this.readings[i] ? this.readings[i] : this.rays[i][1];
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
