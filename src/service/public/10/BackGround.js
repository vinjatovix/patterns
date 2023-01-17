const backgroundLayer1 = new Image();
backgroundLayer1.src = "../img/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "../img/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "../img/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "../img/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "../img/layer-5.png";

const forestLayer1 = new Image();
forestLayer1.src = "../img/forest_layer-1.png";
const forestLayer2 = new Image();
forestLayer2.src = "../img/forest_layer-2.png";
const forestLayer3 = new Image();
forestLayer3.src = "../img/forest_layer-3.png";
const forestLayer4 = new Image();
forestLayer4.src = "../img/forest_layer-4.png";
const forestLayer5 = new Image();
forestLayer5.src = "../img/forest_layer-5.png";

class Layer {
  constructor({ game, width, height, speedModifier, image }) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }

  update() {
    if (this.x < -this.width) {
      this.x = 0;
    } else {
      this.x -= this.game.speed * this.speedModifier;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
}

export class City {
  constructor({ game }) {
    this.name = "city";
    this.game = game;
    this.width = 2400;
    this.height = 700;
    this.sky = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0,
      image: backgroundLayer1
    });
    this.buildings = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.2,
      image: backgroundLayer2
    });
    this.clouds = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.4,
      image: backgroundLayer3
    });
    this.totoros = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.6,
      image: backgroundLayer4
    });
    this.tiles = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 2,
      image: backgroundLayer5
    });

    this.bgLayers = [this.sky, this.buildings, this.clouds, this.totoros, this.tiles];
  }

  update() {
    this.bgLayers.forEach(layer => layer.update());
  }

  draw(ctx) {
    this.bgLayers.forEach(layer => layer.draw(ctx));
  }
}

export class Forest {
  constructor({ game }) {
    this.game = game;
    this.width = 2400;
    this.height = 700;
    this.sky = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0,
      image: forestLayer1
    });
    this.buildings = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.2,
      image: forestLayer2
    });
    this.clouds = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.4,
      image: forestLayer3
    });
    this.totoros = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.6,
      image: forestLayer4
    });
    this.tiles = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 2,
      image: forestLayer5
    });

    this.bgLayers = [this.sky, this.buildings, this.clouds, this.totoros, this.tiles];
  }

  update() {
    this.bgLayers.forEach(layer => layer.update());
  }

  draw(ctx) {
    this.bgLayers.forEach(layer => layer.draw(ctx));
  }
}
