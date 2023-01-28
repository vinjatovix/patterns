import { SpriteManager } from "../common/sprites/SpriteManager.js";
import { SitState, RunState, JumpState, FallState, RollState, DiveState, HitState } from "./PlayerStates.js";

const playerImage = new Image();
playerImage.src = "../img/shadow_dog_small.png";

export default class Player {
  constructor(game) {
    this.game = game;
    this.image = playerImage;
    this.width = 100;
    this.height = 91.3;
    this.x = 200;
    this.y = this.game.height - this.height - this.game.backGround.groundMargin;
    this.spriteManager = new SpriteManager({
      image: this.image,
      width: this.width,
      height: this.height,
      maxFrameX: 5,
      fps: 20
    });
    this.vx = 0;
    this.maxVx = 20;
    this.vy = 0;
    this.gravity = 1;
    this.states = {
      SIT: new SitState(this),
      RUN: new RunState(this),
      JUMP: new JumpState(this),
      FALL: new FallState(this),
      ROLL: new RollState(this),
      DIVE: new DiveState(this),
      HIT: new HitState(this)
    };
    this.currentState = this.states.SIT;
    this.currentState.enter();
    this.lives = 5;
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.currentState.enter();
    this.game.speed = this.game.maxSpeed * speed;
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.backGround.groundMargin;
  }
  #limitX() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }
  }

  #limitY() {
    if (this.y >= this.game.height - this.height - this.game.backGround.groundMargin) {
      this.y = this.game.height - this.height - this.game.backGround.groundMargin;
    }
  }

  updateX(keys) {
    if (keys.ArrowLeft) {
      this.vx = -this.maxVx;
    } else if (keys.ArrowRight) {
      this.vx = this.maxVx;
    } else {
      this.vx = 0;
    }
    this.#limitX();
  }

  updateY(keys) {
    if (!this.onGround()) {
      this.vy += this.gravity;
    } else {
      this.vy = 0;
    }
    this.#limitY();
  }

  update({ deltaTime, keys }) {
    this.currentState.handleInput(keys);
    if (this.currentState.state !== "HIT") {
      this.x += this.vx;
      this.updateX(keys);
    }
    this.y += this.vy;
    this.updateY(keys);
    this.spriteManager.update(deltaTime);
    this.checkCollision();
  }

  checkCollision(ctx) {
    this.game.enemies.forEach(spawn => {
      spawn.entities.some(enemy => enemy.checkCollision(this));
    });
  }

  draw(ctx) {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.spriteManager.draw(ctx, this.x, this.y);
  }
}
