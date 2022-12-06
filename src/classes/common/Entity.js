const { uuid } = require("./random");

class Entity {
  constructor(name = "", description = "") {
    this.id = uuid();
    this.name = name;
    this.description = description;
  }

  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
    return this.name;
  }
  getDescription() {
    return this.description;
  }
  setDescription(description) {
    this.description = description;
    return this.description;
  }
  toString() {
    return `ID:${this.id}\nName: ${this.name}\nDescription: ${this.description}`;
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    };
  }
}

module.exports = { Entity };
