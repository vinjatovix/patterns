export const states = Object.freeze({
  IDLE_RIGHT: "IDLE_RIGHT",
  IDLE_LEFT: "IDLE_LEFT",
  JUMP_RIGHT: "JUMP_RIGHT",
  JUMP_LEFT: "JUMP_LEFT",
  FALL_RIGHT: "FALL_RIGHT",
  FALL_LEFT: "FALL_LEFT",
  RUN_RIGHT: "RUN_RIGHT",
  RUN_LEFT: "RUN_LEFT",
  SITTING_RIGHT: "SITTING_RIGHT",
  SITTING_LEFT: "SITTING_LEFT"
});

class State {
  constructor(state) {
    this.state = state;
  }
}

export class IdleRightState extends State {
  constructor(player) {
    super(states.IDLE_RIGHT);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 0;
    this.player.speed = 0;
  }
  handleInput(input) {
    if (input === "PRESS_ArrowRight") this.player.setState(states.RUN_RIGHT);
    if (input === "PRESS_ArrowLeft") this.player.setState(states.RUN_LEFT);
    if (input === "PRESS_ArrowDown") this.player.setState(states.SITTING_RIGHT);
    if (input === "PRESS_ArrowUp") this.player.setState(states.JUMP_RIGHT);
  }
}

export class IdleLeftState extends State {
  constructor(player) {
    super(states.IDLE_LEFT);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 1;
    this.player.speed = 0;
  }
  handleInput(input) {
    if (input === "PRESS_ArrowRight") this.player.setState(states.RUN_RIGHT);
    if (input === "PRESS_ArrowLeft") this.player.setState(states.RUN_LEFT);
    if (input === "PRESS_ArrowDown") this.player.setState(states.SITTING_LEFT);
    if (input === "PRESS_ArrowUp") this.player.setState(states.JUMP_LEFT);
  }
}

export class JumpRight extends State {
  constructor(player) {
    super(states.JUMP_RIGHT);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 2;
    if (this.player.onGround()) this.player.vy = -20;
    this.player.speed = this.player.maxSpeed * 0.5;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowLeft") this.player.setState(states.JUMP_LEFT);
    if (this.player.onGround()) this.player.setState(states.IDLE_RIGHT);
    if (this.player.vy > 0) this.player.setState(states.FALL_RIGHT);
    if (input === "PRESS_ArrowRight") this.player.setState(states.JUMP_RIGHT);
  }
}

export class JumpLeft extends State {
  constructor(player) {
    super(states.JUMP_LEFT);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 3;
    if (this.player.onGround()) this.player.vy = -20;
    this.player.speed = -this.player.maxSpeed * 0.5;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowLeft") this.player.setState(states.JUMP_LEFT);
    if (this.player.onGround()) this.player.setState(states.IDLE_LEFT);
    if (this.player.vy > 0) this.player.setState(states.FALL_LEFT);
    if (input === "PRESS_ArrowRight") this.player.setState(states.JUMP_RIGHT);
  }
}

export class FallRight extends State {
  constructor(player) {
    super(states.FALL_RIGHT);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 4;
    this.player.speed = this.player.maxSpeed * 0.5;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowLeft") this.player.setState(states.FALL_LEFT);
    if (this.player.onGround()) this.player.setState(states.IDLE_RIGHT);
    if (input === "PRESS_ArrowRight") this.player.setState(states.FALL_RIGHT);
  }
}

export class FallLeft extends State {
  constructor(player) {
    super(states.FALL_LEFT);
    this.player = player;
  }
  enter() {
    this.player.maxFrame = 6;
    this.player.frameY = 5;
    this.player.speed = -this.player.maxSpeed * 0.5;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowLeft") this.player.setState(states.FALL_LEFT);
    if (this.player.onGround()) this.player.setState(states.IDLE_LEFT);
    if (input === "PRESS_ArrowRight") this.player.setState(states.FALL_RIGHT);
  }
}

export class RunRight extends State {
  constructor(player) {
    super(states.RUN_RIGHT);
    this.player = player;
  }

  enter() {
    this.player.maxFrame = 8;
    this.player.frameY = 6;
    this.player.speed = this.player.maxSpeed;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowLeft") this.player.setState(states.RUN_LEFT);
    if (input === "RELEASE_ArrowRight") this.player.setState(states.IDLE_RIGHT);
    if (input === "PRESS_ArrowDown") this.player.setState(states.SITTING_RIGHT);
    if (input === "PRESS_ArrowUp") this.player.setState(states.JUMP_RIGHT);
  }
}

export class RunLeft extends State {
  constructor(player) {
    super(states.RUN_LEFT);
    this.player = player;
  }

  enter() {
    this.player.maxFrame = 8;
    this.player.frameY = 7;
    this.player.speed = -this.player.maxSpeed;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowRight") this.player.setState(states.RUN_RIGHT);
    if (input === "RELEASE_ArrowLeft") this.player.setState(states.IDLE_LEFT);
    if (input === "PRESS_ArrowDown") this.player.setState(states.SITTING_LEFT);
    if (input === "PRESS_ArrowUp") this.player.setState(states.JUMP_LEFT);
  }
}

export class SittingRight extends State {
  constructor(player) {
    super(states.SITTING_RIGHT);
    this.player = player;
  }

  enter() {
    this.player.maxFrame = 4;
    this.player.frameY = 8;
    this.player.speed = 0;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowLeft") this.player.setState(states.SITTING_LEFT);
    else if (input === "PRESS_ArrowRight") this.player.setState(states.RUN_RIGHT);
    else if (input === "PRESS_ArrowUp") this.player.setState(states.IDLE_RIGHT);
    else if (input === "RELEASE_ArrowDown") this.player.setState(states.IDLE_RIGHT);
  }
}

export class SittingLeft extends State {
  constructor(player) {
    super(states.SITTING_LEFT);
    this.player = player;
  }

  enter() {
    this.player.maxFrame = 4;
    this.player.frameY = 9;
    this.player.speed = 0;
  }

  handleInput(input) {
    if (input === "PRESS_ArrowRight") this.player.setState(states.SITTING_RIGHT);
    else if (input === "PRESS_ArrowLeft") this.player.setState(states.RUN_LEFT);
    else if (input === "PRESS_ArrowUp") this.player.setState(states.IDLE_LEFT);
    else if (input === "RELEASE_ArrowDown") this.player.setState(states.IDLE_LEFT);
  }
}
