const { Entity } = require("./Entity");
const { validateNumber } = require("./validations");

class Counter {
  constructor(qty = 0, max = 0) {
    this.qty = validateNumber(qty);
    this.max = validateNumber(max);
  }

  add(qty) {
    validateNumber(qty);
    if (this.qty + qty > this.max) {
      this.qty = this.max;
    } else {
      this.qty += qty;
    }
    return this.qty;
  }

  remove(qty) {
    validateNumber(qty);
    if (this.qty - qty < 0) {
      this.qty = 0;
    } else {
      this.qty -= qty;
    }
    return this.qty;
  }
  getQty() {
    return this.qty;
  }
  getMax() {
    return this.max;
  }
  setMax(max) {
    this.max = validateNumber(max);
    return this.max;
  }
  getSpace() {
    return this.max - this.qty;
  }

  getPercentage() {
    return this.max !== 0 ? this.qty / this.max : 0;
  }
  toString() {
    return `${this.getPercentage() * 100}% ${this.qty}/${this.max}`;
  }
  toJSON() {
    return {
      qty: this.qty,
      max: this.max,
      volume: this.getPercentage()
    };
  }
}
class NamedCounter extends Entity {
  constructor({ name, description, qty, max } = {}) {
    super(name, description);
    this.counter = new Counter(qty, max);
  }
  add(qty) {
    this.counter.add(qty);
    return this.counter.getQty();
  }
  remove(qty) {
    this.counter.remove(qty);
    return this.counter.getQty();
  }
  getQty() {
    return this.counter.getQty();
  }
  setMax(max) {
    this.counter.setMax(max);
    return this.counter.getMax();
  }
  getMax() {
    return this.counter.getMax();
  }
  getSpace() {
    return this.counter.getSpace();
  }
  getPercentage() {
    return this.counter.getPercentage();
  }
  toString() {
    return `${super.toString()} ${this.counter.toString()}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      ...this.counter.toJSON()
    };
  }
}

module.exports = { NamedCounter };
