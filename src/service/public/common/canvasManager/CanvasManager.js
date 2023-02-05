export class CanvasManager {
  constructor({ canvasCollection }) {
    for (const canvas in canvasCollection) {
      this[canvas] = canvasCollection[canvas];
      this[canvas].ctx = this[canvas].getContext("2d");
    }
  }
  set2DCanvas({ canvas, width, height }) {
    this[canvas].width = width;
    this[canvas].height = height;
    this[canvas].ctx = this[canvas].getContext("2d");
  }

  getCenter(canvas) {
    return {
      x: this[canvas].width * 0.5,
      y: this[canvas].height * 0.5
    };
  }

  clear(canvas) {
    this[canvas].ctx.clearRect(0, 0, this[canvas].width, this[canvas].height);
  }

  getCtx(canvas) {
    return this[canvas].ctx;
  }
}
