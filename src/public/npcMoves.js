/** @type {HTMLCanvasElement} */
const getCanvasAndContext = (id = "canvas", type = "2d") => {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext(type);
  return { canvas, ctx };
};

const { canvas, ctx } = getCanvasAndContext("canvas1");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

const numEnemies = 15;
const enemies = [];

let gameFrame = 0;

const enemyTypes = {
  0: {
    image: "img/enemy1.png",
    spriteWidth: 293,
    spriteHeight: 155,
    frames: 4
  },
  1: {
    image: "img/enemy2.png",
    spriteWidth: 266,
    spriteHeight: 188,
    frames: 4
  },
  2: {
    image: "img/enemy2.png",
    spriteWidth: 266,
    spriteHeight: 188,
    frames: 4
  },
  3: {
    image: "img/enemy3.png",
    spriteWidth: 218,
    spriteHeight: 177,
    frames: 4
  },
  4: {
    image: "img/enemy3.png",
    spriteWidth: 218,
    spriteHeight: 177,
    frames: 4
  },
  5: {
    image: "img/enemy4.png",
    spriteWidth: 213,
    spriteHeight: 213,
    frames: 4
  }
};

class Enemy {
  constructor({ xSpeed = Math.random() * 8 - 4, ySpeed = Math.random() * 8 - 4, size } = {}) {
    this.randomType = Math.floor(Math.random() * 6);
    this.type = Object.values(enemyTypes)[this.randomType];
    this.size = size || Math.floor(Math.random() * 10) + 3;
    this.speedRandomizer = (Math.random() > 0.5 ? 1 : -1) * (Math.random() + 0.5);
    this.image = new Image();
    this.image.src = this.type.image;

    this.width = this.type.spriteWidth / this.size;
    this.height = this.type.spriteHeight / this.size;

    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.xSpeed = xSpeed * this.speedRandomizer;
    this.ySpeed = ySpeed * this.speedRandomizer;
    this.angleSpeed = Math.random() * Math.random() * 10 - 5;
    this.angleSpeed2 = Math.random() * Math.random() * 0.1 - 0.05;
    this.amplitude = Math.random() * 10 - 5;
    this.phase = Math.random() * Math.PI * 2;
    this.waveLength = Math.random() * Math.PI * 2;

    this.interval = Math.floor(Math.random() * 200 + 50);
    this.frame = 0;
    this.frameSpeed = Math.floor(Math.random() * 3) + 1;
  }

  animateSprite() {
    if (gameFrame % this.frameSpeed === 0) {
      this.frame > this.type.frames ? (this.frame = 0) : this.frame++;
    }
  }

  bounceTheWalls() {
    if (this.x + this.width > CANVAS_WIDTH || this.x < 0) {
      this.xSpeed = -this.xSpeed;
    }
    if (this.y + this.height > CANVAS_HEIGHT || this.y < 0) {
      this.ySpeed = -this.ySpeed;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  restrictToCanvas() {
    if (this.x + this.width > CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - this.width;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y + this.height > CANVAS_HEIGHT) {
      this.y = CANVAS_HEIGHT - this.height;
    }
    if (this.y < 0) {
      this.y = 0;
    }
  }

  update() {
    if (this.randomType === 0) this.asAFly({ elipse: true, restrictToCanvas: true });
    if (this.randomType === 1) this.endlessLeft({ sine: true });
    if (this.randomType === 2) this.compositeSineWave();
    if (this.randomType === 3) this.elipse({ restrictToCanvas: true });
    if (this.randomType === 4) this.randomPath();
    if (this.randomType === 5) this.bounceTheWalls();

    this.animateSprite();
  }

  randomPath(speed = 40, interval = this.interval) {
    if (gameFrame % interval === 0) {
      this.newX = Math.random() * (CANVAS_WIDTH - this.width);
      this.newY = Math.random() * (CANVAS_HEIGHT - this.height);
    }

    this.x -= (this.x - this.newX) / speed;
    this.y -= (this.y - this.newY) / speed;
  }

  asAFly({ sine, elipse, restrictToCanvas } = {}) {
    sine && this.verticalSineWave();
    elipse && this.elipse();
    this.x += Math.random() * 15 - 7.5;
    this.y += Math.random() * 10 - 5;
    restrictToCanvas && this.restrictToCanvas();
  }

  collibri({ restrictToCanvas } = {}) {
    this.y += Math.sin((this.phase / Math.random()) * 10 - 5) * this.ySpeed;
    this.x += Math.cos((this.phase / Math.random()) * 10 - 5) * 2 * this.xSpeed;
    this.phase += this.angleSpeed;
    restrictToCanvas && this.restrictToCanvas();
  }

  verticalSineWave({ amp = this.amplitude, waveLength = this.waveLength, restrictToCanvas } = {}) {
    this.y += amp * Math.sin(gameFrame / waveLength) * 2;
    restrictToCanvas && this.restrictToCanvas();
  }

  horizontalSineWave({ amp = this.amplitude, waveLength = 180, restrictToCanvas } = {}) {
    this.x += amp * Math.sin((this.phase * Math.PI) / waveLength) * this.xSpeed;
    this.phase += this.angleSpeed;

    restrictToCanvas && this.restrictToCanvas();
  }
  endlessLeft({ sine, elipse } = {}) {
    this.x -= Math.abs(this.xSpeed);
    sine && this.verticalSineWave();
    elipse && this.elipse();
    if (this.x + this.width < 0) {
      this.x = CANVAS_WIDTH;
    }
  }

  compositeSineWave(amp = 1, waveLength = Math.E, { restrictToCanvas } = {}) {
    this.verticalSineWave({ amp, waveLength });
    this.horizontalSineWave();
    restrictToCanvas && this.restrictToCanvas();
  }

  elipse({ restrictToCanvas } = {}) {
    this.x += Math.sin((this.phase * Math.PI) / 180) * this.xSpeed;
    this.y += Math.cos((this.phase * Math.PI) / 180) * this.ySpeed;
    this.phase += this.angleSpeed;
    restrictToCanvas && this.restrictToCanvas();
  }

  draw() {
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.type.spriteWidth,
      0,
      this.type.spriteWidth,
      this.type.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

for (let i = 0; i < numEnemies; i++) {
  enemies.push(new Enemy({ type: enemyTypes.b }));
  enemies.sort((a, b) => b.size - a.size);
}

const animate = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemies.forEach(enemy => {
    enemy.update();
    enemy.draw();
  });

  gameFrame++;
  requestAnimationFrame(animate);
};

animate();
