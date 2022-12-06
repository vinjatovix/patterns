const { random } = require("../common");
const { INIT_CIV_RESOURCES, CIV_TYPES, CIV_FACTORIES } = require("../settings");
const { ProductorBuilder } = require("./Builder");

class FarmerFactory {
  static create() {
    return new ProductorBuilder().identity
      .name("Farmer")
      .description("Farmer description")
      .buildings.newInstances(CIV_FACTORIES.FARMER.buildings)
      .resources.newInstances(CIV_FACTORIES.FARMER.resources)
      .build();
  }
}

class MinerFactory {
  static create() {
    return new ProductorBuilder().identity
      .name("Miner")
      .description("Miner description")
      .resources.newInstances(CIV_FACTORIES.MINER.resources)
      .buildings.newInstances(CIV_FACTORIES.MINER.buildings)
      .build();
  }
}

class EnemyFactory {
  static create() {
    return new ProductorBuilder().identity
      .name("Enemy")
      .description("Enemy description")
      .buildings.newInstances(CIV_FACTORIES.ENEMY.buildings)
      .resources.newInstances(CIV_FACTORIES.ENEMY.resources)
      .build();
  }
}

class RandomFactory {
  static create() {
    return new ProductorBuilder().identity
      .name(random.word())
      .description(random.description())
      .resources.newInstances(INIT_CIV_RESOURCES)
      .build();
  }
}

class CustomFactory {
  static create({ name, description, resources = INIT_CIV_RESOURCES }) {
    if (!name) throw new Error("name is required");
    if (!description) throw new Error("description is required");

    return new ProductorBuilder().identity
      .name(name)
      .description(description)
      .resources.newInstances(resources)
      .build();
  }
}

const factories = Object.freeze({
  [CIV_TYPES.FARMER]: FarmerFactory,
  [CIV_TYPES.MINER]: MinerFactory,
  [CIV_TYPES.ENEMY]: EnemyFactory,
  [CIV_TYPES.RANDOM]: RandomFactory,
  [CIV_TYPES.CUSTOM]: CustomFactory
});

class CivilizationFactory {
  static create(type = "random", options = { resources: INIT_CIV_RESOURCES }) {
    if (!factories[type]) throw new Error(`Civilization type ${type} not found`);

    return factories[type].create(options);
  }
}

module.exports = { CivilizationFactory };
