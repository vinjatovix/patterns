class ParallaxLayer {
  constructor(image, speedModifier, initialSpeed = 2) {
    this.image = image;
    this.speedModifier = speedModifier;
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 700;
    this.speed = initialSpeed * this.speedModifier;
  }

  update(gameSpeed) {
    this.speed = gameSpeed * this.speedModifier;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x = Math.floor(this.x - this.speed);
    // this.x = (gameFrame * this.speed) % this.width;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
}

module.exports = ParallaxLayer;
