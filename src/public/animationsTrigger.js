const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);

const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();
window.addEventListener("resize", () => {
  canvasPosition = canvas.getBoundingClientRect();
});

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "img/boom.png";
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = "sfx/boom.wav";
    this.sound.volume = 0.4;
  }
  update() {
    if (this.frame === 0) this.sound.play();
    this.timer++;
    if (this.timer % 8 === 0) {
      this.frame++;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width * 0.5, // se capturan en ctx.translate
      0 - this.height * 0.5,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

window.addEventListener("click", e => {
  createExplosionAnimation(e);
});

const animateExplosions = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  explosions.forEach((explosion, index) => {
    explosion.update();
    explosion.draw();
    if (explosion.frame > 5) {
      explosions.splice(index, 1);
      index--;
    }
  });
  requestAnimationFrame(animateExplosions);
};

animateExplosions();
const createExplosionAnimation = e => {
  let posX = e.x - canvasPosition.left;
  let posY = e.y - canvasPosition.top;
  explosions.push(new Explosion(posX, posY));
};
