import { buildRngState } from "../src/build-rng-state";
import { shuffle } from "../src/fisher-yates";

import { Random } from "fast-check";

jest.mock("../src/fisher-yates");
jest.mock("fast-check");

beforeEach(() => {
  jest.clearAllMocks();
});

test("should call mrng to build the state", () => {
  // Arrange.
  const nextInt = jest.fn();
  (Random as any).mockImplementation(() => ({ nextInt }));
  nextInt.mockReturnValueOnce(0xa);
  nextInt.mockReturnValueOnce(0xf);
  (shuffle as any).mockReturnValueOnce("0123456789abcdef");

  // Act.
  const mrng = new (Random as any)();
  const state = buildRngState(mrng);

  // Assert.
  expect(state).toBe("af0123456789abcdef");
  expect(nextInt).toHaveBeenCalledTimes(2);
  expect(shuffle).toHaveBeenCalledWith(mrng, "0123456789abcdef");
  expect(shuffle).toHaveBeenCalledTimes(1);
});
