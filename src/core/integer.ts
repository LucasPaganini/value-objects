import { isDefined } from '../utils'
import { LogicError, MaxSizeError, MinSizeError, NotIntegerError, RawTypeError } from './errors'

export interface VOIntegerOptions {
  /**
   * Minimum inclusive acceptable value.
   * Can't be bigger than `max`.
   */
  min?: number

  /**
   * Maximum inclusive acceptable value.
   * Can't be smaller than `min`.
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
 * Function to create an integer number value object constructor.
 *
 * > NOTE: If you want to accept floating point numbers and convert them to
 * integers, you can use {@link VOFloat} and set the precision option to 0.
 *
 * @param options Customizations for the returned class constructor
 * @return Class constructor that accepts a (integer) number for instantiation
 * and returns that number when {@link VOIntegerInstance.valueOf} is called.
 *
 * @example
 * ```typescript
 * class MyInteger extends VOInteger() {}
 *
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
 * ```
 *
 * @example
 * ```typescript
 * class MyFloatRangeInteger extends VOInteger({ min: -100.5, max: 100.5 }) {} // OK
 * new MyFloatRangeInteger(-100); // OK
 * new MyFloatRangeInteger(100); // Ok
 * new MyFloatRangeInteger(-101); // Runtime error: Too small
 * new MyFloatRangeInteger(101); // Runtime error: Too big
 * ```
 *
 * @example
 * ```typescript
 * class MyInvalidInteger extends VOInteger({ min: 100, max: -100 }) {} // Runtime error: Invalid logic (options.min should not be bigger than options.max)
 * ```
 */
export const VOInteger = (options: VOIntegerOptions = {}): VOIntegerConstructor => {
  if (isDefined(options.min)) {
    if (typeof options.min !== 'number') throw new RawTypeError('number', typeof options.min, 'options.min')
  }
  if (isDefined(options.max)) {
    if (typeof options.max !== 'number') throw new RawTypeError('number', typeof options.max, 'options.max')
  }
  if (isDefined(options.min) && isDefined(options.max)) {
    if (options.min > options.max) throw new LogicError('options.min should not be bigger than options.max')
  }

  return class {
    protected _value: number

    constructor(raw: number) {
      if (typeof raw !== 'number') throw new RawTypeError('number', typeof raw, 'raw')
      if (isDefined(options.min) && raw < options.min) throw new MinSizeError(options.min, raw)
      if (isDefined(options.max) && raw > options.max) throw new MaxSizeError(options.max, raw)
      if (!Number.isInteger(raw)) throw new NotIntegerError(raw)
      this._value = raw
    }

    valueOf(): number {
      return this._value
    }
  }
}
