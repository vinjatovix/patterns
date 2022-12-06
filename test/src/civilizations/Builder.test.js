const { ProductorBuilder } = require("../../../src/classes/civilizations");

describe("Builder - module", () => {
  it("should build a producer civilization", () => {
    const civilization = new ProductorBuilder().identity
      .name("The Producer Civilization")
      .description("This civilization produces stuff")
      .buildings.newInstances([
        {
          name: "farm",
          description: "a farm",
          max: 10
        }
      ])
      .technologies.newInstance({
        name: "agriculture",
        description: "the technology of agriculture"
      })
      .units.newInstance({
        name: "workers",
        description: "a workhand"
      })
      .build();
    expect(civilization.getName()).toBe("The Producer Civilization");
    expect(civilization.getDescription()).toBe("This civilization produces stuff");
  });
});
