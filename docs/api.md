# @lucaspaganini/value-objects API

## [ValueObject](../src/core/value-object.ts)

This is the base interface that drives this whole library. All the utility functions, be it `VOInteger()`, `VOArray()` or `VOSet()`, they all return classes that comply with the `ValueObject` interface.

```typescript
interface ValueObject<Raw> {
  valueOf(): Raw;
}
```

The choice for `valueOf()` is **super** important because it allows us to leverage the way that JavaScript works. Every Object in JavaScript implements `valueOf()`, it's a native thing. That means `Date`, `Boolean`, `Number`, and _many many many other_ JavaScript classes comply with this library.

### [ValueObjectConstructor](../src/core/value-object.ts)

Another important interface is the `ValueObjectConstructor`. It ensures that the class constructor complies with what we expect. PS: yes, most JavaScript class constructors also comply with this interface.

```typescript
interface ValueObjectContructor<Raw = any, RawInit = Raw> {
  new (r: RawInit): ValueObject<Raw>;
}
```

`RawInit` is the type of the value passed to the constructor and `Raw` is the type we return when calling `valueOf()`. In many casØes, they are the same, but there are special cases when you want them to be different. `Number` is a great example, if you call `valueOf()`, you'll always get a `number`, but when constructing, [you can pass it a `string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number).

## [VOInteger](../src/core/integer.ts)

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

### [VOIntegerOptions](../src/core/integer.ts)

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

## [VOFloat](../src/core/float.ts)

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

### [VOFloatOptions](../src/core/float.ts)

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

## [VOString](../src/core/string.ts)

Function to create a formatted string value object. Returns a class that accepts a string for instantiation and returns that string when `valueOf()` is called. If you have a list of strings and the value **must** be one of the strings, you should use `VOSet`.

```typescript
import { VOString } from '@lucaspaganini/value-objects';

class UselessString extends VOString() {}

const string = new UselessString('abc'); // OK
string.valueOf(); // "abc"

new UselessString(5); // Compilation error: Not a string
```

### [VOStringOptions](../src/core/string.ts)

To make it useful, customize it's behaviour using the options:

| Option    | Description                                                  | Rules                                                            |
| :-------- | :----------------------------------------------------------- | :--------------------------------------------------------------- |
| trim      | Whether it should trim the raw string (defaults to `false`)  | Boolean                                                          |
| pattern   | Regular expression pattern for the raw string after trimming | RegExp                                                           |
| minLength | Minimum inclusive acceptable length after trimming           | Number (integer), >=0, can't be bigger than `options.maxLength`  |
| maxLength | Maximum inclusive acceptable length after trimming           | Number (integer), >=0, can't be smaller than `options.minLength` |

```typescript
import { VOString } from '@lucaspaganini/value-objects';

class SuperShortString extends VOString({
  trim: true,
  minLength: 4,
  maxLength: 8
}) {}
new SuperShortString('abcd'); // OK
new SuperShortString(' ab '); // Runtime error: Too short (the length after trimming is 2 but the minLength is 4)
new SuperShortString('123456789'); // Runtime error: Too long (the length after trimming is 9 but the maxLength is 8)

const EMAIL_PATTERN =
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
class Email extends VOString({
  trim: true,
  maxLength: 256,
  pattern: EMAIL_PATTERN
}) {}
new Email('test@example.com'); // OK
new Email('test.example.com'); // Runtime error: Value doesn't match pattern

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]*$/; // One lowercase, one uppercase, one number
class Password extends VOString({
  trim: false,
  minLength: 8,
  maxLength: 256,
  pattern: PASSWORD_PATTERN
}) {}
new Password('Secret123'); // OK
new Password('abcd1234'); // Runtime error: Value doesn't match pattern
new Password(' AB12ab '); // Runtime error: Too short (the length after trimming is 6 but the minLength is 8)

const PASSWORD_BLACKLIST = ['Secret123', 'abc123ABC'];
class WhitelistedPassword extends Password {
  constructor(raw: string) {
    super(raw);
    const trimmedRaw = this.valueOf();
    if (PASSWORD_BLACKLIST.includes(trimmedRaw))
      throw Error('This password is blacklisted');
  }
}
new WhitelistedPassword('Secret123'); // Runtime error: This password is blacklisted
new WhitelistedPassword('123Secret'); // OK
```

