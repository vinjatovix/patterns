const { Entity } = require("../../../../src/classes/common");

describe("Entity", () => {
  it("should be an instance of Entity", () => {
    const entity = new Entity();
    expect(entity).toBeInstanceOf(Entity);
  });
  it("should have an id", () => {
    const entity = new Entity();
    expect(entity.getId()).not.toBeUndefined();
  });
  it("should have a name", () => {
    const entity = new Entity("test");
    expect(entity.getName()).toBe("test");
  });
  it("should set a new name", () => {
    const entity = new Entity("test");
    expect(entity.setName("new name")).toBe("new name");
  });
  it("should have a description", () => {
    const entity = new Entity("test", "test description");
    expect(entity.getDescription()).toBe("test description");
  });
  it("should set a new description", () => {
    const entity = new Entity("test", "test description");
    expect(entity.setDescription("new description")).toBe("new description");
  });
  it("should return the json of the entity", () => {
    const entity = new Entity("test", "test description");
    expect(entity.toJSON()).toMatchObject({
      id: expect.any(String),
      description: expect.any(String),
      name: expect.any(String)
    });
  });
  it("should return the string of the entity", () => {
    const entity = new Entity("test", "test description");
    expect(entity.toString()).toBe("ID:" + entity.getId() + "\nName: test\nDescription: test description");
  });
});
