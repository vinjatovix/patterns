const RESOURCE_INIT = {
  qty: 900,
  max: 2000
};
const FOOD = {
  name: "food",
  description: "Not tasty, but it keeps you alive"
};

const POPULATION = {
  name: "population",
  description: "Work hands"
};

const CREDIT = {
  name: "credits",
  description: "Can't buy happiness, but you can buy stuff"
};

const MINERAL = {
  name: "mineral",
  description: "Can be used to build stuff"
};

const ENERGY = {
  name: "energy",
  description: "Energy is the lifeblood of the civilization"
};

module.exports = {
  CIV_PROPS: {
    RESOURCES: "resources",
    BUILDINGS: "buildings",
    UNITS: "units",
    TECHNOLOGIES: "technologies"
  },
  CIV_TYPES: {
    FARMER: "farmer",
    MINER: "miner",
    ENEMY: "enemy",
    WARRIOR: "warrior",
    SCIENTIST: "scientist",
    CUSTOM: "custom",
    RANDOM: "random"
  },
  ALL_RESOURCES: {
    FOOD,
    POPULATION,
    CREDIT,
    MINERAL,
    ENERGY
  },
  INIT_CIV_RESOURCES: [
    { ...FOOD, ...RESOURCE_INIT },
    { ...CREDIT, ...RESOURCE_INIT },
    { ...POPULATION, ...RESOURCE_INIT },
    { ...MINERAL, ...RESOURCE_INIT },
    { ...ENERGY }
  ],
  INIT_MARKET_RESOURCES: [
    { ...FOOD, qty: 1000, max: 10000 },
    { ...CREDIT, qty: 100000, max: 500000 },
    { ...MINERAL, qty: 1000, max: 10000 },
    { ...ENERGY, qty: 10, max: 10000 }
  ],
  RESOURCE_VALUES: {
    population: 0,
    credits: 5,
    food: 10,
    mineral: 30,
    energy: 50
  },
  CIV_FACTORIES: {
    FARMER: {
      resources: [
        {
          ...FOOD,
          qty: 300,
          max: 2000
        },
        {
          ...MINERAL,
          qty: 0,
          max: 100
        },
        {
          ...CREDIT,
          max: 1000
        }
      ],
      buildings: [
        {
          name: "farm",
          description: "Produces food",
          qty: 1,
          max: 100
        }
      ]
    },
    MINER: {
      resources: [
        {
          ...MINERAL,
          qty: 300,
          max: 2000
        },
        {
          ...FOOD,
          qty: 0,
          max: 100
        },
        {
          ...CREDIT,
          max: 1000
        }
      ],
      buildings: [
        {
          name: "mine",
          description: "Mine description",
          qty: 1,
          max: 10
        },
        { name: "Quarry", description: "Quarry description", qty: 1, max: 10 }
      ]
    },
    ENEMY: {
      resources: [
        {
          ...CREDIT,
          qty: 1000,
          max: 1000
        }
      ],
      buildings: [
        {
          name: "barracks",
          description: "barracks description",
          qty: 1,
          max: 10
        }
      ]
    }
  }
};
