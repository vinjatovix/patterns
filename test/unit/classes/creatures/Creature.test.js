const { Creature } = require("../../../../src/classes/creatures");
const Game = require("../../../../src/classes/events/Game");

describe("Creature", () => {
  it("should create a new creature", () => {
    const game = new Game();
    const creature = new Creature({
      game,
      name: "goblin",
      description: "a nasty little goblin",
      health: 100,
      damage: 10,
      defense: 0
    });

    expect(creature.name).toBe("goblin");
    expect(creature.description).toBe("a nasty little goblin");
    expect(creature.health).toBe(100);
    expect(creature.damage).toBe(10);
    expect(creature.defense).toBe(0);
    expect(creature.toJSON()).toMatchObject({
      name: "goblin",
      description: "a nasty little goblin",
      health: 100,
      damage: 10,
      defense: 0
    });
  });
});
