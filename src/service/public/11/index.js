import Clock from "../common/clock/Clock.js";
import { Game } from "../common/game/Game.js";
// import { SpawnManager } from "../common/spawn/SpawnManager.js";
import { DummyCar, SmartCar } from "./Car.js";
import { NeuralNetwork } from "./Network.js";
import { Road } from "./Road.js";
import { Visualizer } from "./Visualizer.js";

window.addEventListener("DOMContentLoaded", function () {
  const mainCanvas = document.getElementById("canvas1");
  const mainCtx = mainCanvas.getContext("2d");
  mainCanvas.width = 200;
  const networkCanvas = document.getElementById("network");
  const networkCtx = networkCanvas.getContext("2d");
  networkCanvas.width = 800;

  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const nextButton = document.getElementById("next");
  const lastButton = document.getElementById("last");
  const saveButton = document.getElementById("save");
  const save2Button = document.getElementById("save2");
  const mixButton = document.getElementById("mix");
  const loadbutton = document.getElementById("load");
  const resetButton = document.getElementById("reset");
  const mutateButton = document.getElementById("mutate");
  const discardButton = document.getElementById("discard");
  const kill0Button = document.getElementById("kill0");
  const kill1Button = document.getElementById("kill1");
  const kill2Button = document.getElementById("kill2");
  const cleanButton = document.getElementById("clean");

  let run = true;

  const makeDummyCar = game =>
    new DummyCar({ game, x: game.road.getLaneCenter((Math.random() * 3) | 0), y: -Math.random() * 3000 });

  class SmartCarGame extends Game {
    constructor(width, height, clock) {
      super(width, height, clock);
      this.road = new Road({ game: this, x: this.width * 0.5, width: this.width * 0.9 });
      this.traffic = [];
      for (let i = 0; i < 20; i++) {
        this.traffic.push(makeDummyCar(this));
        // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -200 * i }));
        // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(2), y: -200 * i }));
      }
      for (let i = 0; i < 3; i++) {
        this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(i), y: -3600 }));
      }
      this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -300 }));

      // make brake box
      // for (let i = 0; i < 1; i++) {
      //   this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(1), y: -0 }));
      // }
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -50 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(2), y: -50 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -100 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(2), y: -100 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -150 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(2), y: -150 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -200 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(2), y: -200 }));
      // // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -250 }));
      // // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(2), y: -250 }));
      // this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(0), y: -300 }));
      this.traffic.push(new DummyCar({ game: this, x: this.road.getLaneCenter(2), y: -300 }));

      // this.#generateRandomTraffic(10);
      this.cars = [];
      this.#generateSmartCars(1);
      this.#generateSmartCars(500);
      this.#generateSmartCars(1000);
      this.#generateSmartCars(4000);
      // this.#generateSmartCars(10000);
    }

    #generateRandomTraffic = n => {
      for (let i = 0; i < n; i++) {
        const car = new DummyCar({
          game: this,
          x: this.road.getLaneCenter(Math.floor(Math.random() * 4)),
          y: Math.random() * this.height * 2 - this.height * 0.5 - this.height * 2
        });
        this.traffic.push(car);
      }
    };

    #generateSmartCars = n => {
      const serializedLevels = localStorage.getItem("bestBrain");
      const deserializedBrain = serializedLevels ? JSON.parse(serializedLevels) : null;
      const deserializedLevels = deserializedBrain ? JSON.parse(deserializedBrain) : null;

      for (let i = 0; i < n; i++) {
        const car = new SmartCar({
          game: this,
          x: this.road.getLaneCenter(Math.floor(Math.random() + 1)),
          y: this.height * 0.05
        });
        this.cars.push(car);
      }
      if (serializedLevels) {
        for (const car of this.cars) {
          car.brain.loadBrain(deserializedLevels);
          // car.brain = NeuralNetwork.mutate(car.brain, 0.2);
        }
      }
    };

    #findBestCar = () => {
      // damage false, min y
      let bestCar = null;
      this.cars.forEach(car => {
        if (!car.damaged && (!bestCar || car.y < bestCar.y)) {
          bestCar = car;
        }
      });
      return bestCar;
    };

    update() {
      this.cars = this.cars.filter(car => {
        const readings = [...car.sensor.readings];
        if (readings.length) {
          if (car.y > this.focusCar.y + 150) {
            car.damaged = true;
          }
        }

        return !car.damaged;
      });
      const deltaTime = this.clock.update();
      this.focusCar = this.#findBestCar() || this.focusCar;
      // this.focusCar.update(deltaTime, this.road.borders, this.traffic);
      this.traffic.forEach(car => car.update(deltaTime, this.road.borders));
      this.cars.sort((a, b) => a.y - b.y);
      this.cars.forEach(car => car.update(deltaTime, this.road.borders, this.traffic));
    }

    draw(ctx) {
      super.draw(ctx);
      ctx.save();
      ctx.translate(0, -this.focusCar.y + this.height * 0.8);
      this.road.draw(ctx);
      this.traffic.forEach(car => car.draw(ctx));
      this.focusCar.draw(ctx, "sensor");

      ctx.globalAlpha = 0.3;
      this.cars.forEach(car => car.draw(ctx));

      ctx.restore();
      Visualizer.drawNetwork(networkCtx, this.focusCar.brain);
    }
  }
  const clock = new Clock();
  const game = new SmartCarGame(mainCanvas.width, window.innerHeight, clock);

  function animate(time) {
    mainCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    if (run) {
      mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      game.update();
    }
    game.draw(mainCtx);

    requestAnimationFrame(animate);
  }

  animate();

  function play() {
    run = true;
  }

  function pause() {
    run = false;
  }

  pauseButton.addEventListener("click", pause);
  playButton.addEventListener("click", play);

  let c = 0;
  function nextCar() {
    c++;
    game.focusCar = game.cars[c];
  }

  function prevCar() {
    c--;
    game.focusCar = game.cars[c];
  }

  nextButton.addEventListener("click", nextCar);
  lastButton.addEventListener("click", prevCar);

  function saveOnLocalStorage() {
    const serializedLevels = game.focusCar.brain.serialize();
    localStorage.setItem("bestBrain", JSON.stringify(serializedLevels));
  }

  saveButton.addEventListener("click", saveOnLocalStorage);

  function save2OnLocalStorage() {
    const serializedLevels = game.focusCar.brain.serialize();
    localStorage.setItem("bestBrain2", JSON.stringify(serializedLevels));
  }

  save2Button.addEventListener("click", save2OnLocalStorage);

  function mix() {
    const deserializedBrain = localStorage.getItem("bestBrain");
    const deserializedLevels = JSON.parse(deserializedBrain);

    const deserializedBrain2 = localStorage.getItem("bestBrain2");
    const deserializedLevels2 = JSON.parse(deserializedBrain2);

    game.cars.forEach(car => {
      const { levels: mixedLevels } = NeuralNetwork.crossover(
        { levels: JSON.parse(deserializedLevels) },
        { levels: JSON.parse(deserializedLevels2) }
      );
      car.brain = { levels: [...mixedLevels] };
    });
  }

  mixButton.addEventListener("click", mix);

  function discardOnLocalStorage() {
    localStorage.removeItem("bestBrain");
  }

  resetButton.addEventListener("click", discardOnLocalStorage);
  function loadOnLocalStorage() {
    const serializedLevels = localStorage.getItem("bestBrain");
    if (!serializedLevels) return;
    const deserializedBrain = JSON.parse(serializedLevels);
    const deserializedLevels = JSON.parse(deserializedBrain);
    game.cars.forEach(car => {
      car.brain = { levels: [...deserializedLevels] };
      car.brain = NeuralNetwork.mutate(car.brain, 0.2);
    });
    // discardOnLocalStorage();
  }

  loadbutton.addEventListener("click", loadOnLocalStorage);

  function mutate() {
    for (const car of game.cars) {
      car.brain = NeuralNetwork.mutate(car.brain, 0.2);
    }
  }

  mutateButton.addEventListener("click", mutate);

  function discard() {
    game.focusCar.damaged = true;
  }

  discardButton.addEventListener("click", discard);

  function kill0() {
    game.cars.forEach(car => {
      if (car.x >= game.road.getLaneCenter(0) - 35 && car.x <= game.road.getLaneCenter(0) + 35) {
        car.damaged = true;
      }
    });
  }

  kill0Button.addEventListener("click", kill0);

  function kill1() {
    game.cars.forEach(car => {
      if (car.x >= game.road.getLaneCenter(1) - 35 && car.x <= game.road.getLaneCenter(1) + 35) {
        car.damaged = true;
      }
    });
  }

  kill1Button.addEventListener("click", kill1);

  function kill2() {
    game.cars.forEach(car => {
      if (car.x >= game.road.getLaneCenter(2) - 35 && car.x <= game.road.getLaneCenter(2) + 35) {
        car.damaged = true;
      }
    });
  }

  kill2Button.addEventListener("click", kill2);

  cleanButton.addEventListener("click", () => {
    game.cars.forEach(car => {
      if (car.y > game.focusCar.y + 150) {
        car.damaged = true;
      }
    });
  });

  window.addEventListener("keydown", e => {
    if (e.key === "p") {
      run = !run;
    }
    if (e.key === "x") {
      mix();
    }
    if (e.key === "m") {
      mutate();
    }
    if (e.key === "1") {
      saveOnLocalStorage();
    }
    if (e.key === "2") {
      save2OnLocalStorage();
    }
  });
});
