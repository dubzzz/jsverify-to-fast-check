import * as fc from "fast-check";
import * as prand from "pure-rand";
import { shuffle } from "../src/fisher-yates";

test("should have the same elements before and after", () =>
  fc.assert(
    fc.property(fc.string(), fc.integer(), (data, seed) => {
      // Arrange.
      const mrng = new fc.Random(prand.mersenne(seed));

      // Act.
      const shuffled = shuffle(mrng, data);

      // Assert.
      expect(shuffled).toHaveLength(data.length);
      expect(shuffled.split("").sort()).toEqual(data.split("").sort());
    })
  ));
