export class SpawnManager {
  constructor({ type, game, spawnInterval = 4000, options = {} }) {
    this.type = type;
    this.game = game;
    this.spawnInterval = spawnInterval;
    this.spawnTimer = 0;
    this.entities = [];
    this.spawnOnStop = options["spawnOnStop"] || false;
    this.probability = options["prob"] || 1;
  }
  update(deltaTime) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.#add();
      this.spawnTimer = 0;
    }
    this.entities.forEach(entity => entity.update(deltaTime));
    this.entities = this.entities.filter(entity => !entity.offScreen).sort((a, b) => a.size - b.size);
  }

  draw(ctx) {
    this.entities.forEach(entity => entity.draw(ctx));
  }
  #add() {
    if (!this.game.speed && !this.spawnOnStop) return;
    if (Math.random() > this.probability) return;
    this.entities.push(new this.type({ game: this.game }));
  }
}
