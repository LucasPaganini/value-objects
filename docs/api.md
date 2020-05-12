# @lucaspaganini/value-objects API

## VOInteger

Function to create an integer number value object. Returns a class that accepts a (integer) number for instantiation and returns that number when `valueOf()` is called.

> NOTE: If you want to accept floating point numbers and convert them to integers, you can use [`VOFloat()`](#vofloatoptions) and set the `precision` option to `0`.

```typescript
import { VOInteger } from '@lucaspaganini/value-objects';

class MyInteger extends VOInteger() {}

const int1 = new MyInteger(5); // OK
int1.valueOf(); // 5

const int2 = new MyInteger(5.0); // OK
int2.valueOf(); // 5

const int3 = new MyInteger(5.5); // Runtime error: Not an integer
```

### VOIntegerOptions

You can customize the behaviour of `VOInteger()` passing options to it. Valid options are:

| Option | Description                                                        | Rules                                       |
| :----- | :----------------------------------------------------------------- | :------------------------------------------ |
| min    | Minimum inclusive acceptable value (doesn't need to be an integer) | Number, can't be bigger than `options.max`  |
| max    | Maximum inclusive acceptable value (doesn't need to be an integer) | Number, can't be smaller than `options.min` |

```typescript
import { VOInteger } from '@lucaspaganini/value-objects';

class NaturalNumber extends VOInteger({ min: 0 }) {} // OK
new NaturalNumber(0); // OK
new NaturalNumber(1000000); // Ok
new NaturalNumber(-1); // Runtime error: Too small
new NaturalNumber(1.5); // Runtime error: Not an integer

class MyFloatRangeInteger extends VOInteger({ min: -100.5, max: 100.5 }) {} // OK
new MyFloatRangeInteger(-100); // OK
new MyFloatRangeInteger(100); // Ok
new MyFloatRangeInteger(-101); // Runtime error: Too small
new MyFloatRangeInteger(101); // Runtime error: Too big

class MyInvalidInteger extends VOInteger({ min: 100, max: -100 }) {} // Runtime error: Invalid logic (options.min should not be bigger than options.max)
```

## VOFloat

Function to create a floating point number value object. Returns a class that accepts a number for instantiation and returns that number when `valueOf()` is called.

```typescript
import { VOFloat } from '@lucaspaganini/value-objects';

class MyFloat extends VOFloat() {}

const float1 = new MyFloat(5); // OK
float1.valueOf(); // 5

const float2 = new MyFloat(5.0); // OK
float2.valueOf(); // 5

const float3 = new MyFloat(5.5); // OK
float3.valueOf(); // 5.5

const float4 = new MyFloat('5.5'); // Compilation error: Not a number
```

### VOFloatOptions

You can customize the behaviour of `VOFloat()` passing options to it. It accepts `VOInteger` options and some others. Valid options are:

| Option        | Description                                                                                      | Rules                                       |
| :------------ | :----------------------------------------------------------------------------------------------- | :------------------------------------------ |
| precision     | Floating point precision                                                                         | Number (integer), >=0                       |
| precisionTrim | Trimming strategy for numbers with more precision than `options.precision` (defaults to "round") | "ceil", "round" or "floor"                  |
| min           | Minimum inclusive acceptable value (doesn't need to be an integer)                               | Number, can't be bigger than `options.max`  |
| max           | Maximum inclusive acceptable value (doesn't need to be an integer)                               | Number, can't be smaller than `options.min` |

> WARNING: The precision trim strategy is used before checking the min and max, that could lead to runtime errors due to trimmed values not passing the min-max range. Eg: `0.1234` with `precision 2` and `precisionTrim "ceil"` will be `0.13`.

```typescript
import { VOFloat } from '@lucaspaganini/value-objects';

class PositiveNumber extends VOFloat({ min: 0 }) {} // OK
new PositiveNumber(0); // OK
new PositiveNumber(1000000); // Ok
new PositiveNumber(-1); // Runtime error: Too small
new PositiveNumber(1.5); // OK

class FloatWithValidRange extends VOFloat({ min: -100.5, max: 100.5 }) {} // OK
new FloatWithValidRange(-100); // OK
new FloatWithValidRange(100); // Ok
new FloatWithValidRange(-100.5); // OK
new FloatWithValidRange(100.5); // Ok
new FloatWithValidRange(-101); // Runtime error: Too small
new FloatWithValidRange(101); // Runtime error: Too big

class FloatWithInvalidRange extends VOFloat({ min: 100, max: -100 }) {} // Runtime error: Invalid logic (options.min should not be bigger than options.max)

class LimitedPrecisionFloat extends VOFloat({
  precision: 5,
  precisionTrim: 'round'
}) {} // OK
const limited1 = new LimitedPrecisionFloat(0.123456789);
limited1.valueOf(); // 0.12346 => Only 5 precision digits and it's rounded

class LimitedPrecisionFloatWithRange extends VOFloat({
  min: 1,
  max: 999.999,
  precision: 2,
  precisionTrim: 'ceil'
}) {} // OK
new LimitedPrecisionFloatWithRange(-100); // Runtime error: Too small
new LimitedPrecisionFloatWithRange(100); // Ok
new LimitedPrecisionFloatWithRange(0.9999); // OK (rounds to 1 and passes the minimum)
new LimitedPrecisionFloatWithRange(999.999); // Runtime error: Too big (rounds to 1000 and doesn't pass the maximum)
const limited2 = new LimitedPrecisionFloatWithRange(0.123456789);
limited2.valueOf(); // 0.13 => Only 2 precision digits and it's rounded up because we're using "ceil"
```

## VOString

## VOSet

## VOOptional

## VOArray

## VOObject

## VOAny

## Functional helpers

## Errors
