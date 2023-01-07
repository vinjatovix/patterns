document.addEventListener("DOMContentLoaded", () => {
  let startLevel = +prompt("Enter level 0-1000", 0);
  if (startLevel < 0 || startLevel > 2000 || isNaN(startLevel)) {
    startLevel = 0;
  }

  const gameOptions = Object.freeze({
    display: {
      maxWidth: 1280 * 4,
      minWidth: 1280 / 2,
      maxHeight: 768 * 4,
      minHeight: 768 / 2,
      persist: false
    },
    mechanics: {
      startLevel,
      maxLevel: 1100,
      capture: false,
      limitCanvas: false,
      outDies: false,
      timeless: true
    },
    effects: {
      blood: true,
      snuff: false,
      debug: false,
      dot: false,
      collider: false
    }
  });

  class InputHandler {
    constructor({ options }) {
      if (this.instance) {
        return this.instance;
      }
      this.instance = this;
      this.options = options;
      this.pressKeys = [];
      this.toggleKeys = ["a", "b", "c", "d", "l", "s", "o", "t", "x"];
      this.keys = [...this.pressKeys, ...this.toggleKeys].reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      window.addEventListener("keydown", this.keyDownHandler.bind(this));
      window.addEventListener("keyup", this.keyUpHandler.bind(this));
    }
    keyDownHandler(e) {
      if (this.pressKeys.includes(e.key)) {
        this.keys[e.key] = true;
      }
      if (this.toggleKeys.includes(e.key)) {
        this.keys[e.key] = !this.keys[e.key];
        this.options.setLocalStorage();
      }
    }

    keyUpHandler(e) {
      if (this.pressKeys.includes(e.key)) {
        this.keys[e.key] = false;
      }
    }

    getKeys() {
      return this.keys;
    }
  }

  class OptionsManager {
    constructor({ display, mechanics, effects }) {
      this.display = display;
      this.mechanics = mechanics;
      this.effects = effects;
      this.input = new InputHandler({ options: this });
    }
    update() {
      const keys = this.input.getKeys();
      this.display.persist = keys.x;
      this.effects.debug = keys.d;
      this.effects.collider = keys.d;
      this.effects.dot = keys.a;
      this.effects.blood = keys.b;
      this.effects.snuff = keys.s;
      this.mechanics.limitCanvas = keys.l;
      this.mechanics.outDies = keys.o;
      this.mechanics.capture = keys["c"];
      // this.mechanics.timeless = keys["t"];
    }

    setMechanics(key, value) {
      this.mechanics[key] = value;
    }

    setLocalStorage() {
      localStorage.setItem("gameOptions", JSON.stringify({ options: this.input.getKeys() }));
    }

    getLocalStorage() {
      const { options } = JSON.parse(localStorage.getItem("gameOptions")) || {};
      if (!options) return;
      this.input.keys = options;
    }
  }

  class CanvasManager {
    constructor({ options }) {
      this.options = options;
      this.canvas = document.getElementById("canvas1");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = options.display.minWidth + options.display.maxWidth * 0.003 * options.mechanics.startLevel;
      this.canvas.height = options.display.minHeight + options.display.maxHeight * 0.003 * options.mechanics.startLevel;
    }
    clear() {
      !this.options.display.persist && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getCanvas() {
      return this.canvas;
    }
    getCtx() {
      return this.ctx;
    }
    getFontSize50() {
      return this.canvas.height / 50;
    }
    getCanvasWidth() {
      return this.canvas.width;
    }
    getCanvasHeight() {
      return this.canvas.height;
    }
    getCanvasCenter() {
      return {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2
      };
    }
    getCanvasSize() {
      return {
        width: this.canvas.width,
        height: this.canvas.height
      };
    }
    resize(level, factor = 0.003) {
      this.canvas.width = this.options.display.minWidth + this.options.display.maxWidth * 0.003 * level;
      this.canvas.height = this.options.display.minHeight + this.options.display.maxHeight * 0.003 * level;
      if (this.canvas.width > this.options.display.maxWidth) this.canvas.width = this.options.display.maxWidth;
      if (this.canvas.height > this.options.display.maxHeight) this.canvas.height = this.options.display.maxHeight;

      return this.getCanvasSize();
    }
    getScale() {
      return this.canvas.width / this.options.display.maxWidth;
    }
    getSpawnX() {
      return Math.random() * (this.getCanvasWidth() - this.getCanvasWidth() / 3) + this.getCanvasWidth() / 6;
    }
    getSpawnY() {
      return Math.random() * (this.getCanvasHeight() - this.getCanvasHeight() / 3) + this.getCanvasHeight() / 6;
    }
    visible(x, y, width, height) {
      if (x > 1 && x < this.canvas.width - width && y > 1 && y < this.canvas.height - height) {
        return true;
      }
    }
    checkOverLap(a, b) {
      if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) {
        return true;
      }
    }
  }

  class ScoreManager {
    constructor() {
      this.initialValues = { kills: 0, deaths: 0, score: 0, ratio: 0 };
      this.rocks = { emoji: "🪨", ...this.initialValues };
      this.papers = { emoji: "📄", ...this.initialValues };
      this.scissors = { emoji: "✂️", ...this.initialValues };
      this.lizards = { emoji: "🦎", ...this.initialValues };
      this.spocks = { emoji: "🖖", ...this.initialValues };
    }

    update(killerTeam, victimTeam) {
      this[killerTeam].kills += 1;
      this[victimTeam].deaths += 1;
      this[killerTeam].ratio = (this[killerTeam].kills / this[killerTeam].deaths).toFixed(2);
      this[victimTeam].ratio = (this[victimTeam].kills / this[victimTeam].deaths).toFixed(2);
    }

    addScore(team) {
      this[team].score += 1;
    }

    #orderRanking(ranking) {
      ranking.sort((a, b) => {
        if (a.score === b.score) {
          if (a.ratio === b.ratio) {
            if (a.kills === b.kills) {
              return b.deaths - a.deaths;
            }
            return b.kills - a.kills;
          }
          return b.ratio - a.ratio;
        }
        return b.score - a.score;
      });
      return ranking;
    }

    getRanking() {
      const ranking = [];
      for (const team in this) {
        if (this[team]["emoji"]) {
          ranking.push(this[team]);
        }
      }
      return this.#orderRanking(ranking);
    }
  }

  class ScoreDrawer {
    constructor({ scoreManager, canvasManager }) {
      this.scoreManager = scoreManager;
      this.canvasManager = canvasManager;
      this.ctx = this.canvasManager.getCtx();
    }
    #ctxSetup() {
      this.ctx.font = `${this.fontSize}px Arial`;
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";
    }

    draw() {
      this.fontSize = this.canvasManager.getFontSize50();
      this.ctx.save();
      this.#ctxSetup();
      const ranking = this.scoreManager.getRanking();
      for (let i = 0; i < ranking.length; i++) {
        if (i === 0) {
          this.ctx.fillStyle = "gold";
        } else if (i === 1) {
          this.ctx.fillStyle = "silver";
        } else if (i === 2) {
          this.ctx.fillStyle = "brown";
        } else {
          this.ctx.fillStyle = "white";
        }

        const team = ranking[i];
        this.ctx.fillText(
          `${team.emoji} W:${team.score}, Ratio:${team.ratio}  Frags:${team.kills}, KO:${team.deaths}`,
          10,
          10 + i * this.fontSize
        );
      }
      this.ctx.restore();
    }
  }

  class EventHandler {
    constructor(enemies) {
      this.events = {};
    }

    subscribe(enemy, event) {
      if (this.events[event]) {
        this.events[event].subscribers.push(enemy);
      } else {
        this.events[event] = {
          subscribers: [enemy],
          timeout: setTimeout(() => {
            this.unsubscribe(event);
          }, 3000)
        };
      }
    }

    unsubscribe(event) {
      // Check if event exists
      if (this.events[event]) {
        clearTimeout(this.events[event].timeout);
        delete this.events[event];
      }
    }
  }

  class Enemy {
    constructor({ game, x = null, y = null, angle = null }) {
      this.emoji = "👾";
      this.game = game;
      this.ctx = this.game.canvasManager.getCtx();
      this.x = x || this.game.canvasManager.getSpawnX();
      this.y = y || this.game.canvasManager.getSpawnY();
      this.speed = (Math.random() * 4 + 2) * this.game.canvasManager.getScale();
      this.maxSpeed = 15 * (this.game.canvasManager.getScale() * 1.5);
      this.minSpeed = 0.5;
      this.acceleration = 0.06 * this.game.canvasManager.getScale() * 2;
      this.deceleration = 0.06 * this.game.canvasManager.getScale();
      this.angle = angle || Math.random() * 2 * Math.PI;
      this.rotationSpeed = 0.0125 * (1 + this.game.canvasManager.getScale());
      this.rotationAcceleration = 0.0005 * (1 + this.game.canvasManager.getScale());
      this.width = 20;
      this.height = 20;
      this.vx = 0;
      this.vy = 0;
      this.aim = [Rock, Paper, Scissors, Lizard, Spock];
      this.aimX = null;
      this.aimY = null;
      this.closest = null;
      this.killedBy = null;
      this.team = "enemies";
      this.color = "black";
      this.dead = false;
      this.offScreen = false;
      this.eventHandler = this.game.eventHandler;
      this.life = 100;
      this.maxLife = 100;
      this.damage = 5;
    }

    subscribeToEvent(event) {
      this.eventHandler.subscribe(this, event);
    }

    #kill(enemy) {
      if (this.aim.includes(enemy.constructor)) {
        enemy.life -= this.damage;
        if (enemy.life <= 0) {
          enemy.dead = true;
          enemy.killedBy = this.constructor;
          this.game.scoreManager.update(this.team, enemy.team);
        }
      }
    }

    #checkCollision(allEnemies) {
      for (const enemy of allEnemies) {
        if (enemy !== this && this.game.canvasManager.checkOverLap(this, enemy)) {
          this.#kill(enemy);
        }
      }
    }

    #checkPosition() {
      this.offScreen = !this.game.canvasManager.visible(this.x, this.y, this.width, this.height);
      if (this.offScreen && this.game.options.mechanics.outDies) {
        this.dead = true;
      }
    }
    #limitPosition() {
      if (this.x < 0) {
        this.x = 0;
      }
      if (this.x + this.width > this.game.canvasManager.getCanvasWidth()) {
        this.x = this.game.canvasManager.getCanvasWidth() - this.width;
      }
      if (this.y < 0) {
        this.y = 0;
      }
      if (this.y > this.game.canvasManager.getCanvasHeight() - this.height) {
        this.y = this.game.canvasManager.getCanvasHeight() - this.height;
      }
    }

    #limitSpeed() {
      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
      }
      if (this.speed < this.minSpeed) {
        this.speed = this.minSpeed;
      }
    }

    #calculateAngleDiff() {
      const angleDiff = this.angle - Math.atan2(this.aimY - this.y, this.aimX - this.x);
      if (angleDiff > Math.PI) {
        return angleDiff - 2 * Math.PI;
      }
      if (angleDiff < -Math.PI) {
        return angleDiff + 2 * Math.PI;
      }
      return angleDiff;
    }

    #calculateRotationSpeed(angleDiff) {
      this.angle = angleDiff < 0 ? this.angle + this.rotationSpeed : this.angle - this.rotationSpeed;
    }

    #calculateSpeed(angleDiff) {
      if (Math.abs(angleDiff) < Math.PI / 12) {
        this.speed += this.acceleration;
      }
      if (Math.abs(angleDiff) > Math.PI / 8) {
        this.speed -= this.deceleration;
      }

      this.#limitSpeed();
    }

    #goCenter() {
      const { x, y } = this.game.canvasManager.getCanvasCenter();
      this.aimX = x;
      this.aimY = y;
    }

    #setTarget(allEnemies) {
      this.closest = null;
      for (const enemy of allEnemies) {
        if (this.aim.includes(enemy.constructor) && !enemy.dead) {
          if (this.closest) {
            if (
              Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)) <
              Math.sqrt(Math.pow(this.x - this.closest.x, 2) + Math.pow(this.y - this.closest.y, 2))
            ) {
              this.closest = enemy;
            }
          } else {
            this.closest = enemy;
          }
        }
      }
      if (this.closest) {
        this.aimX = this.closest.x;
        this.aimY = this.closest.y;
      } else {
        this.#goCenter();
      }
    }

    move(deltaTime) {
      const d = deltaTime / 30;
      const angleDiff = this.#calculateAngleDiff();
      this.#calculateRotationSpeed(angleDiff);
      this.#calculateSpeed(angleDiff);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.x += this.vx * d;
      this.y += this.vy * d;

      this.game.options.mechanics.limitCanvas && this.#limitPosition();
    }

    update(deltaTime, allEnemies) {
      this.#checkPosition();
      this.#setTarget(allEnemies);
      this.move(deltaTime);
      this.#checkCollision(allEnemies);
    }

    #drawRectangle() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    #drawLineToAim() {
      if (
        this.aimX === this.game.canvasManager.getCanvasWidth() / 2 &&
        this.aimY === this.game.canvasManager.getCanvasHeight() / 2
      )
        return;
      this.ctx.strokeStyle = this.color;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      this.ctx.lineTo(this.aimX + this.width / 2, this.aimY + this.height / 2);
      this.ctx.stroke();
    }

    #drawDirectionArrow() {
      this.ctx.strokeStyle = this.color;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      this.ctx.lineTo(
        this.x + this.width / 2 + Math.cos(this.angle) * this.width,
        this.y + this.height / 2 + Math.sin(this.angle) * this.height
      );
      this.ctx.stroke();
    }

    #drawDirectionDot() {
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(
        this.x + this.width / 2 + Math.cos(this.angle) * this.width,
        this.y + this.height / 2 + Math.sin(this.angle) * this.height,
        5,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }

    #drawDirectionTriangle() {
      this.ctx.save();
      this.ctx.globalAlpha = 0.4;
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.x + this.width / 2 + Math.cos(this.angle) * this.width,
        this.y + this.height / 2 + Math.sin(this.angle) * this.height
      );
      this.ctx.lineTo(
        this.x + this.width / 2 + Math.cos(this.angle + Math.PI / 4) * this.width,
        this.y + this.height / 2 + Math.sin(this.angle + Math.PI / 4) * this.height
      );
      this.ctx.lineTo(
        this.x + this.width / 2 + Math.cos(this.angle - Math.PI / 4) * this.width,
        this.y + this.height / 2 + Math.sin(this.angle - Math.PI / 4) * this.height
      );
      this.ctx.fill();
      this.ctx.restore();
    }

    #drawHealthBar() {
      this.ctx.save();
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.x, this.y - 10, this.width, 5);
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(this.x, this.y - 10, (this.width * this.life) / this.maxLife, 5);
      this.ctx.restore();
    }

    draw() {
      this.#drawHealthBar();
      this.game.options.effects.collider && this.#drawRectangle();
      this.game.options.effects.debug && this.#drawLineToAim();
      this.game.options.effects.arrow && this.#drawDirectionArrow();
      this.game.options.effects.dot && this.#drawDirectionDot();
      this.game.options.effects.triangle && this.#drawDirectionTriangle();
      this.ctx.font = "20px Arial";
      this.drawEmoji();
    }
    drawEmoji() {
      this.ctx.save();
      this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      this.ctx.rotate(this.angle + Math.PI / 2);
      this.ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      this.ctx.fillText(this.emoji, this.x - 2.5, this.y + 16);
      this.ctx.restore();
    }
  }

  class Rock extends Enemy {
    constructor({ x, y, game }) {
      super({ x, y, game });
      this.emoji = "🪨";
      this.team = "rocks";
      this.aim = [Scissors, Lizard];
      this.color = "gray";
    }
  }

  class Paper extends Enemy {
    constructor({ x, y, game }) {
      super({ x, y, game });
      this.emoji = "📄";
      this.team = "papers";
      this.aim = [Rock, Spock];
      this.color = "purple";
    }
  }

  class Scissors extends Enemy {
    constructor({ x, y, game }) {
      super({ x, y, game });
      this.emoji = "✂️";
      this.team = "scissors";
      this.aim = [Paper, Lizard];
      this.color = "red";
    }
    drawEmoji() {
      this.ctx.save();
      this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      this.ctx.rotate(this.angle - Math.PI / 2);
      this.ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      this.ctx.fillText(this.emoji, this.x - 2, this.y + 16);
      this.ctx.restore();
    }
  }

  class Lizard extends Enemy {
    constructor({ x, y, game }) {
      super({ x, y, game });
      this.emoji = "🦎";
      this.team = "lizards";
      this.aim = [Spock, Paper];
      this.color = "green";
    }
    drawEmoji() {
      this.ctx.save();
      this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      this.ctx.rotate(this.angle + Math.PI / 1.5);
      this.ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      this.ctx.fillText(this.emoji, this.x - 2, this.y + 16);

      this.ctx.restore();
    }
  }

  class Spock extends Enemy {
    constructor({ x, y, game }) {
      super({ x, y, game });
      this.emoji = "🖖";
      this.team = "spocks";
      this.aim = [Rock, Scissors];
      this.color = "yellow";
    }
  }

  class Clock {
    constructor() {
      this.lastTime = Date.now();
      this.deltaTime = 0;
    }

    calculateFPS() {
      return 1000 / this.deltaTime;
    }

    update() {
      const now = Date.now();
      this.deltaTime = now - this.lastTime;
      this.lastTime = now;

      return this.deltaTime;
    }
  }

  class DebugDrawer {
    constructor({ canvasManager, clock, options }) {
      this.canvasManager = canvasManager;
      this.clock = clock;
      this.options = options;
      this.ctx = this.canvasManager.getCtx();
      this.fontSize = this.canvasManager.getFontSize50();
      this.position = this.canvasManager.getCanvasWidth() - 8 * this.fontSize;
    }

    #ctxSetup() {
      this.ctx.font = `${this.fontSize}px Arial`;
      this.ctx.fillStyle = "white";
    }

    draw() {
      this.fontSize = this.canvasManager.getFontSize50();
      this.position = this.canvasManager.getCanvasWidth() - 8 * this.fontSize;
      if (!this.options.effects.debug) return;
      this.ctx.save();
      this.#ctxSetup();
      this.ctx.fillText(`${Math.round(this.clock.calculateFPS())} FPS`, this.position, this.fontSize);
      this.ctx.fillText(`${this.clock.deltaTime} ms`, this.position, 2 * this.fontSize);
      this.ctx.fillText(
        `${this.canvasManager.getCanvasWidth()}x${this.canvasManager.getCanvasHeight()}`,
        this.position,
        3 * this.fontSize
      );
      this.ctx.fillText(`Timeless: ${this.options.mechanics.timeless}`, this.position, 4 * this.fontSize);
      this.ctx.fillText(`Capture: ${this.options.mechanics.capture}`, this.position, 5 * this.fontSize);
      this.ctx.fillText(`LimitCanvas: ${this.options.mechanics.limitCanvas}`, this.position, 6 * this.fontSize);
      this.ctx.fillText(`OutDies: ${this.options.mechanics.outDies}`, this.position, 7 * this.fontSize);
      this.ctx.fillText(`Blood: ${this.options.effects.blood}`, this.position, 8 * this.fontSize);
      this.ctx.fillText(`Snuff: ${this.options.effects.snuff}`, this.position, 9 * this.fontSize);
      this.ctx.fillText(`Dot: ${this.options.effects.dot}`, this.position, 10 * this.fontSize);
      this.ctx.restore();
    }
  }
  class RoundDrawer {
    constructor({ canvasManager, options }) {
      this.canvasManager = canvasManager;
      this.options = options;
      this.ctx = this.canvasManager.getCtx();
    }

    draw(time, m, lastWin) {
      this.fontSize = this.canvasManager.getFontSize50();
      this.ctx.save();
      this.ctx.fillStyle = time > 5000 ? (time > 15000 ? "green" : "yellow") : "red";
      this.ctx.font = `${this.fontSize}px Arial`;
      //center text
      this.ctx.textAlign = "center";
      const { x, y } = this.canvasManager.getCanvasCenter();
      lastWin && this.ctx.fillText(`Last: ${lastWin}`, x, y - 2 * this.fontSize);
      !this.options.mechanics.timeless && this.ctx.fillText(`${Math.round(time / 1000)}s`, x, y);
      this.ctx.fillText(`M${m}`, x, y + this.fontSize);
      this.ctx.restore();
    }
  }

  class Game {
    constructor() {
      this.options = new OptionsManager(gameOptions);
      this.canvasManager = new CanvasManager({ options: this.options });
      this.clock = new Clock();
      this.debugDrawer = new DebugDrawer({
        canvasManager: this.canvasManager,
        clock: this.clock,
        options: this.options
      });
      this.roundDrawer = new RoundDrawer({ canvasManager: this.canvasManager, options: this.options });
      this.ctx = this.canvasManager.getCtx();
      this.width = this.canvasManager.getCanvasWidth();
      this.height = this.canvasManager.getCanvasHeight();
      this.timeLeft = 10000;
      this.match = this.options.mechanics.startLevel;
      this.enemiesQty = Math.floor(this.match / 10) || 1;
      this.scoreManager = new ScoreManager();
      this.scoreDrawer = new ScoreDrawer({
        canvasManager: this.canvasManager,
        scoreManager: this.scoreManager
      });
      this.enemies = [];
      this.lastWin = null;
      this.particles = new ParticleManager({ game: this });
      this.eventHandler = new EventHandler();
      this.#restart();
    }

    #restart() {
      this.options.setMechanics("timeless", true);
      this.options.getLocalStorage();
      this.match++;
      this.enemiesQty = Math.floor(this.match / 10) || 1;
      if (this.match >= 50) {
        this.options.mechanics.capture = false;
      }
      if (this.match >= 100) {
        this.options.effects.snuff = false;
      }
      if (this.width < this.options.display.maxWidth) {
        const { width, height } = this.canvasManager.resize(1.003 * this.match);
        this.width = width;
        this.height = height;
      }

      this.timeLeft = 9000 + this.match * 1000 * 0.1;

      this.enemies = [];
      for (let i = 0; i < this.enemiesQty; i++) {
        [Rock, Paper, Scissors, Lizard, Spock].forEach(enemy => {
          this.enemies.push(new enemy({ game: this, x: null, y: null }));
        });
      }
    }

    #captureEnemy(killed) {
      if (killed.killedBy && killed.killedBy !== Enemy) {
        this.enemies.push(
          new killed.killedBy({
            ctx: this.ctx,
            x: killed.x,
            y: killed.y,
            game: this,
            angle: killed.angle
          })
        );
      }
    }

    update(deltaTime) {
      this.options.update();
      const alive = this.enemies.filter(enemy => !enemy.dead).map(enemy => enemy.team);
      const unique = [...new Set(alive)];
      if (unique.length <= 3) {
        this.options.setMechanics("timeless", false);
      }

      if (!this.options.mechanics.timeless) {
        this.timeLeft -= deltaTime;
      }

      if (unique.length === 1) {
        this.scoreManager.addScore(unique[0]);
        this.lastWin = unique[0];
        this.#restart();
      }

      if (this.timeLeft <= 0) {
        if (unique.length === 2) {
          const team1 = this.enemies.filter(enemy => enemy.team === unique[0]);
          const team2 = this.enemies.filter(enemy => enemy.team === unique[1]);
          if (team1[0].aim.includes(team2[0].constructor)) {
            this.scoreManager.addScore(unique[1]);
            this.lastWin = unique[1];
          }
          if (team2[0].aim.includes(team1[0].constructor)) {
            this.scoreManager.addScore(unique[0]);
            this.lastWin = unique[0];
          }
        } else {
          this.lastWin = "DRAW";
        }

        this.#restart();
      }

      const dead = this.enemies.filter(enemy => enemy.dead);
      for (const killed of dead) {
        this.options.mechanics.capture && this.#captureEnemy(killed);
        this.particles.collision(killed.x, killed.y);
      }
      this.enemies = this.enemies.filter(enemy => !enemy.dead);
      for (const enemy of this.enemies) {
        enemy.update(deltaTime, this.enemies);
      }
      this.particles.update(deltaTime);
    }
    draw() {
      this.roundDrawer.draw(this.timeLeft, this.match, this.lastWin);
      this.particles.draw();
      this.debugDrawer.draw();
      for (const enemy of this.enemies) {
        enemy.draw();
      }
      this.scoreDrawer.draw();
    }
    run() {
      this.canvasManager.clear();
      const deltaTime = this.clock.update();
      this.update(deltaTime);
      this.draw();
    }
  }

  class Particle {
    constructor({ ctx, x, y, game }) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.game = game;
      this.dead = false;
      this.vx = Math.random() * 0.5 - 0.25;
      this.vy = Math.random() * 0.5 - 0.25;
      this.life = 1000;
      this.opacity = 1;
      this.size = Math.random() * 5 + 5;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update(deltaTime) {
      this.x += this.vx * deltaTime;
      this.y += this.vy * deltaTime;
      this.life -= deltaTime;
      this.opacity = this.life / 1000;
      if (this.life <= 0 || this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height) {
        this.dead = true;
      }
    }

    draw() {
      this.ctx.save();
      this.ctx.globalAlpha = this.opacity;
      this.ctx.translate(this.x, this.y);
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
  class BloodParticles extends Particle {
    constructor({ ctx, x, y, game, life = 650, size = 2, color = "red" }) {
      super({ ctx, x, y, game });
      this.vx = Math.random() * 0.5 - 0.25;
      this.vy = Math.random() * 0.5 - 0.25;
      this.life = life;
      this.size = 2;
      this.color = "red";
    }
  }
  class ParticleManager {
    constructor({ game }) {
      this.game = game;
      this.ctx = this.game.canvasManager.getCtx();
      this.particles = [];
    }

    addParticle(particle) {
      this.particles.push(particle);
    }

    collision(x, y) {
      for (let i = 0; i < 10; i++) {
        this.game.options.effects.blood &&
          this.addParticle(
            new BloodParticles({
              ctx: this.ctx,
              x,
              y,
              game: this.game,
              life: this.game.options.effects.snuff ? 3000 : 1000
            })
          );
      }
    }

    update(deltaTime) {
      for (const particle of this.particles) {
        particle.update(deltaTime);
      }
      this.particles = this.particles.filter(particle => !particle.dead);
    }

    draw() {
      for (const particle of this.particles) {
        particle.draw();
      }
    }
  }

  const game = new Game();
  const animate = (timestamp = 0) => {
    game.run();
    requestAnimationFrame(animate);
  };

  animate();
});
