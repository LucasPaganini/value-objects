# @lucaspaganini/value-objects API

## VOInteger

Function to create an Integer value object. Returns a class that accepts a number for instantiation and returns that number when `valueOf()` is called.

```typescript
import { VOInteger } from '@lucaspaganini/value-objects';

class MyInteger extends VOInteger() {}

const int1 = new MyInteger(5); // OK
const int2 = new MyInteger(5.0); // OK
const int3 = new MyInteger(5.5); // Runtime error: Not an integer

int1.valueOf(); // 5
int2.valueOf(); // 5
```

### VOIntegerOptions

You can customize the behaviour of `VOInteger()` passing options to it. Valid options are:

| Option | Description                                                        |
| :----- | :----------------------------------------------------------------- |
| min    | Minimum inclusive acceptable value (doesn't need to be an integer) |
| max    | Maximum inclusive acceptable value (doesn't need to be an integer) |

> NOTE: `VOInteger()` will throw a [`LogicError`](#logic-error) if `options.min` is bigger than `options.max`.

```typescript
import { VOInteger, VOIntegerOptions } from '@lucaspaganini/value-objects';

const options1: VOIntegerOptions = { min: 0 };
const options2: VOIntegerOptions = { min: -100.5, max: 100.5 };
const options3: VOIntegerOptions = { min: 100, max: -100 };

class NaturalNumber extends VOInteger(options1) {} // OK
class MyFloatRangeInteger extends VOInteger(options2) {} // OK
class MyInvalidInteger extends VOInteger(options3) {} // Runtime error: Invalid logic (options.min should not be bigger than options.max)

const natural1 = new NaturalNumber(0); // OK
const natural2 = new NaturalNumber(1000000); // Ok
const natural3 = new NaturalNumber(-1); // Runtime error: Too small
const natural4 = new NaturalNumber(1.5); // Runtime error: Not an integer

const range1 = new MyFloatRangeInteger(-100); // OK
const range2 = new MyFloatRangeInteger(100); // Ok
const range3 = new MyFloatRangeInteger(-101); // Runtime error: Too small
const range4 = new MyFloatRangeInteger(101); // Runtime error: Too big
```

## VOFloat

## VOString

## VOSet

## VOOptional

## VOArray

## VOObject

## VOAny

## Functional helpers

## Errors