## [VOSet](../src/core/set.ts)

Function to create a set of strings, booleans or numbers. Returns a class that accepts either: (i) a string, boolean or number, or (ii) the literal types of the set values (the expected type depends on the types of the set values and the `options.strict` flag) for instantiation and returns that value when `valueOf()` is called.

```typescript
import { VOSet } from '@lucaspaganini/value-objects';

class TestSet extends VOSet([123, 'abc']) {}
new TestSet('abc'); // OK
new TestSet(''); // Runtime error: Not in set
new TestSet(1); // Runtime error: Not in set
new TestSet(false); // Compilation error: Expects string | number
```

Each value in the set needs to be `Setable`. To be `Setable` is to be a `number`, `string` or `boolean`.

```typescript
type Setable = string | number | boolean;
```

### [VOSetOptions](../src/core/set.ts)

The coolest part of `VOSet` is definitely the conditional types that decide what is expected for instantiation and the customization of this behaviour using the `options.strict` flag. See the examples below.

| Option | Description                                                                    | Rules   |
| :----- | :----------------------------------------------------------------------------- | :------ |
| strict | Whether it expects the set literal types for instantiation (defaults to false) | Boolean |

```typescript
import { VOSet } from '@lucaspaganini/value-objects';

class NonStrictSet extends VOSet([123, true]) {}
new NonStrictSet(true); // OK
new NonStrictSet('abc'); // Compilation error: Expects number | boolean
new NonStrictSet(''); // Compilation error: Expects number | boolean
new NonStrictSet(1); // Runtime error: Not in set
new NonStrictSet(false); // Runtime error: Not in set

class StrictSet extends VOSet([123, true], { strict: true }) {}
new StrictSet(true); // OK
new StrictSet('abc'); // Compilation error: Expects true | 123
new StrictSet(''); // Compilation error: Expects true | 123
new StrictSet(1); // Compilation error: Expects true | 123
new StrictSet(false); // Compilation error: Expects true | 123
```

## [VOOptional](../src/core/optional.ts)

Function to create an optional value object. Receives a value object constructor and returns a class that accepts what the value object constructor would accept or a `Noneable` (`Noneable` can be `undefined` or `null`, it defaults to just `undefined`) value. That's super useful when you already have a class with the value you want but you need to make it optional.

```typescript
type Noneable = undefined | null;
```

The class created by `VOOptional` wraps the inner class and exposes it through the `value` property when it's instantiated. Calling `valueOf()` will either return the `Noneable` value or the `valueOf()` from the inner class.

```typescript
import { VOOptional, VOString } from '@lucaspaganini/value-objects';

class Name extends VOString({ trim: true, maxLength: 256, minLength: 1 }) {}
new Name('Lucas Paganini'); // OK
new Name(undefined); // Compilation error: Not a string
new Name(null); // Compilation error: Not a string

class OptionalName extends VOOptional(Name) {}
new OptionalName('Lucas Paganini'); // OK
new OptionalName(undefined); // OK
new OptionalName(null); // Compilation error: Expects string | undefined

const name = new Name('Lucas Paganini'); // OK
name.valueOf(); // "Lucas Paganini"

const optional1 = new OptionalName('Lucas Paganini'); // OK
optional1.value; // Name instance
optional1.valueOf(); // "Lucas Paganini"

const optional2 = new OptionalName(undefined); // OK
optional2.value; // undefined
optional2.valueOf(); // undefined
```

This function has no options but it does accept a second parameter which indicates what `Noneable`s should be used. For default, it only accepts `undefined`, but you can change that to also accept `undefined` and `null` or maybe to just accept `null`.

