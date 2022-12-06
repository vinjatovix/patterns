const { Entity, PropHandler } = require("../common");

const { CIV_PROPS } = require("../settings");

// MAIN CLASS
class Civilization extends Entity {
  constructor(name = "", description = "") {
    super(name, description);
    this.resources = new PropHandler({
      key: CIV_PROPS.RESOURCES,
      parent: this
    });
  }
  toString() {
    return `\n${super.toString()}\nRESOURCES:${this.resources.toString()}`;
  }
  toJSON() {
    return { ...super.toJSON(), resources: this.resources.toJSON() };
  }
}

class Productor extends Civilization {
  constructor(name = "", description = "") {
    super(name, description);
    this.buildings = new PropHandler({
      key: CIV_PROPS.BUILDINGS,
      parent: this
    });
    this.units = new PropHandler({
      key: CIV_PROPS.UNITS,
      parent: this
    });
    this.technologies = new PropHandler({
      key: CIV_PROPS.TECHNOLOGIES,
      parent: this
    });
  }

  toString() {
    const buildings = this.buildings.toString();
    const units = this.units.toString();
    const technologies = this.technologies.toString();
    return `\n${super.toString()}\nBUILDINGS:${buildings}\nUNITS:${units}\nTECHNOLOGIES:${technologies}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      buildings: this.buildings.toJSON(),
      units: this.units.toJSON(),
      technologies: this.technologies.toJSON()
    };
  }
}

module.exports = {
  Civilization,
  Productor
};
