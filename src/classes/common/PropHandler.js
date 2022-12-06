const { NamedCounter } = require("./Counter");

class PropHandler {
  constructor({ key, parent }) {
    this.root = key;
    this[key] = parent[key] || {};
  }
  checkAvailability(name) {
    if (!this[this.root][name]) {
      throw new Error(`${this.root}: ${name} does not exist`);
    }
  }
  newInstance({ name, description, qty, max } = {}) {
    if (!name || !description) {
      throw new Error(`Invalid ${this.root} instance`);
    }
    if (this[this.root][name]) {
      throw new Error(`${this.root}: ${name} already exists`);
    }
    this[this.root][name] = new NamedCounter({
      name,
      description,
      qty,
      max
    });
    return this[this.root];
  }
  newInstances(models) {
    models.forEach(model => this.newInstance(model));
    return this[this.root];
  }
  add(name, qty) {
    this.checkAvailability(name);
    this[this.root][name].add(qty);
    return this[this.root][name].getQty();
  }
  remove(name, qty) {
    this.checkAvailability(name);
    this[this.root][name].remove(qty);
    return this[this.root][name].getQty();
  }
  getId(name) {
    this.checkAvailability(name);
    return this[this.root][name].getId();
  }
  getQty(name) {
    this.checkAvailability(name);
    return this[this.root][name].getQty();
  }
  getInstance(name) {
    this.checkAvailability(name);
    return this[this.root][name];
  }
  getPercentage(name) {
    this.checkAvailability(name);
    return this[this.root][name].getPercentage();
  }
  setMax(name, max) {
    this.checkAvailability(name);
    this[this.root][name].setMax(max);
    return this[this.root][name].getMax();
  }
  getMax(name) {
    this.checkAvailability(name);
    return this[this.root][name].getMax();
  }
  getInstancesList() {
    return Object.keys(this[this.root]);
  }
  toString() {
    let message = "";
    for (const key of this.getInstancesList()) {
      message += `\n${this[this.root][key].toString()}`;
    }
    return message;
  }
  toJSON() {
    const models = {};
    for (const key of this.getInstancesList()) {
      models[key] = this[this.root][key].toJSON();
    }
    return models;
  }
}

module.exports = { PropHandler };
