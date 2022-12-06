const { validateNumber } = require("../../../../src/classes/common/validations");

describe("validations - module", () => {
  describe("validateNumber - method", () => {
    it("should return a number", () => {
      expect(validateNumber(1)).toBe(1);
    });
    it("should throw an error if the argument is not a number", () => {
      try {
        validateNumber("w");
      } catch (error) {
        expect(error.message).toBe('"w" is not a number');
      }
    });
  });
});
