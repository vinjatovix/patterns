class Percentage {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return `${this.value}%`;
  }

  valueOf() {
    return this.value / 100 !== 0 ? this.value / 100 : 0.001;
  }
}

module.exports = { Percentage };
