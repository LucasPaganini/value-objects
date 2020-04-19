import { LogicError, MaxSizeError, MinSizeError, NotInSetError, NotIntegerError, RawTypeError } from './errors'

export interface VOFloatOptions {
  min?: number
  max?: number
  precision?: number
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
      if (!Number.isInteger(raw)) throw new NotIntegerError(raw)
      this._value = raw
    }

    valueOf(): number {
      return this._value
    }
  }
}
