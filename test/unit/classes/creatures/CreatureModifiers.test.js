const {
  Creature,
  CreatureModifier,
  DoubleAttackModifier,
  IncreaseDefenseModifier
} = require("../../../../src/classes/creatures");

describe("CreatureModifiers", () => {
  it("should create a new creature modifier", () => {
    const creature = new Creature({
      name: "goblin",
      description: "a nasty little goblin",
      health: 100,
      damage: 10,
      defense: 0
    });
    const modifier = new CreatureModifier(creature);

    expect(modifier.creature).toBe(creature);
  });

  it("should double attack", () => {
    const creature = new Creature({
      name: "goblin",
      description: "a nasty little goblin",
      health: 100,
      damage: 10,
      defense: 0
    });
    const modifier = new DoubleAttackModifier(creature);

    modifier.handle();

    expect(creature.damage).toBe(20);
  });

  it("should increase defense", () => {
    const creature = new Creature({
      name: "goblin",
      description: "a nasty little goblin",
      health: 100,
      damage: 10,
      defense: 0
    });
    const modifier = new IncreaseDefenseModifier(creature);

    modifier.handle();

    expect(creature.defense).toBe(3);
  });
});
