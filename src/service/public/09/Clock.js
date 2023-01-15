export default class Clock {
  constructor() {
    this.lastTime = Date.now();
    this.deltaTime = 0;
  }

  calculateFPS() {
    return 1000 / this.deltaTime;
  }

  update(timestamp) {
    const now = timestamp || Date.now();
    this.deltaTime = now - this.lastTime;
    this.lastTime = now;

    return this.deltaTime;
  }
}
