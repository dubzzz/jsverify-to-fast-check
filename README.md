# jsverify-to-fast-check

`jsverify-to-fast-check` provides a set of tools and helpers to help [JSVerify](https://github.com/jsverify/jsverify) users to migrate to [fast-check](https://github.com/dubzzz/fast-check).

## Why?

According to the issue [jsverify#299](https://github.com/jsverify/jsverify/issues/299), JSVerify is looking to new maintainers to keep the repository up-to-date.

As a huge part of property based lies on generators and properties, this library is designed to help users plug their existing generators within fast-check without any changes.

## How to setup?

```bash
# you may already have jsverify and/or fast-check setup in your project
npm install --save-dev jsverify fast-check jsverify-to-fast-check
```

## Example

Because an example will tell more than a long documentation, here is an example of how you might use `jsverify-to-fast-check` towards move smoothly to fast-check.

```ts
import { jsc2fc } from "jsverify-to-fast-check";
import * as jsc from "jsverify";
import * as fc from "fast-check";

// Here is an old arbitrary you prefer not to migrate for the moment
const jscArbitrary = jsc.bless({
  generator: jsc.generator.bless(() => {
    switch (jsc.random(0, 2)) {
      case 0:
        return "foo";
      case 1:
        return "bar";
      case 2:
        return "quux";
    }
  })
});

// It can easily converted into an arbitrary for fast-check using jsc2fc
const fcArbitrary = jsc2fc(jscArbitrary);

// ...it can now:
// - be used in fc.assert/fc.check,
// - supports map, filter, chain
// - can be composed with fc.record, fc.array...

// ... it also preserves the shrinking capabilities of the jsverify arbitrary (if any)
```

## Compatibility

Supports any version of `fast-check`.

Supports at least the version `jsverify@0.8.4`.
