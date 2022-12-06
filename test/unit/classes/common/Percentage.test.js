const { Percentage } = require("../../../../src/classes/common");

describe("Percentage", () => {
  it("should create a new percentage", () => {
    const percentage = new Percentage(50);

    expect(percentage.toString()).toBe("50%");
    expect(percentage.valueOf()).toBe(0.5);
  });

  it("should return 0.001 if value === 0", () => {
    const percentage = new Percentage(0);

    expect(percentage.valueOf()).toBe(0.001);
  });
});
