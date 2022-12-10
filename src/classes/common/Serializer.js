class Serializer {
  constructor(types) {
    this.types = types;
  }

  markRecursive(obj) {
    if (obj === null || obj === undefined) {
      return;
    }
    const idx = this.types.findIndex(t => t.name === obj.constructor.name);
    if (idx !== -1) {
      obj.typeIndex = idx;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.markRecursive(obj[key]);
        }
      }
    }
  }

  reconstructRecursive(obj) {
    if (obj.hasOwnProperty("typeIndex")) {
      const type = this.types[obj.typeIndex];
      const newObj = new type();
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined) {
          newObj[key] = this.reconstructRecursive(obj[key]);
        }
      }
      delete newObj.typeIndex;

      return newObj;
    }
    return obj;
  }

  clone(obj) {
    this.markRecursive(obj);
    const copy = JSON.parse(JSON.stringify(obj));

    return this.reconstructRecursive(copy);
  }
}

module.exports = Serializer;
