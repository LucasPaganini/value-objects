import { MaxSizeError, MinSizeError, NotIntegerError, RawTypeError, LogicError } from './errors'

export interface VOIntegerOptions {
  /**
   * Minimum inclusive acceptable value. Can't be bigger than `max`.
   */
  min?: number

  /**
   * Maximum inclusive acceptable value. Can't be smaller than `min`.
   */
  max?: number
}

export interface VOIntegerInstance {
  valueOf(): number
}

export interface VOIntegerConstructor {
  new (r: number): VOIntegerInstance
}

/**
 * Function to create an integer number value object.
 * Returns a class constructor that accepts a (integer) number for instantiation
 * and returns that number when valueOf() is called.
 *
 * > NOTE: If you want to accept floating point numbers and convert them to
 * integers, you can use {@link VOFloat} and set the precision option to 0.
 *
 * @param options Customizations for the returned class constructor
 *
 * @example
 * ```typescript
 * const int1 = new MyInteger(5); // OK
 * int1.valueOf(); // 5
 *
 * const int2 = new MyInteger(5.0); // OK
 * int2.valueOf(); // 5
 *
 * const int3 = new MyInteger(5.5); // Runtime error: Not an integer
 * ```
 *
 * @example
 * ```typescript
 * class NaturalNumber extends VOInteger({ min: 0 }) {} // OK
 * new NaturalNumber(0); // OK
 * new NaturalNumber(1000000); // Ok
 * new NaturalNumber(-1); // Runtime error: Too small
 * new NaturalNumber(1.5); // Runtime error: Not an integer
 *
 * class MyFloatRangeInteger extends VOInteger({ min: -100.5, max: 100.5 }) {} // OK
 * new MyFloatRangeInteger(-100); // OK
 * new MyFloatRangeInteger(100); // Ok
 * new MyFloatRangeInteger(-101); // Runtime error: Too small
 * new MyFloatRangeInteger(101); // Runtime error: Too big
 *
 * class MyInvalidInteger extends VOInteger({ min: 100, max: -100 }) {} // Runtime error: Invalid logic (options.min should not be bigger than options.max)
 * ```
 */
export const VOInteger = (options: VOIntegerOptions = {}): VOIntegerConstructor => {
  if (options.min !== undefined) {
    if (typeof options.min !== 'number') throw new RawTypeError('number', typeof options.min, 'options.min')
  }
  if (options.max !== undefined) {
    if (typeof options.max !== 'number') throw new RawTypeError('number', typeof options.max, 'options.max')
  }
  if (options.min !== undefined && options.max !== undefined) {
    if (options.min > options.max) throw new LogicError('options.min should not be bigger than options.max')
  }

  return class {
    protected _value: number

    constructor(raw: number) {
      if (typeof raw !== 'number') throw new RawTypeError('number', typeof raw, 'raw')
      if (options.min !== undefined && raw < options.min) throw new MinSizeError(options.min, raw)
      if (options.max !== undefined && raw > options.max) throw new MaxSizeError(options.max, raw)
      if (!Number.isInteger(raw)) throw new NotIntegerError(raw)
      this._value = raw
    }

    valueOf(): number {
      return this._value
    }
  }
}
