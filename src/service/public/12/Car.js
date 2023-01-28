import { polysIntersect } from "../common/utils/index.js";
import { Controls } from "./Controls.js";
import { NeuralNetwork } from "./Network.js";
import { Sensor } from "./Sensor.js";

class Car {
  constructor({ x, y }) {
    this.id = parseInt((Math.random() * 1000 * Math.random() * 1000 * Date.now()).toString(36).slice(0, 8), 36);
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 50;
    this.speed = 1;
    this.angle = 0;
    this.acceleration = 0.6;
    this.maxSpeed = 3;
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

  update() {
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
  constructor({ x, y, options = { randomSpeed: false, color: "yellow" } }) {
    super({ x, y });
    this.options = options;
    this.color = options.color;
    this.dummySpeed = this.maxSpeed * 0.7 * (this.options.randomSpeed ? Math.random() * this.maxSpeed * 0.4 + 0.2 : 1);
  }

  update() {
    super.update();
    this.speed = this.dummySpeed;
  }
}

export class ControlledCar extends Car {
  constructor({ x, y, angle = 0 }) {
    super({ x, y });
    this.controls = new Controls();
    this.color = "blue";
    this.angle = angle;
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

  update() {
    super.update();
    this.#move();
  }
}

export class SmartCar extends ControlledCar {
  constructor({
    x,
    y,
    brain = [],
    maxSpeed = 3,
    color = "black",
    rayCount = 8,
    rayLength = 100,
    raySpread = Math.PI * 0.9,
    angleSensor = false,
    angle = 0
  }) {
    super({ x, y, angle });
    this.maxSpeed = maxSpeed;
    this.color = color;
    this.controls = new Controls();
    this.sensor = new Sensor({ car: this, rayCount, rayLength, raySpread });
    this.angleSensor = angleSensor;

    this.brain = new NeuralNetwork([this.sensor.rayCount + (this.angleSensor ? 1 : 0), 6, 4]);
    if (brain.length) {
      this.brain.loadBrain(brain);
    }
    this.damaged = false;
  }

  update({ roadBorders, traffic }) {
    this.sensor.update({ roadBorders, traffic, id: this.id });
    if (!this.damaged) {
      super.update();
      this.damaged = this.#assesDamage(roadBorders, traffic);
    }
    const offsets = this.sensor.readings.map(s => (s === null ? 0 : 1 - s.offset));

    if (this.angleSensor) {
      const normalizedAngle = Math.abs(this.angle % (Math.PI * 2));
      let angleOffset = 1;
      if (normalizedAngle >= 0 && normalizedAngle < Math.PI) {
        angleOffset = 1 - normalizedAngle / Math.PI;
      } else if (normalizedAngle >= Math.PI && normalizedAngle <= Math.PI * 2) {
        angleOffset = -(normalizedAngle - Math.PI) / Math.PI;
      }
      offsets.unshift(angleOffset);
    }

    const outputs = NeuralNetwork.feedForward(offsets, this.brain);

    this.controls.forward = outputs[0];
    this.controls.left = outputs[1];
    this.controls.right = outputs[2];
    this.controls.reverse = outputs[3];
  }

  #assesDamage(roadBorders, traffic = []) {
    if (this.sensor.readings.some(s => s && s.offset < 0.21)) this.damaged = true;

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
