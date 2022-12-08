const { whatToQuery } = require("./Creature");

class CreatureModifier {
  constructor(game, creature) {
    this.game = game;
    this.creature = creature;
    this.token = this.game.queries.subscribe(this.handle.bind(this));
  }
  handle(sender, query) {
    // implement in subclasses
  }
  dispose() {
    this.game.queries.unsubscribe(this.token);
  }
}

class DoubleAttackModifier extends CreatureModifier {
  handle(sender, query) {
    if (query.name === this.creature.getName() && query.whatToQuery === whatToQuery.damage) {
      query.result *= 2;
    }
  }
}

class IncreaseDefenseModifier extends CreatureModifier {
  handle(sender, query) {
    if (query.name === this.creature.getName() && query.whatToQuery === whatToQuery.defense) {
      query.result += 3;
    }
  }
}

class IncreaseHealthModifier extends CreatureModifier {
  handle(sender, query) {
    if (query.name === this.creature.getName() && query.whatToQuery === whatToQuery.health) {
      query.result += 100;
    }
  }
}

module.exports = { CreatureModifier, DoubleAttackModifier, IncreaseDefenseModifier, IncreaseHealthModifier };
