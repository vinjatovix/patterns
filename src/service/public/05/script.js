const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const enemyTypes = {
  0: {
    image: "img/enemy1.png",
    spriteWidth: 293,
    spriteHeight: 155,
    frames: 4
  },
  1: {
    image: "img/raven.png",
    killSound: "sfx/crow_caw.wav",
    spriteWidth: 271,
    spriteHeight: 194,
    frames: 5,
    frameInterval: Math.random() * 25 + 75
  },
  2: {
    image: "img/enemy2.png",
    spriteWidth: 266,
    spriteHeight: 188,
    frames: 4
  },
  4: {
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
  5: {
    image: "img/enemy4.png",
    spriteWidth: 213,
    spriteHeight: 213,
    frames: 4
  }
};

class DifficultyManager {
  constructor() {
    this.difficulty = 0;
    this.difficultyInterval = 1000;
    this.lastDifficulty = 0;
  }
  update() {
    this.difficulty++;
  }

  static getInstance() {
    if (!this.instance) this.instance = new DifficultyManager();
    return this.instance;
  }
}

class GameTimeManager {
  constructor() {
    if (this.instance) return this.instance;
    this.instance = this;
    this.lastTime = 0;
    this.deltaTime = 0;
  }
  update(timestamp) {
    this.deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    return this.deltaTime;
  }
}

class GameScoreManager {
  constructor() {
    this.score = 0;
    this.left = 0;
    this.gameOver = false;
  }
  update(creature) {
    this.score = this.score + Math.floor((1 / creature.sizeModifier) * creature.speedX * Math.E);
  }

  draw() {
    collisionCtx.strokeRect(0, 0, 200, 150);
    ctx.strokeRect(0, 0, 200, 150);
    ctx.font = "30px monospace";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + this.score, 10, 50);
    ctx.fillText("Left: " + this.left, 10, 100);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + this.score, 12, 52);
    ctx.fillText("Left: " + this.left, 12, 102);
  }

  drawGameOver() {
    ctx.font = "50px monospace";
    ctx.fillStyle = "black";
    ctx.fillText(`Game Over your score is ${this.score}`, canvas.width * 0.5 - 450, canvas.height * 0.5);
    ctx.fillStyle = "white";
    ctx.fillText(`Game Over your score is ${this.score}`, canvas.width * 0.5 - 452, canvas.height * 0.5 + 2);
  }
}

class SpawnManager {
  constructor({ game, canvas, spawnInterval = 3000, maxEnemies = 50 }) {
    this.difficulty = DifficultyManager.getInstance();
    this.canvas = canvas;
    this.game = game;
    this.timeToSpawn = 0;
    this.spawnInterval = spawnInterval;
    this.spawned = 0;
    this.maxEnemies = maxEnemies;
    this.alive = [];
  }

  update(deltaTime) {
    this.timeToSpawn += deltaTime;
    if (this.timeToSpawn > this.spawnInterval && this.spawned < this.maxEnemies) {
      this.spawn();
      this.timeToSpawn = 0;
      this.spawnInterval = this.spawnInterval < 500 ? 500 : this.spawnInterval - this.difficulty.difficulty * 10;
      this.spawned++;
    }
  }

  setAlive(creatures) {
    this.alive = this.alive.concat(creatures).sort((a, b) => a.sizeModifier - b.sizeModifier);
  }

  spawn() {
    const enemy = new Enemy({ canvas: this.canvas });
    this.setAlive([enemy]);
    this.difficulty.update();
  }

  left() {
    return this.maxEnemies - this.spawned + this.alive.length;
  }

  getItems() {
    if (this.alive.some(creature => creature.won)) this.game.gameOver = true;

    this.alive = this.alive.filter(creature => !creature.offScreen);
    return this.alive;
  }
}

class Particle {
  constructor({ x, y, sizeModifier, color, speedModifier = 1 }) {
    this.x = x + Math.random() * 40 - 20;
    this.y = y + Math.random() * 4 - 2;
    this.radius = Math.random() * sizeModifier;
    this.maxRadius = Math.random() * (10 + 30);
    this.offScreen = false;
    this.speedX = Math.random() + 0.05;
    this.color = color;
    this.speedModifier = speedModifier;
  }

