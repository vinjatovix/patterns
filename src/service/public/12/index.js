import Clock from "../common/clock/Clock.js";
import { Game } from "../common/game/Game.js";
import { CanvasManager } from "../common/canvasManager/CanvasManager.js";
import { DummyCar, SmartCar } from "./Car.js";
import { NeuralNetwork } from "./Network.js";
import { Road } from "./Road.js";
import { Visualizer } from "./Visualizer.js";
import { forward8s, forward17sAlpha } from "./brains/index.js";

const CANVAS = {
  main: "mainCanvas",
  network: "networkCanvas"
};

const SETTINGS = {
  colors: {
    endCarColor: "chartreuse",
    dummyCarColor: "yellow",
    smartCarColor: "black",
    smartTrafficColor: "purple",
    slot1Color: "green",
    slot2Color: "orange",
    mix1and2Color: "paleturquoise",
    mutationColor: "beige"
  },
  dbKeys: {
    slot1: "saveSlot1",
    slot2: "saveSlot2",
    allAlive: "allAlive",
    backupATH: "backupATH"
  }
};

window.addEventListener("DOMContentLoaded", function () {
  const mainCanvas = document.getElementById(CANVAS.main);
  const networkCanvas = document.getElementById(CANVAS.network);

  class SmartCarGame extends Game {
    constructor(width, height, clock, persistenceManager) {
      super(width, height, clock);
      this.persistenceManager = persistenceManager;
      this.road = new Road({ game: this });
      this.generateTraffic = false;
      this.trafficAmmount = 5;
      this.traffic = [];
      this.cars = [];
      this.rivals = [];
      this.focusCar = null;
      this.debug = false;
    }

    #cleanUp = ({ lanes }) => {
      this.traffic = [];
      this.cars = [];
      this.rivals = [];
      this.focusCar = null;
      this.width = lanes * 60 + 5;
      this.road = new Road({ game: this, lanes });
    };

    #generateEndCars = ({ end, lanes, options = { randomSpeed: false, color: SETTINGS.colors.endCarColor } }) => {
      for (let i = 0; i < lanes; i++) {
        this.traffic.push(new DummyCar({ x: this.road.getLaneCenter(i), y: end, options }));
      }
    };

    #generateBrakeBox({ end = -3000, lanes = this.road.lanes }) {
      this.#generateEndCars({ end, lanes });

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < lanes; j++) {
          if (j % 2 === 0) continue;
          this.traffic.push(
            new DummyCar({
              x: this.road.getLaneCenter(j),
              y: end + i * 50,
              options: { randomSpeed: false, color: SETTINGS.colors.endCarColor }
            })
          );
        }
      }
    }

    #generateRandomTraffic = ({ qty = 10, ai = false, end = -3000, randomSpeed = false } = {}) => {
      for (let i = 0; i < qty; i++) {
        this.traffic.push(
          new DummyCar({
            x: game.road.getLaneCenter(),
            y: end * (Math.random() + 0.1),
            options: { randomSpeed, color: SETTINGS.colors.dummyCarColor }
          })
        );

        if (ai && i % 3 === 0) {
          const { brain } = this.persistenceManager.cars("forward8s");
          this.traffic.push(
            this.#addSmartCar({
              x: this.road.getLaneCenter(),
              y: end * (Math.random() + 0.1),
              maxSpeed: Math.random() * 2 + 1,
              brain,
              color: SETTINGS.colors.smartTrafficColor,
              angleSensor: false
            })
          );
        }
      }
    };

    #generateBasic4DummyCars({ lanes }) {
      this.traffic.push(new DummyCar({ x: this.road.getLaneCenter(lanes - 1), y: -300 }));
      this.traffic.push(new DummyCar({ x: this.road.getLaneCenter(lanes - 3), y: -300 }));
      this.traffic.push(new DummyCar({ x: this.road.getLaneCenter(lanes - 2), y: 0 }));
      this.traffic.push(new DummyCar({ x: this.road.getLaneCenter(lanes - 1), y: 200 }));
    }

    #addSmartCar = ({ x, y = 0, brain, maxSpeed = 3, color, angleSensor = false }) => {
      const rayCount = angleSensor ? brain[0].inputs.length - 1 : brain[0].inputs.length;
      const car = new SmartCar({
        x,
        y: y,
        maxSpeed,
        rayCount,
        raySpread: rayCount < 10 ? Math.PI * 0.9 : Math.PI * 2,
        rayLength: rayCount < 10 ? 100 : 150,
        angleSensor
      });
      car.color = color;
      car.brain.loadBrain(brain);

      return car;
    };

    #addSlots1and2ToRoad = ({ x }) => {
      const slot1Levels = this.persistenceManager.deserialize(SETTINGS.dbKeys.slot1);
      slot1Levels &&
        this.cars.push(
          this.#addSmartCar({ x, brain: slot1Levels, color: SETTINGS.colors.slot1Color, angleSensor: true })
        );
      const slot2Levels = this.persistenceManager.deserialize(SETTINGS.dbKeys.slot2);
      slot2Levels &&
        this.cars.push(
          this.#addSmartCar({ x, brain: slot2Levels, color: SETTINGS.colors.slot2Color, angleSensor: true })
        );
    };

    #generateSmartCars = ({
      qty,
      lanes = 3,
      options = { match: false, mutate: false, random: false, circle: false }
    }) => {
      const initialBrain = this.persistenceManager.deserialize(SETTINGS.dbKeys.slot1);
      const brainToCombine = this.persistenceManager.deserialize(SETTINGS.dbKeys.slot2);

      const x = this.#getStartPositionByOptions({ lanes, options });

      for (let i = 0; i < qty; i++) {
        const angle = options.circle ? (i / qty) * Math.PI * 2 : 0;
        const car = new SmartCar({
          x,
          y: 0,
          maxSpeed: 3,
          angleSensor: true,
          angle
        });

        if (options.random) {
          this.cars.push(car);
          continue;
        }

        if (initialBrain) car.brain.loadBrain(initialBrain);

        if (options.match) {
          car.color = SETTINGS.colors.slot1Color;
        } else if (!brainToCombine || (brainToCombine && options.mutate)) {
          car.brain = NeuralNetwork.mutate(car.brain, 0.2);
          car.color = SETTINGS.colors.mutationColor;
        } else {
          car.brain = NeuralNetwork.crossover(car.brain, { levels: [...brainToCombine] });
          car.color = SETTINGS.colors.mix1and2Color;
        }

        this.cars.push(car);
      }

      if (!options.match) this.#addSlots1and2ToRoad({ x });
    };

    #generateRivalCars = ({ lanes }) => {
      this.rivals = [];

      const carWith8Sensors = this.persistenceManager.cars("forward8s");
      const carWith17Sensors = this.persistenceManager.cars("forward17sAlpha");

      for (let i = 0; i < lanes - 1; i++) {
        const coin = Math.random() > 0.5;

        this.rivals.push(
          this.#addSmartCar({
            x: this.road.getLaneCenter(i),
            brain: coin ? carWith8Sensors["brain"] : carWith17Sensors["brain"],
            color: coin ? "cyan" : "orange",
            angleSensor: false
          })
        );
      }
    };

    #loadAllCachedBrains = ({ x }) => {
      const allSerializedBrains = this.persistenceManager.load(SETTINGS.dbKeys.allAlive);
      const allDeserializedBrains = (allSerializedBrains && JSON.parse(allSerializedBrains)) || [];

      for (const brain of allDeserializedBrains) {
        this.cars.push(this.#addSmartCar({ x, brain, color: "black", angleSensor: true }));
      }
    };

    #loadATHBrains = ({ x }) => {
      const allSerializedBrains = this.persistenceManager.load(SETTINGS.dbKeys.backupATH);
      const allDeserializedBrains = (allSerializedBrains && JSON.parse(allSerializedBrains)) || [];

      for (let i = 0; i < allDeserializedBrains.length; i++) {
        const percentage = Math.floor((i / allDeserializedBrains.length) * 100);
        const color = `hsl(${percentage}, 100%, 50%)`;
        this.cars.push(this.#addSmartCar({ x, brain: allDeserializedBrains[i], color, angleSensor: true }));
      }
    };

    #findBestCar = () =>
      this.cars.reduce((bestCar, car) => {
        if (!car.damaged && (!bestCar || car.y < bestCar.y)) {
          bestCar = car;
        }
        return bestCar;
      }, null);

    #getStartPositionByOptions({ lanes, options }) {
      let x;

      if (options.circle) x = this.road.getLaneCenter(Math.floor(lanes * 0.5));
      else if (options.match) x = this.road.getLaneCenter(lanes - 1);
      else x = this.road.getLaneCenter(Math.floor(Math.random() * lanes));

      return x;
    }

    #slalom({ end = -3000, lanes }) {
      this.#cleanUp({ lanes });
      this.#generateBrakeBox({ end, lanes });
      for (let i = 0; i < lanes; i++) {
        if (i !== 0) {
          this.traffic.push(
            new DummyCar({
              x: this.road.getLaneCenter(i),
              y: -1500
            })
          );
          this.traffic.push(
            new DummyCar({
              x: this.road.getLaneCenter(i),
              y: -500
            })
          );
        }

        if (i !== lanes - 1) {
          this.traffic.push(
            new DummyCar({
              x: this.road.getLaneCenter(i),
              y: -1000
            })
          );
          this.traffic.push(
            new DummyCar({
              x: this.road.getLaneCenter(i),
              y: -2000
            })
          );
        }
      }
    }

    playGame({ lanes = this.road.lanes, end = -5000, randomSpeed = true, qty = 1 } = {}) {
      const options = { match: true, mutate: false, random: false, circle: false };

      this.#cleanUp({ lanes });
      this.#generateEndCars({ end, lanes });
      this.#generateRandomTraffic({ qty: lanes * 6, ai: true, randomSpeed });
      this.#generateRivalCars({ lanes });
      this.#generateSmartCars({ qty, lanes, options });
    }
    simulate({ lanes = this.road.lanes, qty = 1000, end = -3000, randomSpeed = true } = {}) {
      const options = { match: false, mutate: false, random: false, circle: false };
      // this simulates the game without rivals, just to see how the car performs,
      // turquoise cars are posible mixes of the best car and the car in slot 2
      this.#cleanUp({ lanes });
      this.#generateBrakeBox({ end, lanes });

      this.generateTraffic &&
        this.#generateRandomTraffic({ qty: lanes * this.trafficAmmount, ai: true, end, randomSpeed });

      this.#generateSmartCars({ qty, lanes, options });
    }
    train({ lanes = this.road.lanes, end = -3000 } = {}) {
      // on train mode, we generate a lot of smart cars based on the best car
      const options = { match: false, mutate: true, random: false, circle: false };
      this.#cleanUp({ lanes });
      this.#generateBrakeBox({ end, lanes });
      this.#slalom({ end, lanes });

      this.generateTraffic &&
        this.#generateRandomTraffic({ end, qty: lanes * this.trafficAmmount, ai: false, randomSpeed: false });

      this.#generateSmartCars({ qty: 2000, lanes, options });
    }

    load({ end = -2000, lanes = this.road.lanes } = {}) {
      this.#cleanUp({ lanes });
      this.#generateBrakeBox({ end, lanes });
      if (this.generateTraffic) {
        this.#generateRandomTraffic({ end, qty: lanes * this.trafficAmmount, ai: false, randomSpeed: false });
        this.#generateBasic4DummyCars({ lanes });
      }

      const x = this.road.getLaneCenter(lanes - 1);
      this.#loadAllCachedBrains({ x });
      this.#loadATHBrains({ x });
      this.#addSlots1and2ToRoad({ x });
    }

    randomize({ lanes = this.road.lanes, end = -3000, qty = 2000 } = {}) {
      const options = { match: false, mutate: false, random: true, circle: false };

      this.#cleanUp({ lanes });
      this.#generateBrakeBox({ end, lanes });
      this.generateTraffic &&
        this.#generateRandomTraffic({ end, qty: lanes * this.trafficAmmount, ai: true, randomSpeed: true });
      this.#generateSmartCars({ qty, lanes, options });
    }

    circle({ lanes = this.road.lanes, end = -700, qty = 1000 } = {}) {
      const options = { match: false, mutate: false, random: false, circle: true };

      this.#cleanUp({ lanes });
      this.#generateEndCars({ end, lanes });
      this.#generateEndCars({ end: -end, lanes });
      this.#generateSmartCars({ qty, lanes, options });
    }

    update() {
      this.clock.update();
      this.rivals = this.rivals.filter(car => !car.damaged);
      this.cars = this.cars.filter(car => {
        const readings = [...car.sensor.readings];
        if (readings.length) {
          if (car.y > this.focusCar.y + 800) {
            car.damaged = true;
          }
        }

        return !car.damaged;
      });

      this.focusCar = this.#findBestCar() || this.focusCar;
      this.traffic.forEach(car => car.update({ roadBorders: this.road.borders, traffic: this.traffic }));
      this.rivals.forEach(car => car.update({ roadBorders: this.road.borders, traffic: this.traffic }));
      this.cars.forEach(car => car.update({ roadBorders: this.road.borders, traffic: this.traffic }));
    }
    draw(mainCtx, networkCtx) {
      if (!this.focusCar) return;

      mainCtx.save();
      mainCtx.translate(0, -this.focusCar.y + this.height * 0.3);
      this.road.draw(mainCtx);
      this.traffic.forEach(car => car.draw(mainCtx));
      this.focusCar.draw(mainCtx, "sensor");

      mainCtx.globalAlpha = 0.3;
      this.cars.forEach(car => car.draw(mainCtx));

      mainCtx.globalAlpha = 0.5;
      this.rivals.forEach(car => car.draw(mainCtx));

      mainCtx.restore();
      Visualizer.drawNetwork(networkCtx, this.focusCar.brain);
      super.draw(mainCtx);
    }
  }
  class RuntimeManager {
    constructor(game, canvasManager, persistenceManager) {
      this.game = game;
      this.canvasManager = canvasManager;
      this.run = true;
      this.persistenceManager = persistenceManager;

      this.checkBoxTraffic = document
        .getElementById("traffic")
        .addEventListener("change", () => (this.game.generateTraffic = !this.game.generateTraffic));

      this.trafficAmmount = document
        .getElementById("trafficAmmount")
        .addEventListener("change", e => (this.game.trafficAmmount = e.target.value));

      this.pauseButton = document.getElementById("pause").addEventListener("click", () => (this.run = !this.run));

      this.gameButton = document.getElementById("game").addEventListener("click", () => {
        this.startMatchGame();
      });

      this.simulateButton = document.getElementById("simulate").addEventListener("click", () => {
        this.game.simulate();
      });

      this.trainButton = document.getElementById("train").addEventListener("click", () => {
        this.startTraining();
      });

      this.randomizeButton = document.getElementById("randomize").addEventListener("click", () => {
        this.game.randomize();
      });

      this.discardButton = document.getElementById("discard").addEventListener("click", () => {
        this.discardFocusedCar();
      });

      this.slot1Button = document.getElementById("slot1").addEventListener("click", () => {
        this.store(SETTINGS.dbKeys.slot1);
      });

      this.slot2Button = document.getElementById("slot2").addEventListener("click", () => {
        this.store(SETTINGS.dbKeys.slot2);
      });

      this.delete1Button = document.getElementById("delete1").addEventListener("click", () => {
        localStorage.removeItem(SETTINGS.dbKeys.slot1);
      });

      this.delete2Button = document.getElementById("delete2").addEventListener("click", () => {
        localStorage.removeItem(SETTINGS.dbKeys.slot2);
      });

      this.backupATHButton = document.getElementById("backupATH").addEventListener("click", () => {
        this.backupATH();
      });

      this.allAliveButton = document.getElementById("allAlive").addEventListener("click", () => {
        this.cacheAllAlive();
      });

      this.loadCacheButton = document.getElementById("loadAll").addEventListener("click", () => {
        this.game.load();
      });

      this.mix1And2Button = document.getElementById("mix1and2").addEventListener("click", () => {
        this.mix1and2();
      });

      this.mix1or2Button = document.getElementById("mix1or2").addEventListener("click", () => {
        this.mix1or2();
      });

      this.mutateButton = document.getElementById("mutate").addEventListener("click", () => {
        this.mutate();
      });

      this.resetButton = document.getElementById("reset").addEventListener("click", () => {
        localStorage.clear();
        location.reload();
      });
      window.addEventListener("keydown", e => {
        if (e.key === "a") this.cacheAllAlive();
        if (e.key === "b") this.backupATH();
        if (e.key === "c") this.mix1or2();
        if (e.key === "d") this.discardFocusedCar();
        if (e.key === "g") this.startMatchGame();
        if (e.key === "l") this.game.load();
        if (e.key === "m") this.mutate();

        if (e.key === "r") {
          localStorage.clear();
          location.reload();
        }
        if (e.key === "s") this.game.simulate();
        if (e.key === "t") this.startTraining();
        if (e.key === "o") this.startCircleGame();
        if (e.key === "p") this.run = !this.run;
        if (e.key === "n") this.game.randomize();
        if (e.key === "x") this.mix1and2();
        if (e.key === "1") this.store(SETTINGS.dbKeys.slot1);
        if (e.key === "2") this.store(SETTINGS.dbKeys.slot2);
        if (e.key === "3") this.delete(SETTINGS.dbKeys.slot1);
        if (e.key === "4") this.delete(SETTINGS.dbKeys.slot2);
      });
    }

    cacheAllAlive() {
      const serializedBrains = this.game.cars.map(car => car.brain.levels);
      localStorage.setItem(SETTINGS.dbKeys.allAlive, JSON.stringify(serializedBrains));
    }

    backupATH() {
      const allBrains = [];
      const currentBrains = this.game.cars.map(car => car.brain.levels);
      const storedBrains = localStorage.getItem(SETTINGS.dbKeys.backupATH);
      if (storedBrains) allBrains.push(...JSON.parse(storedBrains));
      allBrains.push(...currentBrains);
      this.persistenceManager.serialize(SETTINGS.dbKeys.backupATH, allBrains);
    }

    discardFocusedCar() {
      this.game.focusCar.damaged = true;
    }

    startTraining() {
      const input = prompt("How many lanes?", "6");
      const lanes = input || 3;

      this.canvasManager.set2DCanvas({ canvas: CANVAS.main, width: +lanes * 60 + 10, height: window.innerHeight });
      this.game.train({ lanes });
    }

    startMatchGame() {
      const lanes = Math.floor(Math.random() * 3) + 3;
      this.canvasManager.set2DCanvas({ canvas: CANVAS.main, width: lanes * 60 + 10, height: window.innerHeight });
      this.game.playGame({ lanes });
    }

    startCircleGame() {
      const lanes = 10;
      this.canvasManager.set2DCanvas({ canvas: CANVAS.main, width: +lanes * 60 + 10, height: window.innerHeight });

      this.game.circle({ lanes });
    }

    mutate() {
      for (let i = 0; i < game.cars.length; i++) {
        this.game.cars[i].brain = NeuralNetwork.mutate(this.game.cars[i].brain, 0.1);
        this.game.cars[i].color = SETTINGS.colors.mutationColor;
      }
    }

    mix1and2() {
      const { deserializedLevels, deserializedLevels2 } = this.getSavedSlots();
      if (!deserializedLevels || !deserializedLevels2) return;

      for (const car of this.game.cars) {
        const { levels: mixedLevels } = NeuralNetwork.crossover(
          { levels: [...deserializedLevels] },
          { levels: [...deserializedLevels2] }
        );
        car.brain.levels = [...mixedLevels];
        car.color = SETTINGS.colors.mix1and2Color;
      }
    }

    mix1or2() {
      const { deserializedLevels, deserializedLevels2 } = this.getSavedSlots();

      if (!deserializedLevels || !deserializedLevels2) return;

      for (const car of this.game.cars) {
        const coin = Math.random() > 0.5;
        car.color = coin ? "green" : "orange";
        const brain = coin ? deserializedLevels : deserializedLevels2;
        const { levels: mixedLevels } = NeuralNetwork.crossover({ levels: brain }, { levels: [...car.brain.levels] });
        car.brain.levels = [...mixedLevels];
      }
    }

    getSavedSlots() {
      const deserializedLevels = this.persistenceManager.deserialize("saveSlot1");
      const deserializedLevels2 = this.persistenceManager.deserialize("saveSlot2");
      return { deserializedLevels, deserializedLevels2 };
    }

    store(key) {
      const serializedLevels = game.focusCar.brain.serialize();
      persistenceManager.save(key, serializedLevels);
      localStorage.setItem(key, serializedLevels);
    }
    delete(key) {
      localStorage.removeItem(key);
    }

    update() {
      this.game.update();
    }

    draw() {
      if (!this.run) {
        canvasManager[CANVAS.main].ctx.save();
        canvasManager[CANVAS.main].ctx.fillStyle = "rgba(0,0,0,0.5)";
        canvasManager[CANVAS.main].ctx.fillRect(
          0,
          0,
          canvasManager[CANVAS.main].width,
          canvasManager[CANVAS.main].height
        );

        canvasManager[CANVAS.main].ctx.fillStyle = "white";
        canvasManager[CANVAS.main].ctx.font = "30px Arial";
        canvasManager[CANVAS.main].ctx.fillText("Paused", 10, 50);

        canvasManager[CANVAS.main].ctx.restore();
      }
      this.game.draw(canvasManager[CANVAS.main].ctx, canvasManager[CANVAS.network].ctx);
    }
  }

  class PersistenceManager {
    constructor() {
      this.storage = window.localStorage;
      this.brainCollection = {
        forward17sAlpha: { ...forward17sAlpha },
        forward8s: { ...forward8s }
      };
    }

    cars(key) {
      return this.brainCollection[key];
    }
    save(key, value) {
      this.#validateKey(key);
      this.storage.setItem(key, value);
    }

    #validateKey(key) {
      if (!/^[a-zA-Z0-9]+$/.test(key)) throw new Error("Invalid key");
    }

    serialize(key, value) {
      this.#validateKey(key);
      this.storage.setItem(key, JSON.stringify(value));
    }

    load(key) {
      const value = this.storage.getItem(key);

      return value;
    }

    deserialize(key) {
      const value = this.load(key);

      return value && JSON.parse(value);
    }
  }

  const canvasManager = new CanvasManager({ canvasCollection: { mainCanvas, networkCanvas } });
  canvasManager.set2DCanvas({ canvas: CANVAS.main, width: 200, height: window.innerHeight });
  canvasManager.set2DCanvas({ canvas: CANVAS.network, width: 600, height: window.innerHeight * 0.5 });

  const persistenceManager = new PersistenceManager();
  const game = new SmartCarGame(canvasManager[CANVAS.main].width, window.innerHeight, new Clock(), persistenceManager);
  const runtimeManager = new RuntimeManager(game, canvasManager, persistenceManager);

  function animate(time) {
    canvasManager.set2DCanvas({
      canvas: CANVAS.main,
      width: canvasManager[CANVAS.main].width,
      height: window.innerHeight
    });
    canvasManager.set2DCanvas({ canvas: CANVAS.network, width: 600, height: window.innerHeight });
    if (runtimeManager.run) {
      canvasManager[CANVAS.main].ctx.clearRect(
        0,
        0,
        canvasManager[CANVAS.main].width,
        canvasManager[CANVAS.main].height
      );
      runtimeManager.update();
    }
    runtimeManager.draw();

    requestAnimationFrame(animate);
  }

  animate();

  // function kill0() {
  //   game.cars.forEach(car => {
  //     if (car.x >= game.road.getLaneCenter(0) - 35 && car.x <= game.road.getLaneCenter(0) + 35) {
  //       car.damaged = true;
  //     }
  //   });
  // }
});
