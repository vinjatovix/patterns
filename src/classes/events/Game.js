const Event = require("../common/Event");

class Game {
  constructor() {
    this.queries = new Event();
  }
  performQuery(sender, query) {
    this.queries.fire(sender, query);
  }
}

module.exports = Game;
