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
  /**
   * Whether it should trim the raw string.
   * @default false
   */
  trim?: boolean

  /**
   * Minimum inclusive acceptable length after trimming.
   * Can't be less than zero or bigger than `maxLength`.
   */
  minLength?: number

  /**
   * Maximum inclusive acceptable length after trimming.
   * Can't be less than zero or smaller than `minLength`.
   */
  maxLength?: number

  /**
   * Regular expression pattern for the raw string after trimming.
   */
  pattern?: RegExp
}

export interface VOStringInstance {
  valueOf(): string
}

export interface VOStringConstructor {
  new (r: string): VOStringInstance
}

/**
 * Function to create a formatted string value object constructor.
 *
 * > NOTE: If you have a list of strings and the value must be one
 * of the strings, you should use {@link VOSet}.
 *
 * @param options Customizations for the returned class constructor
 * @return Class constructor that accepts a string for instantiation
 * and returns that string when {@link VOStringInstance.valueOf} is called.
 *
 * @example
 * ```typescript
 * class UselessString extends VOString() {}
 *
 * const string = new UselessString('abc'); // OK
 * string.valueOf(); // "abc"
 *
 * new UselessString(5); // Compilation error: Not a string
 * ```
 *
 * @example
 * ```typescript
 * class SuperShortString extends VOString({
 *   trim: true,
 *   minLength: 4,
 *   maxLength: 8
 * }) {}
 * new SuperShortString('abcd'); // OK
 * new SuperShortString(' ab '); // Runtime error: Too short (the length after trimming is 2 but the minLength is 4)
 * new SuperShortString('123456789'); // Runtime error: Too long (the length after trimming is 9 but the maxLength is 8)
 * ```
 *
 * @example
 * ```typescript
 * const EMAIL_PATTERN = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
 * class Email extends VOString({
 *   trim: true,
 *   maxLength: 256,
 *   pattern: EMAIL_PATTERN
 * }) {}
 * new Email('test@example.com'); // OK
 * new Email('test.example.com'); // Runtime error: Value doesn't match pattern
 * ```
 *
 * @example
 * ```typescript
 * const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]*$/; // One lowercase, one uppercase, one number
 * class Password extends VOString({
 *   trim: false,
 *   minLength: 8,
 *   maxLength: 256,
 *   pattern: PASSWORD_PATTERN
 * }) {}
 * new Password('Secret123'); // OK
 * new Password('abcd1234'); // Runtime error: Value doesn't match pattern
 * new Password(' AB12ab '); // Runtime error: Too short (the length after trimming is 6 but the minLength is 8)
 * ```
 *
 * @example
 * ```typescript
 * const PASSWORD_BLACKLIST = ['Secret123', 'abc123ABC'];
 * class WhitelistedPassword extends Password {
 *   constructor(raw: string) {
 *     super(raw);
 *     const trimmedRaw = this.valueOf();
 *     if (PASSWORD_BLACKLIST.includes(trimmedRaw))
 *       throw Error('This password is blacklisted');
 *   }
 * }
 * new WhitelistedPassword('Secret123'); // Runtime error: This password is blacklisted
 * new WhitelistedPassword('123Secret'); // OK
 * ```
 */
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
      if (typeof raw !== 'string') throw new RawTypeError('string', typeof raw, 'raw')
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
