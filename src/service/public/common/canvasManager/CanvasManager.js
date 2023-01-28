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
}
