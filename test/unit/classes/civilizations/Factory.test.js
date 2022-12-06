const { CivilizationFactory } = require("../../../../src/classes/civilizations");

describe("Factory", () => {
  it("should create a new Farmer civilization", () => {
    const farmer = CivilizationFactory.create("farmer");

    expect(farmer.toJSON()).toMatchObject({
      description: "Farmer description",
      name: "Farmer",
      resources: {
        credits: {
          description: "Can't buy happiness, but you can buy stuff",
          max: 1000,
          name: "credits",
          qty: 0,
          volume: 0
        },
        food: {
          description: "Not tasty, but it keeps you alive",
          max: 2000,
          name: "food",
          qty: 300,
          volume: 0.15
        },
        mineral: {
          description: "Can be used to build stuff",
          max: 100,
          name: "mineral",
          qty: 0,
          volume: 0
        }
      }
    });
  });

  it("should create a new Miner civilization", () => {
    const miner = CivilizationFactory.create("miner");

    expect(miner.toJSON()).toMatchObject({
      description: "Miner description",
      name: "Miner",
      resources: {
        credits: {
          description: "Can't buy happiness, but you can buy stuff",
          max: 1000,
          name: "credits",
          qty: 0,
          volume: 0
        },
        food: {
          description: "Not tasty, but it keeps you alive",
          max: 100,
          name: "food",
          qty: 0,
          volume: 0
        },
        mineral: {
          description: "Can be used to build stuff",
          max: 2000,
          name: "mineral",
          qty: 300,
          volume: 0.15
        }
      }
    });
  });

  it("should create a new Enemy civilization", () => {
    const enemy = CivilizationFactory.create("enemy");

    expect(enemy.toJSON()).toMatchObject({
      description: "Enemy description",
      name: "Enemy",
      resources: {
        credits: {
          description: "Can't buy happiness, but you can buy stuff",
          max: 1000,
          name: "credits",
          qty: 1000,
          volume: 1
        }
      }
    });
  });

  it("should create a new Random civilization", () => {
    const random = CivilizationFactory.create();

    expect(random.toJSON()).toMatchObject({
      description: expect.any(String),
      name: expect.any(String),
      resources: {
        credits: {
          description: "Can't buy happiness, but you can buy stuff",
          max: 2000,
          name: "credits",
          qty: 900,
          volume: 0.45
        },
        food: {
          description: "Not tasty, but it keeps you alive",
          max: 2000,
          name: "food",
          qty: 900,
          volume: 0.45
        },
        mineral: {
          description: "Can be used to build stuff",
          max: 2000,
          name: "mineral",
          qty: 900,
          volume: 0.45
        }
      }
    });
  });

  it("should create a new Custom civilization", () => {
    const custom = CivilizationFactory.create("custom", {
      name: "Custom",
      description: "Custom description"
    });

    expect(custom.toJSON()).toMatchObject({
      description: "Custom description",
      name: "Custom",
      resources: {
        credits: {
          description: "Can't buy happiness, but you can buy stuff",
          max: 2000,
          name: "credits",
          qty: 900,
          volume: 0.45
        },
        food: {
          description: "Not tasty, but it keeps you alive",
          max: 2000,
          name: "food",
          qty: 900,
          volume: 0.45
        },
        mineral: {
          description: "Can be used to build stuff",
          max: 2000,
          name: "mineral",
          qty: 900,
          volume: 0.45
        }
      }
    });
  });

  it("should fail to create a new custom civilization because no name was provided", () => {
    expect(() => {
      CivilizationFactory.create("custom", {
        description: "Custom description"
      });
    }).toThrowError("name is required");
  });

  it("should fail to create a new custom civilization because no description was provided", () => {
    expect(() => {
      CivilizationFactory.create("custom", {
        name: "Custom"
      });
    }).toThrowError("description is required");
  });

  it("should fail to create a new civilization because type is not found", () => {
    expect(() => {
      CivilizationFactory.create("spacial");
    }).toThrowError("Civilization type spacial not found");
  });
});
