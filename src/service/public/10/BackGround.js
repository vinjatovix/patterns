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

class BackGround {
  constructor({ game }) {
    this.game = game;
    this.width = 2400;
    this.height = 700;
    this.groundMargin = 0;
    this.bgLayers = [];
  }

  update() {
    this.bgLayers.forEach(layer => layer.update());
  }

  draw(ctx) {
    this.bgLayers.forEach(layer => layer.draw(ctx));
  }
}

const cityLayer1 = new Image();
cityLayer1.src = "../img/layer-1.png";
const cityLayer2 = new Image();
cityLayer2.src = "../img/layer-2.png";
const cityLayer3 = new Image();
cityLayer3.src = "../img/layer-3.png";
const cityLayer4 = new Image();
cityLayer4.src = "../img/layer-4.png";
const cityLayer5 = new Image();
cityLayer5.src = "../img/layer-5.png";

class City extends BackGround {
  constructor({ game }) {
    super({ game });
    this.name = "city";
    this.groundMargin = 115;
    this.sky = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0,
      image: cityLayer1
    });
    this.buildings = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.2,
      image: cityLayer2
    });
    this.clouds = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.4,
      image: cityLayer3
    });
    this.totoros = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.6,
      image: cityLayer4
    });
    this.tiles = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 2,
      image: cityLayer5
    });

    this.bgLayers = [this.sky, this.buildings, this.clouds, this.totoros, this.tiles];
  }
}

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

class Forest extends BackGround {
  constructor({ game }) {
    super({ game });
    this.name = "forest";
    this.groundMargin = 50;
    this.far = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0,
      image: forestLayer1
    });
    this.medium = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.2,
      image: forestLayer2
    });
    this.trees = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.4,
      image: forestLayer3
    });
    this.leaves = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 0.6,
      image: forestLayer4
    });
    this.ground = new Layer({
      game,
      width: this.width,
      height: this.height,
      speedModifier: 2,
      image: forestLayer5
    });

    this.bgLayers = [this.far, this.medium, this.trees, this.leaves, this.ground];
  }
}

export class BackGroundFactory {
  static createBackGround({ game, type }) {
    switch (type) {
      case "city":
        return new City({ game });
      case "forest":
        return new Forest({ game });
      default:
        return new City({ game });
    }
  }
}
