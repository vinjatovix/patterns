const livesDogImage = new Image();
livesDogImage.src = "../img/lives_dog.png";

const livesHeartImage = new Image();
livesHeartImage.src = "../img/lives_heart.png";

export class UI {
  constructor({ game }) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.fontColor = "white";
    this.font = `${this.fontSize}px ${this.fontFamily}`;
    this.livesImage = Math.random() > 0.5 ? livesDogImage : livesHeartImage;
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowColor = "white";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.font = this.font;
    ctx.textAlign = "left";
    ctx.fillStyle = this.game.fontColor;

    ctx.fillText(`Score: ${this.game.score}`, 20, this.fontSize);
    ctx.fillText(`Speed: ${this.game.speed}`, 20, this.fontSize * 2);
    // ctx.fillText(`High Score: ${this.game.highScore}`, 20, this.fontSize * 3);
    // ctx.fillText(`Lives: ${this.game.lives}`, 20, this.fontSize * 4);
    ctx.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
    ctx.fillText(`Time: ${Math.round(this.game.maxTime / 1000 - this.game.time / 1000)}`, 20, this.fontSize * 5);
    for (let i = 0; i < this.game.player.lives; i++) {
      // draw lives under time
      ctx.drawImage(this.livesImage, 20 + i * 30, this.fontSize * 5.5, 30, 30);
    }
    if (this.game.player.lives <= 0) {
      this.game.gameOver = true;
    }

    if (this.game.gameOver) {
      ctx.textAlign = "center";
      ctx.font = `${this.fontSize * 2}px ${this.fontFamily}`;
      if (this.game.score > 15) ctx.fillText(`You Win`, this.game.width / 2, this.game.height / 2);
      else ctx.fillText(`Game Over`, this.game.width / 2, this.game.height / 2);
      ctx.font = `${this.fontSize * 1.5}px ${this.fontFamily}`;
    }
    ctx.restore();
  }
}
