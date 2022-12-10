const getCanvasAndContext = (id = "canvas", type = "2d") => {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext(type);
  return { canvas, ctx };
};

const { canvas, ctx } = getCanvasAndContext("canvas1");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

let gameSpeed = 2;
// let gameFrame = 0;

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

const backgroundLayer1 = new Image();
backgroundLayer1.src = "./img/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "./img/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "./img/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "./img/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "./img/layer-5.png";

window.addEventListener("load", () => {
  const slider = document.getElementById("slider");
  slider.value = gameSpeed;
  const showGameSpeed = document.getElementById("showGameSpeed");
  showGameSpeed.innerHTML = gameSpeed;
  slider.addEventListener("input", ({ target }) => {
    gameSpeed = target.value;
    showGameSpeed.innerHTML = gameSpeed;
  });

  const ground = new ParallaxLayer(backgroundLayer5, 1);
  const nearBg = new ParallaxLayer(backgroundLayer4, 0.8);
  const clouds = new ParallaxLayer(backgroundLayer3, 1.2);
  const farBg = new ParallaxLayer(backgroundLayer2, 0.4);
  const sky = new ParallaxLayer(backgroundLayer1, 0.2);

  const layers = [sky, farBg, clouds, nearBg, ground];
  const animate = () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    layers.forEach(layer => {
      layer.update(gameSpeed);
      layer.draw(ctx);
    });
    // gameFrame--;
    requestAnimationFrame(animate);
  };

  animate();
});
