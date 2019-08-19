import { Random as FCRandom } from "fast-check";

/**
 * Shuffle a string given a random generator from fast-check
 *
 * @param mrng Random number generator provided by fast-check
 * @param s String to be randomly shuffled
 */
export const shuffle = (mrng: FCRandom, s: string): string => {
  // Fisher-Yates
  const raw = s.split("");
  for (let i = raw.length - 1; i >= 1; --i) {
    const j = mrng.nextInt(0, i);
    const temp = raw[i];
    raw[i] = raw[j];
    raw[j] = temp;
  }
  return raw.join("");
};
