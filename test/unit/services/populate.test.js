const { getPopulateOptions } = require("../../../src/services/populate");

describe("Populate Service", () => {
  describe("getPopulateOptions", () => {
    it("should return populate array with paths across multiple levels if the field has multiple levels", async () => {
      const populate = getPopulateOptions(["scene.characters.book"]);
      expect(populate).toHaveLength(1);
      expect(populate).toEqual(
        expect.arrayContaining([
          {
            path: "scene",
            populate: [
              {
                path: "characters",
                populate: [{ path: "book", populate: [] }]
              }
            ]
          }
        ])
      );
    });
  });
});
