import { Arbitrary as JSCArbitrary, random as jscRandom } from "jsverify";
import {
  Arbitrary as FCArbitrary,
  Shrinkable as FCShrinkable,
  Random as FCRandom,
  Stream as FCStream
} from "fast-check";
import { buildRngState } from "./build-rng-state";

/** @hidden */
class WrappedArbitrary<T> extends FCArbitrary<T> {
  private static readonly JSCSize = 50;

  constructor(readonly jscArbitrary: JSCArbitrary<T>) {
    super();
  }

  private shrink(v: T): FCStream<FCShrinkable<T>> {
    if (!this.jscArbitrary.shrink) return FCStream.nil();
    const wrapped = this;
    function* g(it: Iterable<T>): IterableIterator<FCShrinkable<T>> {
      for (const e of it) yield wrapped.toShrinkable(e);
    }
    // WARN: .shrink of jsverify has wrong typings
    return new FCStream(g((this.jscArbitrary.shrink(v) as any).toArray()));
  }

  private toShrinkable(v: T): FCShrinkable<T> {
    return new FCShrinkable(v, () => this.shrink(v));
  }

  generate(mrng: FCRandom): FCShrinkable<T> {
    // compute a seed
    // seed jsverify generator
    (jscRandom as any).setStateString(buildRngState(mrng));
    // generate the value and link it with its shrinker
    return this.toShrinkable(
      this.jscArbitrary.generator(WrappedArbitrary.JSCSize)
    );
  }
}

export const jsc2fc = <T>(jscArbitrary: JSCArbitrary<T>): FCArbitrary<T> => {
  return new WrappedArbitrary(jscArbitrary);
};
