const { CIV_PROPS } = require("../settings");
const { Civilization, Productor } = require("./Civilization");

class BuilderFacet {
  constructor(civilization) {
    this.civilization = civilization;
  }
  get identity() {
    return new IdentityManager({ civilization: this.civilization });
  }
  get resources() {
    return new HandlerManager({
      key: CIV_PROPS.RESOURCES,
      civilization: this.civilization
    });
  }
  get buildings() {
    return new HandlerManager({
      key: CIV_PROPS.BUILDINGS,
      civilization: this.civilization
    });
  }
  get units() {
    return new HandlerManager({
      key: CIV_PROPS.UNITS,
      civilization: this.civilization
    });
  }
  get technologies() {
    return new HandlerManager({
      key: CIV_PROPS.TECHNOLOGIES,
      civilization: this.civilization
    });
  }
  build() {
    return this.civilization;
  }
}

class IdentityManager extends BuilderFacet {
  constructor({ civilization }) {
    super(civilization);
  }
  name(name) {
    this.civilization.setName(name);
    return this;
  }
  description(description) {
    this.civilization.setDescription(description);
    return this;
  }
}

class HandlerManager extends BuilderFacet {
  constructor({ key, civilization }) {
    super(civilization);
    this.key = key;
  }
  newInstance(model) {
    this.civilization[this.key].newInstance(model);
    return this;
  }
  newInstances(models = []) {
    models.forEach(model => this.civilization[this.key].newInstance(model));
    return this;
  }
}

class CivilizationBuilder extends BuilderFacet {
  constructor(civilization = new Civilization()) {
    super(civilization);
  }
}

class ProductorBuilder extends BuilderFacet {
  constructor(civilization = new Productor()) {
    super(civilization);
  }
}

module.exports = {
  CivilizationBuilder,
  ProductorBuilder
};
