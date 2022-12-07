const { Creature, IncreaseDefenseModifier } = require("../../../../src/classes/creatures");

describe("Creature", () => {
  it("should create a new creature", () => {
    const creature = new Creature({
      name: "goblin",
      description: "a nasty little goblin"
    });

    expect(creature.getName()).toBe("goblin");
    expect(creature.getDescription()).toBe("a nasty little goblin");
    expect(creature.toString()).toMatch(/goblin/);
    expect(creature.toString()).toMatch(/Health: 100/);
    expect(creature.toString()).toMatch(/Damage: 10/);
    expect(creature.toString()).toMatch(/Defense: 0/);
    expect(creature.toJSON()).toMatchObject({
      description: "a nasty little goblin",
      health: 100,
      name: "goblin",
      defense: 0,
      damage: 10
    });
  });
  it("should create a new custom creature", () => {
    const creature = new Creature({
      name: "dragon",
      description: "a little big dragon",
      health: 1000,
      damage: 100,
      defense: 10
    });

    expect(creature.toJSON()).toMatchObject({
      description: "a little big dragon",
      health: 1000,
      name: "dragon",
      defense: 10,
      damage: 100
    });
  });

  it("should attack a target", () => {
    const creature = new Creature({
      name: "goblin",
      description: "a nasty little goblin"
    });
    const target = new Creature({
      name: "orc",
      description: "a nasty little orc"
    });

    creature.attack(target);

    expect(target.health).toBe(90);
  });

  it("should attack a target with modified defense", () => {
    const creature = new Creature({
      name: "goblin",
      description: "a nasty little goblin"
    });
    const target = new Creature({
      name: "orc",
      description: "a nasty little orc"
    });

    target.booster.add(new IncreaseDefenseModifier(target));
    target.booster.add(new IncreaseDefenseModifier(target));
    target.booster.handle();

    creature.attack(target);

    expect(target.health).toBe(96);
  });
});
