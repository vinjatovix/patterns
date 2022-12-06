const { INIT_MARKET_RESOURCES, RESOURCE_VALUES } = require("../settings");
const { Civilization } = require("./Civilization");
const { CivilizationBuilder } = require("./Builder");

class ValueMapper {
  constructor() {
    this.values = RESOURCE_VALUES;
  }
  getUniversalValue(resource) {
    return this.values[resource];
  }
  convertToUniversalValue(resource, qty) {
    return this.values[resource] * qty;
  }
  convertFromUniversalValue(resource, universalValue) {
    return universalValue / this.values[resource];
  }
  calculateExchangeCost(resource, qty, exchange, multiplier = 1) {
    const universalValue = this.convertToUniversalValue(resource, qty);
    const exchangeCost = universalValue * multiplier;
    return this.convertFromUniversalValue(exchange, exchangeCost);
  }
}

class Market extends Civilization {
  constructor() {
    super("Market", "MarketMaker");
    const instance = this.constructor.instance;
    if (instance) {
      return instance;
    }
    this.constructor.instance = this;
    this.multiplier = 1.5;
    this.tax = 0.5;
    this.valueMapper = new ValueMapper();
  }
  setMultiplier(multiplier) {
    this.multiplier = multiplier;
    return this.multiplier;
  }
  getMultiplier() {
    return this.multiplier;
  }
  setTax(tax) {
    this.tax = tax;
    return this.tax;
  }
  getTax() {
    return this.tax;
  }
  _getVolume(resource) {
    const volume = this.resources.getPercentage(resource);
    return volume;
  }

  calculateMultiplier(resource) {
    const volume = this._getVolume(resource);
    const resto = 1 - volume;
    const multiplier = (resto >= 0.001 ? resto : 0.001) * this.multiplier;
    return multiplier;
  }
  calculateTax(resource) {
    const volume = this._getVolume(resource);
    const resto = 1 - volume;
    const tax = (resto >= 0.001 ? resto : 0.001) * this.tax;
    return tax;
  }

  makeTransaction(demand, buyer, seller) {
    return new CivilizationTransaction({
      buyer,
      seller,
      demand
    }).executeTransaction();
  }
  makeMarketTransaction(demand, buyer) {
    return new MarketTransaction({
      buyer,
      seller: this,
      demand
    }).executeTransaction();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      multiplier: this.multiplier,
      tax: this.tax
    };
  }
}

class MarketBuilder extends CivilizationBuilder {
  constructor(civilization = new Market()) {
    super(civilization);
  }
  get settings() {
    return new MarketSettingsBuilder({ civilization: this.civilization });
  }
  build() {
    return this.civilization;
  }
}

class MarketSettingsBuilder extends MarketBuilder {
  constructor({ civilization }) {
    super(civilization);
  }
  multiplier(multiplier) {
    this.civilization.setMultiplier(multiplier);
    return this;
  }
  tax(tax) {
    this.civilization.setTax(tax);
    return this;
  }
}

class Transaction {
  constructor({ buyer, seller, demand, market = new Market() }) {
    this.buyer = buyer;
    this.seller = seller;
    this.demand = demand;
    this.market = market;
  }
  calculateHighestMultiplier(resource1, resource2) {
    return Math.max(this.market.calculateMultiplier(resource1), this.market.calculateMultiplier(resource2));
  }

  getTransactionCost(key, exchange, qty) {
    const multiplier = this.calculateHighestMultiplier(key, exchange);
    const exchangedResourceCost = this.market.valueMapper.calculateExchangeCost(key, qty, exchange, multiplier);
    return Math.floor(exchangedResourceCost);
  }
  getTransactionTax(key, qty) {
    const tax = this.market.calculateTax(key);
    return Math.floor(qty * tax);
  }
  toString() {
    return `Transaction: ${this.buyer.name} and ${this.seller.name} exchanged resources`;
  }
  toJSON() {
    return {
      buyer: this.buyer.name,
      seller: this.seller.name,
      demand: this.demand
    };
  }

