import { LogicError, MaxSizeError, MinSizeError, NotInSetError, NotIntegerError, RawTypeError } from './errors'

export interface VOFloatOptions {
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

  /**
   * Floating point precision.
   * Can't be less than zero.
   */
  precision?: number

  /**
   * Trimming strategy for numbers with more precision than `precision`.
   * @default "round"
   */
  precisionTrim?: 'floor' | 'ceil' | 'round'
}

export interface VOFloatInstance {
  valueOf(): number
}

export interface VOFloatConstructor {
  new (r: number): VOFloatInstance
}

const makeIsInSet = <T extends string>(values: Array<T>) => {
  const set = new Set(values)
  return (v: string): v is T => set.has(<T>v)
}

const PRECISION_TRIM_SET: Array<NonNullable<VOFloatOptions['precisionTrim']>> = ['floor', 'ceil', 'round']
const isPrecisionTrim = makeIsInSet(PRECISION_TRIM_SET)

/**
 * Function to create a floating point number value object constructor.
 *
 * @param options Customizations for the returned class constructor
 * @return Class constructor that accepts a number for instantiation
 * and returns that number when {@link VOFloatInstance.valueOf} is called.
 *
 * @example
 * ```typescript
 * class MyFloat extends VOFloat() {}
 *
 * const float1 = new MyFloat(5); // OK
 * float1.valueOf(); // 5
 *
 * const float2 = new MyFloat(5.0); // OK
 * float2.valueOf(); // 5
 *
 * const float3 = new MyFloat(5.5); // OK
 * float3.valueOf(); // 5.5
 *
 * const float4 = new MyFloat('5.5'); // Compilation error: Not a number
 * ```
 *
 * @example
 * ```typescript
 * class PositiveNumber extends VOFloat({ min: 0 }) {} // OK
 * new PositiveNumber(0); // OK
 * new PositiveNumber(1000000); // Ok
 * new PositiveNumber(-1); // Runtime error: Too small
 * new PositiveNumber(1.5); // OK
 * ```
 *
 * @example
 * ```typescript
 * class FloatWithValidRange extends VOFloat({ min: -100.5, max: 100.5 }) {} // OK
 * new FloatWithValidRange(-100); // OK
 * new FloatWithValidRange(100); // Ok
 * new FloatWithValidRange(-100.5); // OK
 * new FloatWithValidRange(-101); // Runtime error: Too small
 * new FloatWithValidRange(101); // Runtime error: Too big
 * ```
 *
 * @example
 * ```typescript
 * class FloatWithInvalidRange extends VOFloat({ min: 100, max: -100 }) {} // Runtime error: Invalid logic (options.min should not be bigger than options.max)
 * ```
 *
 * @example
 * ```typescript
 * class LimitedPrecisionFloat extends VOFloat({
 *   precision: 5,
 *   precisionTrim: 'round'
 * }) {} // OK
 * const limited1 = new LimitedPrecisionFloat(0.123456789);
 * limited1.valueOf(); // 0.12346 => Only 5 precision digits and it's rounded
 * ```
 *
 * @example
 * ```typescript
 * class LimitedPrecisionFloatWithRange extends VOFloat({
 *   min: 1,
 *   max: 999.999,
 *   precision: 2,
 *   precisionTrim: 'ceil'
 * }) {} // OK
 * new LimitedPrecisionFloatWithRange(-100); // Runtime error: Too small
 * new LimitedPrecisionFloatWithRange(100); // Ok
 * new LimitedPrecisionFloatWithRange(0.9999); // OK (rounds to 1 and passes the minimum)
 * new LimitedPrecisionFloatWithRange(999.999); // Runtime error: Too big (rounds to 1000 and doesn't pass the maximum)
 * const limited2 = new LimitedPrecisionFloatWithRange(0.123456789);
 * limited2.valueOf(); // 0.13 => Only 2 precision digits and it's rounded up because we're using "ceil"
 * ```
 */
export const VOFloat = (options: VOFloatOptions = {}): VOFloatConstructor => {
  if (options.min !== undefined) {
    if (typeof options.min !== 'number') throw new RawTypeError('number', typeof options.min, 'options.min')
  }
  if (options.max !== undefined) {
    if (typeof options.max !== 'number') throw new RawTypeError('number', typeof options.max, 'options.max')
  }
  if (options.min !== undefined && options.max !== undefined) {
    if (options.min > options.max) throw new LogicError('options.min should not be bigger than options.max')
  }
  if (options.precision !== undefined) {
    if (typeof options.precision !== 'number')
      throw new RawTypeError('number', typeof options.precision, 'options.precision')
    if (!Number.isInteger(options.precision)) throw new NotIntegerError(options.precision, 'options.precision')
    if (options.precision < 0) throw new MinSizeError(options.precision, 0)
  }
  if (options.precisionTrim !== undefined) {
    if (!isPrecisionTrim(options.precisionTrim))
      throw new NotInSetError(PRECISION_TRIM_SET, options.precisionTrim, 'options.precisionTrim')
  }

  const precisionPower = 10 ** (options.precision ?? 0)
  const precisionTrim = options.precisionTrim ?? 'round'

  return class {
    protected _value: number

    constructor(raw: number) {
      if (typeof raw !== 'number') throw new RawTypeError('number', typeof raw, 'raw')
      if (options.precision !== undefined) raw = Math[precisionTrim](raw * precisionPower) / precisionPower
      if (options.min !== undefined && raw < options.min) throw new MinSizeError(options.min, raw)
      if (options.max !== undefined && raw > options.max) throw new MaxSizeError(options.max, raw)
      this._value = raw
    }

    valueOf(): number {
      return this._value
    }
  }
}
