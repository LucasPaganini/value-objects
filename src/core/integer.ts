import { MaxSizeError, MinSizeError, NotIntegerError, RawTypeError, LogicError } from './errors'

export interface VOIntegerOptions {
  /**
   * Minimum inclusive acceptable value.
   * @type {number} Can't be bigger than `max`
   */
  min?: number

  /**
   * Maximum inclusive acceptable value.
   * @type {number} Can't be smaller than `min`
   */
  max?: number
}

export interface VOIntegerInstance {
  valueOf(): number
}

export interface VOIntegerConstructor {
  new (r: number): VOIntegerInstance
}

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