  update() {
    this.x += this.speedX * this.speedModifier;
    this.radius += 0.4;
    if (this.radius > this.maxRadius - 5) this.offScreen = true;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = 1 - this.radius / this.maxRadius;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
class ParticleObjectsManager {
  constructor() {
    this.alive = [];
  }

  add({ qty, x, y, sizeModifier, color, speedModifier }) {
    for (let i = 0; i < qty; i++) {
      this.alive.push(new Particle({ x, y, sizeModifier, color, speedModifier }));
    }
  }

  getItems() {
    this.alive = this.alive.filter(particle => !particle.offScreen);
    return this.alive;
  }
}

class Explosion {
  constructor(x, y, sizeModifier) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * sizeModifier;
    this.height = this.spriteHeight * sizeModifier;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "../img/boom.png";
    this.frame = 0;
    this.timer = 0;
    this.frameInterval = 50;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = "../sfx/boom.wav";
    this.sound.volume = 0.4;
  }
  update(deltaTime) {
    // if (this.frame === 0) this.sound.play();
    this.timer += deltaTime;
    if (this.timer > this.frameInterval) {
      this.frame++;
      this.timer = 0;
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

class ExplosionManager {
  constructor() {
    this.explosions = [];
  }

  update(deltaTime) {
    this.explosions.forEach(explosion => explosion.update(deltaTime));
    this.explosions = this.explosions.filter(explosion => explosion.frame < 6);
  }

  draw() {
    this.explosions.forEach(explosion => explosion.draw());
  }

  addExplosion(x, y, sizeModifier) {
    this.explosions.push(new Explosion(x, y, sizeModifier));
  }

  getItems() {
    return this.explosions;
  }
}

class SFXManager {
  constructor() {
    this.sounds = {};
  }

  addSound(name, src) {
    this.sounds[name] = new Audio();
    this.sounds[name].src = src;
  }

  playSound(name) {
    this.sounds[name].play();
  }
}

class ColorHitManager {
  static generate() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return [r, g, b];
  }

  static compare(imageData, creatureColor) {
    const data = imageData;
    const color = creatureColor;

    if (color && data && data[0] === color[0] && data[1] === color[1] && data[2] === color[2]) {
      return true;
    }
  }
}
class Enemy {
  constructor({ canvas, type = 1 }) {
    this.spriteWidth = enemyTypes[type].spriteWidth;
    this.spriteHeight = enemyTypes[type].spriteHeight;
    this.sizeModifier = Math.random() * 0.7 + 0.3;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.speedX = (Math.random() * 8 + 3) / Math.E;
    this.speedY = Math.random() * 4 - 2;
    this.amplitude = Math.random() * 10 - 5;
    this.offScreen = false;
    this.image = new Image();
    this.image.src = "../../img/raven.png";
    this.killSfx = "crow";
    this.frame = 0;
    this.frames = enemyTypes[type].frames;
    this.frameTimer = 0;
    this.frameInterval = enemyTypes[type].frameInterval;
    this.colorSeed = ColorHitManager.generate();
    this.color = `rgb(${this.colorSeed[0]}, ${this.colorSeed[1]}, ${this.colorSeed[2]})`;
    this.won = false;
    this.trail = this.speedX > 3;
    this.lifetime = 0;
  }
  // method to make the enemy move in a sine wave with custom amplitude and vertical speed
  verticalSineWave() {
    this.y += Math.sin(this.lifetime * 0.1) * this.amplitude;
    if (this.y < 0) this.y = 0;
    if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;
  }

  update(deltaTime) {
    this.verticalSineWave();
    this.x -= this.speedX;
    if (this.x < 0 - this.width) this.won = true;
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      if (this.frame > this.frames) this.frame = 0;
      else this.frame++;
      this.frameTimer = 0;
      this.trail &&
        particles.add({
          qty: 7,
          x: this.x + this.width - 20,
          y: this.y + this.height * 0.5,
          color: this.color,
          sizeModifier: this.sizeModifier,
          speedModifier: 1
        });
    }
  }

  draw() {
    this.lifetime++;
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (this.frame >= this.frames) this.frame = 0;
  }
}

const sfx = new SFXManager();
sfx.addSound("crow", "../sfx/crow_caw.wav");
sfx.addSound("explosion", "../sfx/boom.wav");
const score = new GameScoreManager();
const spawn = new SpawnManager({ game: score, canvas });
const explosions = new ExplosionManager();
const particles = new ParticleObjectsManager();

class AnimationManager {
  constructor({
    ctx = [],
    animations = [],
    score = new GameScoreManager(),
    spawns = [],
    width = 640,
    height = 480
  } = {}) {
    this.time = new GameTimeManager();
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.animations = animations;
    this.spawns = spawns;
    this.score = score;
  }

  refresh() {
    this.ctx.forEach(ctx => {
      ctx.clearRect(0, 0, this.width, this.height);
    });
  }

  animate(timestamp = 0) {
    this.refresh();
    this.time.update(timestamp);
    this.spawns.forEach(spawn => {
      spawn.update(this.time.deltaTime);
    });
    score.left = spawn.left();
    score.draw();
    this.animations.forEach(animation => {
      if (animation.getItems) {
        animation.getItems().forEach(item => {
          item.update(this.time.deltaTime);
          item.draw();
        });
      } else {
        animation.update(this.time.deltaTime);
        animation.draw();
      }
    });

    score.gameOver ? score.drawGameOver() : requestAnimationFrame(this.animate.bind(this));
    //ask user to play again
    if (score.gameOver) {
      setTimeout(() => {
        const playAgain = confirm("Play again?");
        if (playAgain) {
          window.location.reload();
        }
      }, 2000);
    }
  }

  run() {
    this.animate(0);
  }
}

const animationManager = new AnimationManager({
  ctx: [ctx, collisionCtx],
  width: canvas.width,
  height: canvas.height,
  animations: [particles, spawn, explosions],
  spawns: [spawn],
  score: score
});

animationManager.run();

window.addEventListener("click", async e => {
  const x = e.clientX;
  const y = e.clientY;
  const detectPixelColor = collisionCtx.getImageData(x, y, 1, 1);
  [...spawn.getItems(), ...explosions.getItems()].forEach(creature => {
    if (ColorHitManager.compare(detectPixelColor.data, creature.colorSeed)) {
      sfx.playSound(creature.killSfx);
      sfx.playSound("explosion");

      creature.offScreen = true;
      score.update(creature);
      explosions.addExplosion(
        creature.x + creature.width * 0.5,
        creature.y + creature.height * 0.5,
        creature.sizeModifier
      );
    }
  });
});
