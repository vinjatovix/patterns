import {
  IdleLeftState,
  IdleRightState,
  JumpRight,
  JumpLeft,
  FallLeft,
  FallRight,
  RunLeft,
  RunRight,
  SittingLeft,
  SittingRight
} from "./State.js";

const playerImg = new Image();
playerImg.src = "../img/dog_left_right_white.png";

export default class Player {
  constructor({ game }) {
    this.gameWidth = game.width;
    this.gameHeight = game.height;
    this.states = {
      IDLE_LEFT: new IdleLeftState(this),
      IDLE_RIGHT: new IdleRightState(this),
      JUMP_LEFT: new JumpLeft(this),
      JUMP_RIGHT: new JumpRight(this),
      FALL_LEFT: new FallLeft(this),
      FALL_RIGHT: new FallRight(this),
      RUN_LEFT: new RunLeft(this),
      RUN_RIGHT: new RunRight(this),
      SITTING_LEFT: new SittingLeft(this),
      SITTING_RIGHT: new SittingRight(this)
    };
    this.currentState = this.states.IDLE_RIGHT;
    this.image = playerImg;
    this.width = 200;
    this.height = 181.83;
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height;
    this.frameX = 0;
    this.maxFrame = 6;
    this.fps = 30;
    this.fpsInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.frameY = 0;
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.gravity = 0.5;
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  onGround() {
    return this.y >= this.gameHeight - this.height;
  }

  update(input) {
    this.currentState.handleInput(input);
    this.x += this.speed;
    if (this.x < 0) this.x = 0;
    if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

    this.y += this.vy;

    if (this.onGround()) {
      this.y = this.gameHeight - this.height;
      this.vy = 0;
    } else {
      this.vy += this.gravity;
    }
  }

  draw(ctx, deltaTime) {
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.fpsInterval) {
      this.frameTimer = 0;
      this.frameX++;
      if (this.frameX > this.maxFrame) this.frameX = 0;
    }

    ctx.drawImage(
      this.image,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
