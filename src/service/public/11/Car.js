import { polysIntersect } from "../common/utils/index.js";
import { Controls } from "./Controls.js";
import { NeuralNetwork } from "./Network.js";
import { Sensor } from "./Sensor.js";

class Car {
  constructor({ game, x, y }) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 50;
    this.speed = 1;
    this.angle = 0;
    this.acceleration = 0.6;
    this.maxSpeed = 4;
    this.friction = 0.1;
    this.damaged = false;
    this.color = "yellow";
    this.polygon = this.#createPolygon();
  }

  #move() {
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed * 0.5) {
      this.speed = -this.maxSpeed * 0.5;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  update(deltaTime, roadBorders) {
    this.#move();
    this.polygon = this.#createPolygon();
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) * 0.5;
    const alpha = Math.atan2(this.width, this.height);
    // top right
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad
    });
    // top left
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad
    });
    // bottom left
    points.push({
      x: this.x - Math.sin(this.angle + Math.PI - alpha) * rad,
      y: this.y - Math.cos(this.angle + Math.PI - alpha) * rad
    });
    // bottom right
    points.push({
      x: this.x - Math.sin(this.angle + Math.PI + alpha) * rad,
      y: this.y - Math.cos(this.angle + Math.PI + alpha) * rad
    });

    return points;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    if (this.damaged) ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
  }
}

export class DummyCar extends Car {
  constructor({ game, x, y }) {
    super({ game, x, y });
    this.dummySpeed = this.maxSpeed * 0.8;
  }

  update(deltaTime, roadBorders) {
    super.update(deltaTime);
    this.speed = this.dummySpeed /* * Math.random() * this.maxSpeed * 0.5 + 0.4 */;
  }
}

export class SmartCar extends Car {
  constructor({ game, x, y, brain = null }) {
    super({ game, x, y });
    this.controls = new Controls();
    this.sensor = new Sensor({ game, car: this });
    this.brain = new NeuralNetwork([this.sensor.rayCount, 10, 6, 4]);
    this.damaged = false;
    this.color = "black";
    this.AI = true;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed !== 0) {
      const flip = this.speed < 0 ? -1 : 1;
      if (this.controls.left) {
        this.angle += 0.06 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.06 * flip;
      }
    }
  }

  update(deltaTime, roadBorders, traffic) {
    this.sensor.update(deltaTime, roadBorders, traffic);
    if (!this.damaged) {
      super.update(deltaTime);
      this.damaged = this.#assesDamage(roadBorders, traffic);
      this.#move();
    }
    const offsets = this.sensor.readings.map(s => (s === null ? 0 : 1 - s.offset));
    const outputs = NeuralNetwork.feedForward(offsets, this.brain);

    if (this.AI) {
      this.controls.forward = outputs[0];
      this.controls.left = outputs[1];
      this.controls.right = outputs[2];
      this.controls.reverse = outputs[3];
    }
  }

  #assesDamage(roadBorders, traffic) {
    for (const border of roadBorders) {
      if (polysIntersect(this.polygon, border)) {
        return true;
      }
    }
    for (const car of traffic) {
      if (car && car !== this && polysIntersect(this.polygon, car.polygon)) {
        return true;
      }
    }

    return false;
  }

  draw(ctx, sensor = false) {
    if (this.damaged) ctx.fillStyle = "red";
    super.draw(ctx);
    sensor && this.sensor.draw(ctx);
  }
}
