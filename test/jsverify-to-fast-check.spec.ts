import { jsc2fc } from "../src/jsverify-to-fast-check";
import * as fc from "fast-check";
import * as jsc from "jsverify";
import * as prand from "pure-rand";

test("[e2e] should produce a valid and stable arbitrary for fast-check", () => {
  // Arrange.
  const jscArbitrary = jsc.asciinestring;
  const fcArbitrary = jsc2fc(jscArbitrary);
  const fcParams = { seed: 42, numRuns: 3 };
  const expectedValues = ["V", "_.)y(", "`Z%#"];

  // Act / Assert.
  expect(fc.sample(fcArbitrary, fcParams)).toEqual(expectedValues);
  expect(fc.sample(fcArbitrary, fcParams)).toEqual(expectedValues);
});

test("[e2e] should preserve shrinking capabilities", () => {
  // Arrange.
  const jscArbitrary = jsc.asciinestring;
  const fcArbitrary = jsc2fc(jscArbitrary);

  const mrng = new fc.Random(prand.mersenne(42));
  const g = fcArbitrary.generate(mrng);

  // Act.
  const fcShrinks = [...g.shrink()].map(s => s.value);
  const jscShrinks = (jscArbitrary.shrink!(g.value) as any).toArray();

  // Assert.
  expect(fcShrinks).toEqual(jscShrinks);
  expect(fcShrinks).not.toHaveLength(0); // sanity check
});

test("[e2e] should preserve deep shrinking capabilities", () => {
  // Arrange.
  const jscArbitrary = jsc.asciinestring;
  const fcArbitrary = jsc2fc(jscArbitrary);

  const mrng = new fc.Random(prand.mersenne(42));
  const g = fcArbitrary.generate(mrng);
  const gDeeper = g.shrink().getNthOrLast(0)!;

  // Act.

  const fcShrinks = [...gDeeper.shrink()].map(s => s.value);
  const jscShrinks = (jscArbitrary.shrink!(gDeeper.value) as any).toArray();

  // Assert.
  expect(fcShrinks).toEqual(jscShrinks);
  expect(gDeeper.value).not.toEqual(g.value); // sanity check
  expect(fcShrinks).not.toHaveLength(0); // sanity check
});
