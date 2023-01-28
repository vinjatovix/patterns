export class FloatingMessage {
  constructor({ value, x, y, targetX, targetY }) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = 0.03;
    this.life = 2000;
    this.dead = false;
    this.opacity = 1;
  }

  update(deltaTime) {
    this.life -= deltaTime;
    if (this.life <= 0) {
      this.dead = true;
    }
    this.opacity = this.life / 2000;
    this.x += (this.targetX - this.x) * this.speed;
    this.y += (this.targetY - this.y) * this.speed;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.font = "30px Creepster";
    ctx.fillStyle = "white";
    ctx.fillText(this.value, this.x, this.y);
    ctx.fillStyle = "black";
    ctx.fillText(this.value, this.x - 2, this.y - 2);
    ctx.restore();
  }
}

export class FloatingMessagesManager {
  constructor({ game }) {
    this.game = game;
    this.messages = [];
  }

  addMessage({ value, x, y, targetX, targetY }) {
    this.messages.push(new FloatingMessage({ value, x, y, targetX, targetY }));
  }

  update(deltaTime) {
    this.messages.forEach(message => message.update(deltaTime));
    this.messages = this.messages.filter(message => !message.dead);
  }

  draw(ctx) {
    this.messages.forEach(message => message.draw(ctx));
  }
}
