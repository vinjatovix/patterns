const { Entity } = require("../common");
const { CreatureModifier } = require("./CreatureModifiers");

class Creature extends Entity {
  constructor({ name, description, health = 100, damage = 10, defense = 0 }) {
    super(name, description);
    this.health = health;
    this.damage = damage;
    this.defense = defense;
    this.booster = new CreatureModifier(this);
  }
  attack(target) {
    target.health -= this.damage - target.defense;
  }

  toString() {
    return `${super.toString()} - Health: ${this.health} - Damage: ${this.damage} - Defense: ${this.defense}`;
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

module.exports = Creature;
