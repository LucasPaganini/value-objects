import { MaxSizeError, MinSizeError, NotIntegerError, RawTypeError } from './errors'

export interface VOIntegerOptions {
  min?: number
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
    if (!Number.isInteger(options.min)) throw new NotIntegerError(options.min, 'options.min')
  }
  if (options.max !== undefined) {
    if (typeof options.max !== 'number') throw new RawTypeError('number', typeof options.max, 'options.max')
    if (!Number.isInteger(options.max)) throw new NotIntegerError(options.max, 'options.max')
  }

  return class {
    protected _value: number

    constructor(raw: number) {
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
