import { isDefined, isLeft, isNil } from '../utils'
import { MinSizeError, NotIntegerError, RawTypeError } from './errors'
import { makeFromRawInit } from './functions'
import { ValueObjectContructor, ValueObjectWorkAround, VOCRaw, VOCRawInit } from './value-object'

export interface VOObjectOptions {
  /**
   * Maximum inclusive errors to acumulate before throwing.
   * Can't be less than zero.
   * @default 1
   */
  maxErrors?: number
}

type VOObjectSchema<Schema> = { [P in keyof Schema]: ValueObjectContructor }
type VOObjectRawInitSchema<Schema extends VOObjectSchema<Schema>> = {
  [P in keyof Schema]: Schema[P] extends ValueObjectContructor ? VOCRawInit<Schema[P]> : never
}
type VOObjectRawSchema<Schema extends VOObjectSchema<Schema>> = {
  [P in keyof Schema]: Schema[P] extends ValueObjectContructor ? VOCRaw<Schema[P]> : never
}

export type VOObjectInstance<Schema extends VOObjectSchema<Schema>> = ValueObjectWorkAround<VOObjectRawSchema<Schema>> &
  { [P in keyof Schema]: InstanceType<Schema[P]> }

export interface VOObjectConstructor<Schema extends VOObjectSchema<Schema>> {
  new (rawInit: VOObjectRawInitSchema<Schema>): VOObjectInstance<Schema>
}

/**
 * Function to create an object wrapper over a given map of value
 * object constructors. Useful if you have different classes and
 * want to aggregate them.
 *
 * @template Schema Object mapping to value object constructors.
 * @param schema Object mapping to value object constructors.
 * @param options Customizations for the returned class constructor.
 * @return Class constructor that accepts an object mapping it's keys
 * and values to what the inner value object constructors expect.
 * Calling {@link VOObjectInstance.valueOf} calls `valueOf()` for all it's inner instances
 * and returns them in an object.
 *
 * @example
 * ```typescript
 * class Email extends VOString({ ... }) {
 *   getHost(): string { ... }
 * }
 *
 * class Name extends VOString({ ... }) {}
 *
 * class Password extends VOString({ ... }) {}
 *
 * class User extends VOObject({
 *   name: Name,
 *   email: Email,
 *   password: Password
 * }) {}
 *
 * new User({
 *   name: 'Lucas',
 *   email: 'me@lucaspaganini.com',
 *   password: 'Secret123'
 * }); // OK
 *
 * new User({
 *   name: 'Lucas',
 *   email: 123,
 *   password: 'Secret123'
 * }); // Compilation error: `.email` expects a string
 *
 * new User({
 *   name: 'Lucas',
 *   email: 'lucaspaganini.com',
 *   password: 'Secret123'
 * }); // Runtime error: `.email` Value doesn't match pattern
 *
 * const user = new User({
 * name: 'Lucas',
 * email: 'me@lucaspaganini.com',
 * password: 'Secret123'
 * });
 *
 * user.valueOf(); // { name: 'Lucas', email: 'me@lucaspaganini.com', password: 'Secret123' }
 * user.email.getHost(); // lucaspaganini.com
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
 * class TestsObject extends VoObject({
 *   aaa: Test,
 *   bbb: Test,
 *   ccc: Test
 * }, { maxErrors: 2 }) {}
 * new TestsArray({ aaa: false, bbb: false, ccc: false }); // OK
 * new TestsArray({ aaa: true, bbb: true, ccc: true }); // Runtime error: ["I was instructed to throw", "I was instructed to throw"]
 * ```
 */
export const VOObject = <Schema extends VOObjectSchema<Schema>>(
  schema: Schema,
  options: VOObjectOptions = {},
): VOObjectConstructor<Schema> => {
  if (isDefined(options.maxErrors)) {
    if (typeof options.maxErrors !== 'number')
      throw new RawTypeError('number', typeof options.maxErrors, 'options.maxErrors')
    if (!Number.isInteger(options.maxErrors)) throw new NotIntegerError(options.maxErrors, 'options.maxErrors')
    if (options.maxErrors < 0) throw new MinSizeError(options.maxErrors, 0)
  }

  const maxErrors = options.maxErrors ?? 1

  return <any>class {
    constructor(raw: VOObjectRawInitSchema<Schema>) {
      if (isNil(raw)) throw new RawTypeError('object', typeof raw, 'raw')

      const errors: Array<Error> = []

      for (const [prop, VO] of Object.entries(schema)) {
        const fromRaw = makeFromRawInit(<any>VO)
        const either = fromRaw((<any>raw)[prop])

        if (isLeft(either)) {
          const errorsWithProp = either.left.map(e => {
            ;(e as any).prop = prop
            return e
          })
          errors.push(...errorsWithProp)
          if (errors.length >= maxErrors) throw errors
        } else {
          ;(<any>this)[prop] = either.right
        }
      }
      if (errors.length > 0) throw errors
    }

    valueOf(): VOObjectRawSchema<Schema> {
      return Object.keys(schema).reduce<any>((acc, key) => {
        acc[key] = (<any>this)[key].valueOf()
        return acc
      }, {})
    }

    toRaw(): VOObjectRawSchema<Schema> {
      return this.valueOf()
    }
  }
}
