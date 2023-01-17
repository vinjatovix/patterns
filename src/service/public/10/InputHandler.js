export default class InputHandler {
  constructor({ game }) {
    this.game = game;
    this.availableKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "];
    this.toggleKeys = ["d"];
    this.keys = {};
    this.toggleKeys.forEach(key => {
      this.keys[key] = false;
    });

    window.addEventListener("keydown", e => {
      if (this.availableKeys.includes(e.key)) {
        this.keys[e.key] = true;
      }
    });
    window.addEventListener("keyup", e => {
      if (this.availableKeys.includes(e.key)) {
        this.keys[e.key] = false;
      }
    });

    window.addEventListener("keydown", e => {
      if (this.toggleKeys.includes(e.key)) {
        this.keys[e.key] = !this.keys[e.key];
      }
    });
  }
}
