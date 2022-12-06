const { PropHandler, random } = require("../../../../src/classes/common");

describe("PropHandler - module", () => {
  it("should be an instance of PropHandler", () => {
    expect(
      new PropHandler({
        key: "resources",
        parent: {}
      })
    ).toBeInstanceOf(PropHandler);
  });
  it("should return true if the resource is available", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    try {
      resources.checkAvailability("food");
    } catch (error) {
      expect(error.message).toBe("resources: food does not exist");
    }
  });
  // add instances of food and mineral
  it("should add food and minerals to the handler", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };
    const mineral = { name: "mineral", description: "mineral", qty: 50, max: 100 };

    resources.newInstances([food, mineral]);

    expect(resources.toJSON()).toMatchObject({
      food: { ...food, volume: 0 },
      mineral: { ...mineral, volume: 0.5 }
    });
  });

  // should modify the qty of food and mineral
  it("should modify the qty of food and mineral", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };
    const mineral = { name: "mineral", description: "mineral", qty: 50, max: 100 };

    resources.newInstances([food, mineral]);
    resources.add("food", 10);
    resources.remove("mineral", 10);

    expect(resources.getQty("food")).toBe(10);
    expect(resources.getQty("mineral")).toBe(40);
    expect(resources.getPercentage("food")).toBe(0.1);
    expect(resources.getPercentage("mineral")).toBe(0.4);
  });
  // should modify the max of food
  it("should modify the max of food", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };

    resources.newInstance(food);
    resources.setMax("food", 200);

    expect(resources.getMax("food")).toBe(200);
  });

  // should return the instances list
  it("should return the instances list", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };
    const mineral = { name: "mineral", description: "mineral", qty: 50, max: 100 };

    resources.newInstances([food, mineral]);

    expect(resources.getInstancesList()).toMatchObject(["food", "mineral"]);
  });

  it("should return the string representation of the handler", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };
    const mineral = { name: "mineral", description: "mineral", qty: 50, max: 100 };

    resources.newInstances([food, mineral]);

    expect(resources.toString()).toMatch(
      `ID:${resources.getInstance("food").id}\nName: ${food.name}\nDescription: ${food.description} 0% 0/100\nID:${
        resources.getInstance("mineral").id
      }\nName: ${mineral.name}\nDescription: ${mineral.description} 50% 50/100`
    );
  });

  it("should return the json representation of the handler", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };
    const mineral = { name: "mineral", description: "mineral", qty: 50, max: 100 };

    resources.newInstances([food, mineral]);

    expect(resources.toJSON()).toMatchObject({
      food: { ...food, volume: 0 },
      mineral: { ...mineral, volume: 0.5 }
    });
  });
  it("should fail creating a new instance without name", () => {
    const key = "resources";
    const resources = new PropHandler({
      key,
      parent: {}
    });

    expect(() => resources.newInstance()).toThrow(`Invalid ${key} instance`);
  });
  it("should fail creating a new instance that already exists", () => {
    const key = "resources";
    const resources = new PropHandler({
      key,
      parent: {}
    });
    const resource = { name: random.arrayElement(["food", "mineral"]), description: random.name(), qty: 0, max: 100 };
    resources.newInstance(resource);

    expect(() => resources.newInstance(resource)).toThrow(`${key}: ${resource.name} already exists`);
  });

  it("should not add more than the max", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };

    resources.newInstance(food);
    resources.add("food", 200);

    expect(resources.getQty("food")).toBe(100);
  });

  it("should not remove more than the qty", () => {
    const resources = new PropHandler({
      key: "resources",
      parent: {}
    });
    const food = { name: "food", description: "food", qty: 0, max: 100 };

    resources.newInstance(food);
    resources.remove("food", 200);

    expect(resources.getQty("food")).toBe(0);
  });
});
