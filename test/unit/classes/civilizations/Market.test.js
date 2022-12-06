const { market, CivilizationFactory } = require("../../../../src/classes/civilizations");

describe("Market", () => {
  it("should be the marketMaker", () => {
    expect(market.getName()).toBe("Market");
    expect(market.getDescription()).toBe("MarketMaker");
  });
  it("should return the json of the market", () => {
    expect(market.toJSON()).toMatchObject({
      description: expect.any(String),
      name: expect.any(String),
      tax: expect.any(Number),
      multiplier: expect.any(Number),
      resources: expect.any(Object)
    });
  });
  it("should return the string of the market", () => {
    expect(market.toString()).toBe(
      `\nID:${market.getId()}\nName: Market\nDescription: MarketMaker\nRESOURCES:\nID:${market.resources.getId(
        "food"
      )}\nName: food\nDescription: Not tasty, but it keeps you alive 10% 1000/10000\nID:${market.resources.getId(
        "credits"
      )}\nName: credits\nDescription: Can't buy happiness, but you can buy stuff 20% 100000/500000\nID:${market.resources.getId(
        "mineral"
      )}\nName: mineral\nDescription: Can be used to build stuff 10% 1000/10000\nID:${market.resources.getId(
        "energy"
      )}\nName: energy\nDescription: Energy is the lifeblood of the civilization 0.1% 10/10000`
    );
  });
  it("should have a multiplier", () => {
    expect(market.getMultiplier()).not.toBeNaN();
  });
  it("should set a new multiplier", () => {
    expect(market.setMultiplier(2)).toBe(2);
  });
  it("should have a tax", () => {
    expect(market.getTax()).not.toBeNaN();
  });
  it("should set a new tax", () => {
    expect(market.setTax(0.3)).toBe(0.3);
  });
  it("should return the json of available resources", () => {
    const resourceSpec = {
      description: expect.any(String),
      max: expect.any(Number),
      name: expect.any(String),
      qty: expect.any(Number),
      volume: expect.any(Number)
    };
    const resources = {
      credits: resourceSpec,
      food: resourceSpec,
      mineral: resourceSpec,
      energy: resourceSpec
    };
    expect(market.resources.toJSON()).toMatchObject(resources);
  });
  it("should return the universal value of food", () => {
    expect(market.valueMapper.getUniversalValue("food")).toBe(10);
  });
  it("should convert 100 mineral to universal value", () => {
    expect(market.valueMapper.convertToUniversalValue("mineral", 100)).toBe(3000);
  });
  it("should convert 3000 universal value to mineral", () => {
    expect(market.valueMapper.convertFromUniversalValue("mineral", 3000)).toBe(100);
  });
  it("should convert calculate the exchange cost of 10 food to credits", () => {
    expect(market.valueMapper.calculateExchangeCost("food", 10, "credits")).toBe(20);
  });
  it("should calculate the current multiplier by stock for a marketTransaction", () => {
    market.setMultiplier(2);
    market.resources.remove("food", market.resources.getMax("food"));
    expect(market.calculateMultiplier("food")).toBe(2);
    market.resources.add("food", market.resources.getMax("food"));
    expect(market.calculateMultiplier("food")).toBe(0.002);
  });
  it("should calculate the current tax by stock for a civilizationTransaction", () => {
    market.setTax(0.3);
    market.resources.remove("food", market.resources.getMax("food"));
    expect(market.calculateTax("food")).toBe(0.3);
    market.resources.add("food", market.resources.getMax("food"));
    expect(market.calculateTax("food")).toBe(0.0003);
  });
  it("should make a marketTransaction with a civilization", () => {
    const civilization = CivilizationFactory.create("farmer");
    market.resources.remove("food", market.resources.getMax("food"));
    market.setMultiplier(2);
    expect(civilization.resources.getQty("food")).toBe(300);
    expect(civilization.resources.getQty("credits")).toBe(0);
    expect(market.resources.getQty("food")).toBe(0);
    expect(market.resources.getQty("credits")).toBe(100000);

    market.makeMarketTransaction({ credits: { qty: 100, symbol: "food" } }, civilization);

    expect(civilization.resources.getQty("food")).toBe(200);
    expect(civilization.resources.getQty("credits")).toBe(100);
    expect(market.resources.getQty("food")).toBe(100);
    expect(market.resources.getQty("credits")).toBe(99900);
  });
  it("should make a civilizationTransaction between two a civilizations and tax both resources by stock", () => {
    const civilization1 = CivilizationFactory.create("farmer");
    const civilization2 = CivilizationFactory.create("miner");
    market.resources.remove("food", market.resources.getMax("food"));
    market.setTax(0.3);
    expect(civilization1.resources.getQty("food")).toBe(300);
    expect(civilization1.resources.getQty("mineral")).toBe(0);
    expect(civilization2.resources.getQty("mineral")).toBe(300);
    expect(civilization2.resources.getQty("food")).toBe(0);
    expect(market.resources.getQty("food")).toBe(0);
    expect(market.resources.getQty("mineral")).toBe(1000);

    market.makeTransaction({ mineral: { qty: 100, symbol: "food" } }, civilization1, civilization2);

    expect(civilization1.resources.getQty("food")).toBe(0);
    expect(civilization1.resources.getQty("mineral")).toBe(73);
    expect(civilization2.resources.getQty("food")).toBe(100);
    expect(civilization2.resources.getQty("mineral")).toBe(200);
    expect(market.resources.getQty("food")).toBe(90);
    expect(market.resources.getQty("mineral")).toBe(1027);
  });
  it("should return if seller doesn't trade the resources", () => {
    const civilization = CivilizationFactory.create("farmer");
    expect(market.makeMarketTransaction({ almacigas: { qty: 100, symbol: "mineral" } }, civilization)).toBe(
      "resources: almacigas does not exist"
    );
  });
  it("should return if seller doesn't have enough the resources", () => {
    const civilization = CivilizationFactory.create("farmer");
    const key = "food";
    expect(market.makeMarketTransaction({ [key]: { qty: 100000, symbol: "mineral" } }, civilization)).toBe(
      `Market does not have enough ${key}`
    );
  });
  it("should return if buyer doesn't have enough exchange of the resources", () => {
    const civilization = CivilizationFactory.create("farmer");
    const symbol = "mineral";
    market.resources.add("food", 100);
    expect(market.makeMarketTransaction({ food: { qty: 100, symbol } }, civilization)).toBe(
      `${civilization.getName()} has not enough ${symbol}`
    );
  });
  it("should return if seller doesn't trade the resources in a civilization transaction", () => {
    const civilization1 = CivilizationFactory.create("farmer");
    const civilization2 = CivilizationFactory.create("miner");
    expect(market.makeTransaction({ almacigas: { qty: 100, symbol: "mineral" } }, civilization1, civilization2)).toBe(
      "resources: almacigas does not exist"
    );
  });
  it("should return if seller doesn't have enough the resources in a civilization transaction", () => {
    const civilization1 = CivilizationFactory.create("farmer");
    const civilization2 = CivilizationFactory.create("miner");
    expect(market.makeTransaction({ mineral: { qty: 100000, symbol: "food" } }, civilization1, civilization2)).toBe(
      "Miner does not have enough mineral"
    );
  });
  it("should return if buyer doesn't have enough exchange of the resources in a civilization transaction", () => {
    const civilization1 = CivilizationFactory.create("farmer");
    civilization1.resources.remove("food", civilization1.resources.getMax("food"));
    const civilization2 = CivilizationFactory.create("miner");
    expect(market.makeTransaction({ mineral: { qty: 100, symbol: "food" } }, civilization1, civilization2)).toBe(
      "Farmer has not enough food"
    );
  });
});
