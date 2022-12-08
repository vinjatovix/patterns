const { Entity, Query } = require("../common");

const whatToQuery = Object.freeze({
  damage: "damage",
  defense: "defense",
  health: "health"
});

class Creature extends Entity {
  constructor({ game, name, description, health = 100, damage = 10, defense = 0 }) {
    super(name, description);
    this.game = game;
    this.initialHealth = health;
    this.initialDamage = damage;
    this.initialDefense = defense;
  }

  get health() {
    const q = new Query(this.getName(), whatToQuery.health, this.initialHealth);
    this.game.performQuery(this, q);
    return q.result;
  }

  get damage() {
    const q = new Query(this.getName(), whatToQuery.damage, this.initialDamage);
    this.game.performQuery(this, q);
    return q.result;
  }

  get defense() {
    const q = new Query(this.getName(), whatToQuery.defense, this.initialDefense);
    this.game.performQuery(this, q);
    return q.result;
  }

  toString() {
    return `${this.getName()} (${this.health}/${this.damage}/${this.defense})`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      health: this.health,
      damage: this.damage,
      defense: this.defense
    };
  }
}

module.exports = { Creature, whatToQuery };