  executeTransaction({ validator, costCalculator, processor, transaction }) {
    try {
      const cost = costCalculator(transaction);
      validator && validator(transaction, cost);
      processor && processor(transaction, cost);
      return this.toString();
    } catch (error) {
      return error.message;
    }
  }
}

class CivilizationTransaction extends Transaction {
  constructor({ buyer, seller, demand, market = new Market() }) {
    super({ buyer, seller, demand });
    this.market = market;
    this.bill = {};
  }
  _calculateExchangeToll(transaction) {
    const toll = {};
    for (const key of Object.keys(transaction.demand)) {
      const { qty, symbol } = transaction.demand[key];
      const tax = transaction.getTransactionTax(key, qty);
      toll[key] = [qty, symbol, market.valueMapper.calculateExchangeCost(key, qty, symbol), tax];
    }
    return toll;
  }

  _validateTransaction(transaction, toll) {
    for (const [key, value] of Object.entries(toll)) {
      const [qty, symbol, cost] = value;
      if (transaction.seller.resources.getQty(key) < qty) {
        throw new Error(`${transaction.seller.getName()} does not have enough ${key}`);
      }
      if (cost > transaction.buyer.resources.getQty(symbol)) {
        throw new Error(`${transaction.buyer.getName()} has not enough ${symbol}`);
      }
    }
  }
  _process(transaction, toll) {
    for (const [key, value] of Object.entries(toll)) {
      const [qty, symbol] = value;
      transaction.seller.resources.remove(key, qty);
      const demandTax = transaction.getTransactionTax(key, qty);
      transaction.market.resources.add(key, demandTax);
      transaction.buyer.resources.add(key, qty - demandTax);

      const { exchangedResourceCost: cost, toll } = transaction._getExchangeCostAndToll(key, qty, symbol);
      transaction.buyer.resources.remove(symbol, cost);
      transaction.market.resources.add(symbol, toll);
      transaction.seller.resources.add(symbol, cost - toll);
    }
  }
  _getExchangeCostAndToll(key, qty, symbol) {
    const exchangedResourceCost = this.market.valueMapper.calculateExchangeCost(key, qty, symbol);
    const toll = this.getTransactionTax(symbol, exchangedResourceCost);
    return { exchangedResourceCost, toll };
  }
  executeTransaction() {
    return super.executeTransaction({
      validator: this._validateTransaction,
      costCalculator: this._calculateExchangeToll,
      processor: this._process,
      transaction: this
    });
  }
}

class MarketTransaction extends Transaction {
  constructor({ buyer, seller, demand }) {
    super({ buyer, seller, demand });
  }

  _calculateExchangeCost(transaction) {
    const cost = {};
    for (const key of Object.keys(transaction.demand)) {
      const { qty, symbol } = transaction.demand[key];
      cost[key] = transaction.getTransactionCost(key, symbol, qty);
    }
    return cost;
  }

  _validateTransaction(transaction, cost) {
    for (const key of Object.keys(transaction.demand)) {
      const { qty, symbol } = transaction.demand[key];
      if (qty > transaction.seller.resources.getQty(key)) {
        throw new Error(`${transaction.seller.getName()} does not have enough ${key}`);
      }
      const exchangeCost = cost[key];
      if (exchangeCost > transaction.buyer.resources.getQty(symbol)) {
        throw new Error(`${transaction.buyer.getName()} has not enough ${symbol}`);
      }
    }
  }

  _process(transaction, cost) {
    for (const key of Object.keys(transaction.demand)) {
      const { qty, symbol } = transaction.demand[key];
      transaction.seller.resources.remove(key, qty);
      transaction.buyer.resources.add(key, qty);
      const exchangeCost = cost[key];

      transaction.buyer.resources.remove(symbol, exchangeCost);
      transaction.seller.resources.add(symbol, exchangeCost);
    }
  }

  executeTransaction() {
    return super.executeTransaction({
      costCalculator: this._calculateExchangeCost,
      validator: this._validateTransaction,
      processor: this._process,
      transaction: this
    });
  }
}

const market = new MarketBuilder().settings
  .tax(0.5)
  .multiplier(5)
  .resources.newInstances(INIT_MARKET_RESOURCES)
  .build();

module.exports = market;