```typescript
import { VOSet } from '@lucaspaganini/value-objects';

class Name extends VOString({ trim: true, maxLength: 256, minLength: 1 }) {}
new Name('Lucas Paganini'); // OK
new Name(undefined); // Compilation error: Not a string
new Name(null); // Compilation error: Not a string

class OptionalName1 extends VOOptional(Name) {}
new OptionalName1('Lucas Paganini'); // OK
new OptionalName1(undefined); // OK
new OptionalName1(null); // Compilation error: Expects string | undefined

class OptionalName2 extends VOOptional(Name, [undefined, null]) {}
new OptionalName2('Lucas Paganini'); // OK
new OptionalName2(undefined); // OK
new OptionalName2(null); // OK

class OptionalName3 extends VOOptional(Name, [null]) {}
new OptionalName3('Lucas Paganini'); // OK
new OptionalName3(undefined); // Compilation error: Expects string | null
new OptionalName3(null); // OK
```

## [VOArray](../src/core/array.ts)

Function to create an array value object. Receives a value object constructor and returns a class that accepts an array of what the value object constructor would accept. Calling `valueOf()` calls `valueOf()` for all it's inner instances and returns an array of the results. Useful if you already have a class and you need an array of it.

```typescript
import { VOString, VOArray } from '@lucaspaganini/value-objects';

const EMAIL_PATTERN =
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
class Email extends VOString({
  trim: true,
  maxLength: 256,
  pattern: EMAIL_PATTERN
}) {
  getHost(): string {
    const arr = this.valueOf().split('@');
    return arr[arr.length - 1];
  }
}

class EmailsArray extends VOArray(Email) {}
new EmailsArray(['me@lucaspaganini.com', 'test@example.com']); // OK
new EmailsArray([123]); // Compilation error: Expects Array<string>
new EmailsArray(['invalid-email']); // Runtime error: Value doesn't match pattern

const emails = new EmailsArray(['me@lucaspaganini.com', 'test@example.com']);
emails.valueOf(); // ['me@lucaspaganini.com', 'test@example.com']
emails.toArray(); // [Email, Email]
emails.toArray().map((email) => email.getHost()); // ['lucaspaganini.com', 'example.com']
```

### [VOArrayOptions](../src/core/array.ts)

You can customize the array with some options:

| Option    | Description                                                             | Rules                                                            |
| :-------- | :---------------------------------------------------------------------- | :--------------------------------------------------------------- |
| maxErrors | Maximum inclusive errors to acumulate before throwing (defaults to `1`) | Number (integer), >=0                                            |
| minLength | Minimum inclusive length                                                | Number (integer), >=0, can't be bigger than `options.maxLength`  |
| maxLength | Maximum inclusive length                                                | Number (integer), >=0, can't be smaller than `options.minLength` |

```typescript
import { VOArray } from '@lucaspaganini/value-objects';

class Test {
  constructor(shouldThrow: boolean) {
    if (shouldThrow) {
      throw Error('I was instructed to throw');
    }
  }

  valueOf() {
    return "Nevermind me, I'm just a test";
  }
}
new Test(false); // OK
new Test(true); // Runtime error: I was instructed to throw

class TestsArray extends VOArray(Test, {
  minLength: 1,
  maxLength: 5,
  maxErrors: 2
}) {}
new TestsArray([false]); // OK
new TestsArray([]); // Runtime error: Too short
new TestsArray([false, false, false, false, false, false]); // Runtime error: Too long
new TestsArray([true, true, true, true]); // Runtime error: ["I was instructed to throw", "I was instructed to throw"]
```

## [VOObject](../src/core/object.ts)

Creates an object value object. Receives an object of value object constructors as values and returns a class that accepts an object mapping their keys to what the value object constructor for that key would accept. Calling `valueOf()` calls `valueOf()` for all it's inner instances and returns them in an object. Useful if you want to aggregate classes.

```typescript
import { VOString, VOObject } from '@lucaspaganini/value-objects';

const EMAIL_PATTERN =
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
class Email extends VOString({
  trim: true,
  maxLength: 256,
  pattern: EMAIL_PATTERN
}) {
  getHost(): string {
    const arr = this.valueOf().split('@');
    return arr[arr.length - 1];
  }
}

class Name extends VOString({
  trim: true,
  maxLength: 256,
  minLength: 1
}) {}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]*$/; // One lowercase, one uppercase, one number
class Password extends VOString({
  trim: false,
  minLength: 8,
  maxLength: 256,
  pattern: PASSWORD_PATTERN
}) {}

class User extends VOObject({
  name: Name,
  email: Email,
  password: Password
}) {}

new User({
  name: 'Lucas',
  email: 'me@lucaspaganini.com',
  password: 'Secret123'
}); // OK

new User({
  name: 'Lucas',
  email: 123,
  password: 'Secret123'
}); // Compilation error: `.email` expects a string

new User({
  name: 'Lucas',
  email: 'lucaspaganini.com',
  password: 'Secret123'
}); // Runtime error: `.email` Value doesn't match pattern

const user = new User({
  name: 'Lucas',
  email: 'me@lucaspaganini.com',
  password: 'Secret123'
});

user.valueOf(); // { name: 'Lucas', email: 'me@lucaspaganini.com', password: 'Secret123' }
user.email.getHost(); // lucaspaganini.com
```

