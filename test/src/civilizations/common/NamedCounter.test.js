const { NamedCounter, random } = require("../../../../src/classes/common");

describe("NamedCounter", () => {
  it("should be an instance of NamedCounter", () => {
    const foodCounter = new NamedCounter({ name: "food", description: "food description" });
    expect(foodCounter).toBeInstanceOf(NamedCounter);
  });
  it("should have an id, name and description", () => {
    const foodCounter = new NamedCounter({ name: "food", description: "food description" });
    expect(foodCounter.getId()).not.toBeUndefined();
    expect(foodCounter.getName()).toBe("food");
    expect(foodCounter.getDescription()).toBe("food description");
  });
  it("should set a new name and description", () => {
    const foodCounter = new NamedCounter({ name: "food", description: "food description" });
    expect(foodCounter.setName("new name")).toBe("new name");
    expect(foodCounter.setDescription("new description")).toBe("new description");
  });
  it("should return the json of the namedCounter", () => {
    const name = random.word();
    const description = random.description();
    const json = new NamedCounter({ name, description }).toJSON();
    expect(json).toMatchObject({
      id: expect.any(String),
      description,
      name,
      qty: 0,
      max: 0,
      volume: 0
    });
  });
  it("should return the string of the namedCounter", () => {
    const name = random.word();
    const description = random.description();
    const namedCounter = new NamedCounter({ name, description });
    expect(namedCounter.toString()).toBe(
      `ID:${namedCounter.getId()}\nName: ${name}\nDescription: ${description} ${namedCounter.getPercentage()}% ${namedCounter.getQty()}/${namedCounter.getMax()}`
    );
  });
  it("should set the max and change qty", () => {
    const food = new NamedCounter({ name: "food", description: "yum" });
    expect(food.getMax()).toBe(0);
    expect(food.setMax(20)).toBe(20);
    expect(food.add(10)).toBe(10);
    expect(food.remove(3)).toBe(7);
    expect(food.getQty()).toBe(7);
    expect(food.getSpace()).toBe(13);
    expect(food.getPercentage()).toBe(0.35);
    expect(food.toString()).toBe("ID:" + food.getId() + "\nName: food\nDescription: yum 35% 7/20");
    expect(food.toJSON()).toMatchObject({
      id: expect.any(String),
      description: expect.any(String),
      name: expect.any(String),
      qty: 7,
      max: 20,
      volume: 0.35
    });
  });
  it("should fail because qty is not a number", () => {
    const qty = random.word();
    expect(() => new NamedCounter({ name: "food", description: "yum", qty })).toThrow(`"${qty}" is not a number`);
  });

  it("should fail because max is not a number", () => {
    const max = random.word();
    expect(() => new NamedCounter({ name: "food", description: "yum", max })).toThrow(`"${max}" is not a number`);
  });
});
