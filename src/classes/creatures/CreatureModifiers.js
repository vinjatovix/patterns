class CreatureModifier {
  constructor(creature) {
    this.creature = creature;
    this.next = null;
  }
  add(modifier) {
    if (this.next) {
      this.next.add(modifier);
    } else {
      this.next = modifier;
    }
  }
  handle() {
    if (this.next) {
      this.next.handle();
    }
  }
}

class DoubleAttackModifier extends CreatureModifier {
  handle() {
    this.creature.damage *= 2;
    super.handle();
  }
}

class IncreaseDefenseModifier extends CreatureModifier {
  handle() {
    this.creature.defense += 3;
    super.handle();
  }
}

module.exports = {
  CreatureModifier,
  DoubleAttackModifier,
  IncreaseDefenseModifier
};
