const { ProductorBuilder } = require("../../../../src/classes/civilizations");

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
    expect(civilization.toString()).toMatch(/The Producer Civilization/);
    expect(civilization.toJSON()).toMatchObject({
      buildings: {
        farm: {
          description: "a farm",
          max: 10,
          name: "farm"
        }
      },
      description: "This civilization produces stuff",
      name: "The Producer Civilization",
      technologies: {
        agriculture: {
          description: "the technology of agriculture",
          name: "agriculture"
        }
      },
      units: {
        workers: {
          description: "a workhand",
          name: "workers"
        }
      }
    });
  });
});
