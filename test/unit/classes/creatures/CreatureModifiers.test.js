const { Creature } = require("../../../../src/classes/creatures");
const Game = require("../../../../src/classes/events/Game");
const {
  DoubleAttackModifier,
  IncreaseDefenseModifier,
  IncreaseHealthModifier
} = require("../../../../src/classes/creatures/CreatureModifiers");

const DEFAULT_CREATURE = {
  name: "goblin",
  description: "a nasty little goblin",
  health: 100,
  damage: 10,
  defense: 0
};

describe("CreatureModifiers", () => {
  it("should double attack", () => {
    const game = new Game();
    const creature = new Creature({
      game,
      ...DEFAULT_CREATURE
    });

    const dam = new DoubleAttackModifier(game, creature);

    expect(creature.damage).toBe(20);
    dam.dispose();
    expect(creature.damage).toBe(10);
  });

  it("should increase defense", () => {
    const game = new Game();
    const creature = new Creature({
      game,
      ...DEFAULT_CREATURE
    });

    const idm = new IncreaseDefenseModifier(game, creature);

    expect(creature.defense).toBe(3);
    idm.dispose();
    expect(creature.defense).toBe(0);
  });

  it("should increase health", () => {
    const game = new Game();
    const creature = new Creature({
      game,
      ...DEFAULT_CREATURE
    });

    const ihm = new IncreaseHealthModifier(game, creature);

    expect(creature.health).toBe(200);
    ihm.dispose();
    expect(creature.health).toBe(100);
  });

  it("should increase health and defense", () => {
    const game = new Game();
    const creature = new Creature({
      game,
      ...DEFAULT_CREATURE
    });
    const ihm = new IncreaseHealthModifier(game, creature);
    const idm = new IncreaseDefenseModifier(game, creature);

    expect(creature.health).toBe(200);
    expect(creature.defense).toBe(3);
    ihm.dispose();
    expect(creature.health).toBe(100);
    idm.dispose();
    expect(creature.defense).toBe(0);
  });
});
