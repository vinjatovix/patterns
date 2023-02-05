export class Controls {
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.lastDirection = "down";
    this.debug = false;
    this.#addKeyListeners();
  }

  #addKeyListeners() {
    document.onkeydown = ({ key }) => {
      if (key === "ArrowUp") {
        this.up = true;
        this.lastDirection = "up";
      }
      if (key === "ArrowDown") {
        this.down = true;
        this.lastDirection = "down";
      }
      if (key === "ArrowLeft") {
        this.left = true;
        this.lastDirection = "left";
      }
      if (key === "ArrowRight") {
        this.right = true;
        this.lastDirection = "right";
      }
      if (key === "d") {
        this.debug = !this.debug;
      }
    };

    document.onkeyup = e => {
      if (e.key === "ArrowUp") {
        this.up = false;
      }
      if (e.key === "ArrowDown") {
        this.down = false;
      }
      if (e.key === "ArrowLeft") {
        this.left = false;
      }
      if (e.key === "ArrowRight") {
        this.right = false;
      }
    };
  }
}
