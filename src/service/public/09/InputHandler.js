export default class Input {
  constructor() {
    this.availableKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    this.lastKey = "";
    window.addEventListener("keydown", e => {
      if (this.availableKeys.includes(e.key)) {
        this.lastKey = `PRESS_${e.key}`;
      }
    });
    window.addEventListener("keyup", e => {
      if (this.availableKeys.includes(e.key)) {
        this.lastKey = `RELEASE_${e.key}`;
      }
    });
  }
}
