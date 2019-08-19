import { Random as FCRandom } from "fast-check";
import { shuffle } from "./fisher-yates";

/**
 * @hidden
 *
 * Build a valid RNG State that can be consumed by rc4 lib
 * to seed arbitraries owned by jsverify
 */
export const buildRngState = (mrng: FCRandom): string => {
  // Example of state: 074e9b5f037a8c21d6
  const i = mrng.nextInt(0x0, 0xf);
  const j = mrng.nextInt(0x0, 0xf);
  const s = shuffle(mrng, "0123456789abcdef");
  return i.toString(16) + j.toString(16) + s;
};
