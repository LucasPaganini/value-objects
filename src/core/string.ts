import {
  LogicError,
  MaxLengthError,
  MinLengthError,
  MinSizeError,
  NotIntegerError,
  PatternError,
  RawTypeError,
} from './errors'

export interface VOStringOptions {
  trim?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

export interface VOStringInstance {
  valueOf(): string
}

export interface VOStringConstructor {
  new (r: string): VOStringInstance
}

export const VOString = (options: VOStringOptions = {}): VOStringConstructor => {
  if (options.trim !== undefined) {
    if (typeof options.trim !== 'boolean') throw new RawTypeError('boolean', typeof options.trim, 'options.trim')
  }
  if (options.minLength !== undefined) {
    if (typeof options.minLength !== 'number')
      throw new RawTypeError('number', typeof options.minLength, 'options.minLength')
    if (!Number.isInteger(options.minLength)) throw new NotIntegerError(options.minLength, 'options.minLength')
    if (options.minLength < 0) throw new MinSizeError(options.minLength, 0)
  }
  if (options.maxLength !== undefined) {
    if (typeof options.maxLength !== 'number')
      throw new RawTypeError('number', typeof options.maxLength, 'options.maxLength')
    if (!Number.isInteger(options.maxLength)) throw new NotIntegerError(options.maxLength, 'options.maxLength')
    if (options.maxLength < 0) throw new MinSizeError(options.maxLength, 0)
  }
  if (options.minLength !== undefined && options.maxLength !== undefined) {
    if (options.minLength > options.maxLength)
      throw new LogicError('options.minLength should not be bigger than options.maxLength')
  }
  if (options.pattern !== undefined) {
    if (!(options.pattern instanceof RegExp))
      throw new RawTypeError('RegExp', typeof options.pattern, 'options.pattern')
  }

  const trim = options.trim ?? false

  return class {
    protected _value: string

    constructor(raw: string) {
      if (trim) raw = raw.trim()
      if (options.minLength !== undefined && raw.length < options.minLength)
        throw new MinLengthError(options.minLength, raw.length)
      if (options.maxLength !== undefined && raw.length > options.maxLength)
        throw new MaxLengthError(options.maxLength, raw.length)
      if (options.pattern !== undefined && !options.pattern.test(raw)) throw new PatternError()
      this._value = raw
    }

    valueOf(): string {
      return this._value
    }
  }
}
