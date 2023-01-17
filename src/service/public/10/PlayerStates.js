const states = {
  SIT: "SIT",
  RUN: "RUN",
  JUMP: "JUMP",
  FALL: "FALL",
  ROLL: "ROLL",
  DIVE: "DIVE",
  HIT: "HIT"
};

class State {
  constructor(state) {
    this.state = state;
  }

  enter() {
    // abstract
  }

  handleInput(keys) {
    // abstract
  }
}

export class SitState extends State {
  constructor(player) {
    super(states.SIT);
    this.player = player;
  }

  enter() {
    this.player.spriteManager.frameX = 0;
    this.player.spriteManager.maxFrameX = 4;
    this.player.spriteManager.frameY = 5;
  }

  handleInput(keys) {
    if (keys.ArrowLeft || keys.ArrowRight) {
      this.player.setState(states.RUN, 1);
    } else if (keys.ArrowUp) {
      this.player.setState(states.JUMP, 1);
    } else if (keys[" "]) {
      this.player.setState(states.ROLL, 2);
    }
  }
}

export class RunState extends State {
  constructor(player) {
    super(states.RUN);
    this.player = player;
  }

  enter() {
    this.player.spriteManager.frameX = 0;
    this.player.spriteManager.maxFrameX = 8;
    this.player.spriteManager.frameY = 3;
  }

  handleInput(keys) {
    Math.random() > 0.5 &&
      this.player.game.particles.dust(this.player.x + this.player.width * 0.5, this.player.y + this.player.height);
    if (keys.ArrowDown) {
      this.player.setState(states.SIT, 0);
    } else if (keys.ArrowUp) {
      this.player.setState(states.JUMP, 1);
    } else if (keys[" "]) {
      this.player.setState(states.ROLL, 2);
    }
  }
}

export class JumpState extends State {
  constructor(player) {
    super(states.JUMP);
    this.player = player;
  }

  enter() {
    this.player.spriteManager.frameX = 0;
    this.player.spriteManager.maxFrameX = 6;
    this.player.spriteManager.frameY = 1;
    if (this.player.onGround()) {
      this.player.vy = -30;
    }
  }

  handleInput(keys) {
    if (this.player.vy > 0) {
      this.player.setState(states.FALL, 1);
    } else if (keys[" "]) {
      this.player.setState(states.ROLL, 2);
    } else if (keys.ArrowDown) {
      this.player.setState(states.DIVE, 0);
    }
  }
}

export class FallState extends State {
  constructor(player) {
    super(states.FALL);
    this.player = player;
  }

  enter() {
    this.player.spriteManager.frameX = 0;
    this.player.spriteManager.maxFrameX = 6;
    this.player.spriteManager.frameY = 2;
  }

  handleInput(keys) {
    if (this.player.onGround()) {
      this.player.setState(states.RUN, 1);
    } else if (keys.ArrowDown) {
      this.player.setState(states.DIVE, 0);
    }
  }
}

export class RollState extends State {
  constructor(player) {
    super(states.ROLL);
    this.player = player;
  }

  enter() {
    this.player.spriteManager.frameX = 0;
    this.player.spriteManager.maxFrameX = 6;
    this.player.spriteManager.frameY = 6;
  }

  handleInput(keys) {
    this.player.game.particles.fire(
      this.player.x + this.player.width * 0.5 + 20,
      this.player.y + this.player.height - 35
    );

    if (!keys[" "] && this.player.onGround()) {
      this.player.setState(states.RUN, 1);
    } else if (!keys[" "] && !this.player.onGround()) {
      this.player.setState(states.FALL, 1);
    } else if (keys[" "] && keys.ArrowUp && this.player.onGround()) {
      this.player.vy = -27;
    } else if (keys.ArrowDown && !this.player.onGround()) {
      this.player.setState(states.DIVE, 0);
    }
  }
}

export class DiveState extends State {
  constructor(player) {
    super(states.DIVE);
    this.player = player;
  }

  enter() {
    this.player.spriteManager.frameX = 0;
    this.player.spriteManager.maxFrameX = 6;
    this.player.spriteManager.frameY = 6;
    this.player.vy = 25;
  }

  handleInput(keys) {
    this.player.game.particles.fire(
      this.player.x + this.player.width * 0.5 + 20,
      this.player.y + this.player.height - 25
    );

    if (this.player.onGround()) {
      this.player.setState(states.RUN, 1);
      this.player.game.particles.splashFire(this.player.x, this.player.y);
    } else if (keys[" "] && this.player.onGround()) {
      this.player.setState(states.ROLL, 2);
    }
  }
}

export class HitState extends State {
  constructor(player) {
    super(states.HIT);
    this.player = player;
  }

  enter() {
    this.player.spriteManager.frameX = 0;
    this.player.spriteManager.maxFrameX = 10;
    this.player.spriteManager.frameY = 4;
    this.player.lives--;
  }

  handleInput(keys) {
    if (this.player.spriteManager.frameX === 9) {
      if (this.player.onGround()) {
        this.player.setState(states.RUN, 1);
      } else {
        this.player.setState(states.FALL, 1);
      }
    }
  }
}
