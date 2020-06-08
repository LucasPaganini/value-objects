import { isLeft } from '../utils'
import { LogicError, MaxLengthError, MinLengthError, MinSizeError, NotIntegerError, RawTypeError } from './errors'
import { makeFromRawInit } from './functions'
import { ValueObject, ValueObjectContructor, VOCRawInit, VORaw } from './value-object'

export interface VOArrayOptions {
  /**
   * Minimum inclusive length.
   * Can't be less than zero or bigger than `maxLength`
   */
  minLength?: number

  /**
   * Maximum inclusive length.
   * Can't be less than zero or smaller than `minLength`
   */
  maxLength?: number

  /**
   * Maximum inclusive errors to acumulate before throwing.
   * Can't be less than zero.
   * @default 1
   */
  maxErrors?: number
}

export interface VOArrayInstance<VO extends ValueObject<any>> {
  toArray(): Array<VO>
  valueOf(): Array<VORaw<VO>>
}

export interface VOArrayConstructor<VOC extends ValueObjectContructor> {
  new (rawInit: Array<VOCRawInit<VOC>>): VOArrayInstance<InstanceType<VOC>>
}

/**
 * Function to create an array wrapper over a given value object constructor.
 * Useful if you already have a class and you need an array of it.
 *
 * @template VOC Value object constructor to make an array wrapper of.
 * @param VOC Value object constructor to make an array wrapper of.
 * @param options Customizations for the returned class constructor.
 * @return Class constructor that accepts an array of what the given
 * value object constructor would accept. Calling {@link VOArrayInstance.valueOf}
 * calls `valueOf()` for all it's inner instances and returns an array of the results.
 *
 * @example
 * ```typescript
 * class Email extends VOString({ ... }) {
 *   getHost(): string { ... }
 * }
 *
 * class EmailsArray extends VOArray(Email) {}
 * new EmailsArray(['me@lucaspaganini.com', 'test@example.com']); // OK
 * new EmailsArray([123]); // Compilation error: Expects Array<string>
 * new EmailsArray(['invalid-email']); // Runtime error: Value doesn't match pattern
 *
 * const emails = new EmailsArray(['me@lucaspaganini.com', 'test@example.com']);
 * emails.valueOf(); // ['me@lucaspaganini.com', 'test@example.com']
 * emails.toArray(); // [Email, Email]
 * emails.toArray().map((email) => email.getHost()); // ['lucaspaganini.com', 'example.com']
 * ```
 *
 * @example
 * ```typescript
 * class Test {
 *   constructor(shouldThrow: boolean) {
 *     if (shouldThrow) throw Error('I was instructed to throw');
 *   }
 * }
 * new Test(false); // OK
 * new Test(true); // Runtime error: I was instructed to throw
 *
 * class TestsArray extends VOArray(Test, {
 *   minLength: 1,
 *   maxLength: 5,
 *   maxErrors: 2
 * }) {}
 * new TestsArray([false]); // OK
 * new TestsArray([]); // Runtime error: Too short
 * new TestsArray([false, false, false, false, false, false]); // Runtime error: Too long
 * new TestsArray([true, true, true, true]); // Runtime error: ["I was instructed to throw", "I was instructed to throw"]
 * ```
 */
export const VOArray = <VOC extends ValueObjectContructor>(
  VOC: VOC,
  options: VOArrayOptions = {},
): VOArrayConstructor<VOC> => {
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
  if (options.maxErrors !== undefined) {
    if (typeof options.maxErrors !== 'number')
      throw new RawTypeError('number', typeof options.maxErrors, 'options.maxErrors')
    if (!Number.isInteger(options.maxErrors)) throw new NotIntegerError(options.maxErrors, 'options.maxErrors')
    if (options.maxErrors < 0) throw new MinSizeError(options.maxErrors, 0)
  }

  const maxErrors = options.maxErrors ?? 1

  return class {
    private _valueObjects: Array<InstanceType<VOC>> = []

    constructor(raw: Array<VOCRawInit<VOC>>) {
      if (!Array.isArray(raw)) {
        const err = Error(`Invalid raw value`)
        ;(err as any).expected = 'Array<Raw>'
        ;(err as any).actual = typeof raw
        throw err
      }

      if (options.minLength !== undefined && raw.length < options.minLength)
        throw new MinLengthError(options.minLength, raw.length)
      if (options.maxLength !== undefined && raw.length > options.maxLength)
        throw new MaxLengthError(options.maxLength, raw.length)

      const errors: Array<Error> = []
      const fromRaw = makeFromRawInit(VOC)

      for (const [_i, _raw] of Object.entries(raw)) {
        const index = parseInt(_i)
        const either = fromRaw(_raw)
        if (isLeft(either)) {
          const errorsWithIndex = either.left.map(e => {
            ;(e as any).index = index
            return e
          })
          errors.push(...errorsWithIndex)
          if (errors.length >= maxErrors) throw errors
        } else {
          this._valueObjects.push(either.right)
        }
      }
      if (errors.length > 0) throw errors

      if (raw.length !== this._valueObjects.length) throw Error(`Unknown error`)
    }

    valueOf(): Array<VORaw<InstanceType<VOC>>> {
      return this._valueObjects.map(vo => vo.valueOf())
    }

    toArray(): Array<InstanceType<VOC>> {
      return (<Array<InstanceType<VOC>>>[]).concat(this._valueObjects)
    }
  }
}
