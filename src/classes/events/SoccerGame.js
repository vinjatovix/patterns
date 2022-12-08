/* eslint-disable no-console */
const Event = require("../common/Event");

class SoccerGame {
  constructor() {
    this.events = new Event();
  }
}

class Player {
  constructor(name, game) {
    this.name = name;
    this.game = game;
    this.goalsScored = 0;
  }
  score() {
    this.goalsScored++;
    const args = new PlayerScoredEventArgs(this.name, this.goalsScored);
    this.game.events.fire(this, args);
  }
}

class PlayerScoredEventArgs {
  constructor(playerName, goalsScored) {
    this.playerName = playerName;
    this.goalsScored = goalsScored;
  }

  print() {
    console.log(`${this.playerName} has scored! Their goals: ${this.goalsScored}`);
  }
}

class Coach {
  constructor(game) {
    this.game = game;
    game.events.subscribe((sender, args) => {
      if (args instanceof PlayerScoredEventArgs && args.goalsScored < 3) {
        console.log(`Coach says: Well done, ${args.playerName}`);
      }
    });
  }
}

module.exports = { SoccerGame, Player, PlayerScoredEventArgs, Coach };