### [VOObjectOptions](../src/core/object.ts)

You can customize the ammount of errors that the generate class will accumulate before throwing.

You can customize the array with some options:

| Option    | Description                                                             | Rules                 |
| :-------- | :---------------------------------------------------------------------- | :-------------------- |
| maxErrors | Maximum inclusive errors to acumulate before throwing (defaults to `1`) | Number (integer), >=0 |

```typescript
import { VOObject } from '@lucaspaganini/value-objects';

class Test {
  constructor(shouldThrow: boolean) {
    if (shouldThrow) {
      throw Error('I was instructed to throw');
    }
  }

  valueOf() {
    return "Nevermind me, I'm just a test";
  }
}
new Test(false); // OK
new Test(true); // Runtime error: I was instructed to throw

class TestsObject extends VoObject(
  {
    aaa: Test,
    bbb: Test,
    ccc: Test
  },
  {
    maxErrors: 2
  }
) {}
new TestsArray({ aaa: false, bbb: false, ccc: false }); // OK
new TestsArray({ aaa: true, bbb: true, ccc: true }); // Runtime error: ["I was instructed to throw", "I was instructed to throw"]
```

## [VOAny](../src/core/any.ts)

Function to create one of the inner value objects. Receives a list of value object constructors and returns a class that accepts all that the value objects would accept and tries to instantiate these classes in order.

The class created by `VOAny` wraps the inner classes and exposes the one used for instantiation through the `value` property. Calling `valueOf()` will call `valueOf()` for the inner class.

```typescript
import { VOAny } from '@lucaspaganini/value-objects';

class Email { ... }
class UserName { ... }
class EmailOrUserName extends VOAny([Email, UserName]) {}

new EmailOrUserName('lucas@example.com').value // ØEmail
new EmailOrUserName('lucas').value // UserName
```

## [Functional helpers](../src/core/functions.ts)

Utility functions created from value object constructors.

### (makeIsValidRawInit())(../src/core/functions.ts)

Signature: `<VOC extends ValueObjectContructor>(VO: VOC) => (v: any) => v is VOCRawInit<VOC>`

Makes a function that receives a value and returns a boolean indicating whether that value would be valid to instantiate the value object class.

```typescript
import { makeIsValidRawInit } from '@lucaspaganini/value-objects';

class Test {
  constructor(rawInit: string) {
    if (rawInit !== 'valid') throw Error('invalid raw init value');
  }

  valueOf() {
    return 'valid';
  }
}

const isValidTestRawInit = makeIsValidRawInit(Test);
isValidTestRawInit('valid'); // true
isValidTestRawInit('invalid'); // false
isValidTestRawInit('abc'); // false
isValidTestRawInit(123); // false
```

### (makeFromRawInit())(../src/core/functions.ts)

Signature: `<VOC extends ValueObjectContructor>(VO: VOC) => (data: VOCRawInit<VOC>) => Either<Array<Error>, InstanceType<VOC>>`

Makes a function that receives the value object raw init, tries to instantiate the class and returns either the instantiate class or an array of errors.

```typescript
import { makeFromRawInit } from '@lucaspaganini/value-objects';

class Test {
  constructor(rawInit: string) {
    if (rawInit !== 'valid') throw Error('invalid raw init value');
  }

  valueOf() {
    return 'valid';
  }
}

const testFrom = makeFromRawInit(Test);
testFrom('valid').right; // Test
testFrom('invalid').left; // [Error]
testFrom('abc').left; // [Error]
testFrom(123).left; // [Error]
```
