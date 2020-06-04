import { ValueObject, ValueObjectContructor, VOCRawInit, VORaw, VOCRaw } from './value-object'
import { RawTypeError } from './errors'

export type Noneable = undefined | null
const NONEABLES: Array<Noneable> = [undefined, null]
const isNoneable = (v: any): v is Noneable => NONEABLES.includes(v)

export interface VOOptionalInstance<VO extends ValueObject<any>, None extends Noneable> {
  value: VO | None
  isSome(): boolean
  isNone(): boolean
  valueOf(): VORaw<VO> | None
}

export interface VOOptionalConstructor<VOC extends ValueObjectContructor, None extends Noneable> {
  new (r: VOCRawInit<VOC> | None): VOOptionalInstance<InstanceType<VOC>, None>
}

const expectedNoneableTypes = (nones: Array<Noneable>): Array<'undefined' | 'null'> =>
  Array.from(new Set(nones.map(v => (v === undefined ? 'undefined' : 'null'))))

/**
 * Function to create an optional value object constructor.
 *
 * @template VOC Value object constructor to make optional.
 * @template None Values that represent nothing. Defaults to `undefined`.
 * @param VOC Value object constructor to make optional.
 * @param nones Values that represent nothing. Defaults to `[undefined]`.
 * @returns Class constructor that accepts a None or the given
 * value object raw initial value for instantiation and returns
 * that value or the None value when {@link VOOptionalInstance.valueOf} is called.
 *
 *
 * The class created by `VOOptional` ({@link VOOptionalInstance}) wraps the
 * inner class and exposes it through the `value` property when it's instantiated.
 * Calling {@link VOOptionalInstance.valueOf} will either return the `None` value
 * or the `valueOf()` from the inner class.
 *
 * @example
 * ```typescript
 * class Name extends VOString({ trim: true, maxLength: 256, minLength: 1 }) {}
 * new Name('Lucas Paganini'); // OK
 * new Name(undefined); // Compilation error: Not a string
 * new Name(null); // Compilation error: Not a string
 *
 * class OptionalName extends VOOptional(Name) {}
 * new OptionalName('Lucas Paganini'); // OK
 * new OptionalName(undefined); // OK
 * new OptionalName(null); // Compilation error: Expects string | undefined
 *
 * const name = new Name('Lucas Paganini'); // OK
 * name.valueOf(); // "Lucas Paganini"
 *
 * const optional1 = new OptionalName('Lucas Paganini'); // OK
 * optional1.value; // Name instance
 * optional1.valueOf(); // "Lucas Paganini"
 *
 * const optional2 = new OptionalName(undefined); // OK
 * optional2.value; // undefined
 * optional2.valueOf(); // undefined
 * ```
 *
 * This function has no options but it does accept a second parameter which
 * indicates what values should be considered nothing.
 * For default, it only accepts `undefined`, but you can change that to
 * _also_ accept `null` or maybe to _just_ accept `null`.
 *
 * @example
 * ```typescript
 * class Name extends VOString({ trim: true, maxLength: 256, minLength: 1 }) {}
 * new Name('Lucas Paganini'); // OK
 * new Name(undefined); // Compilation error: Not a string
 * new Name(null); // Compilation error: Not a string
 *
 * class OptionalName1 extends VOOptional(Name) {}
 * new OptionalName1('Lucas Paganini'); // OK
 * new OptionalName1(undefined); // OK
 * new OptionalName1(null); // Compilation error: Expects string | undefined
 *
 * class OptionalName2 extends VOOptional(Name, [undefined, null]) {}
 * new OptionalName2('Lucas Paganini'); // OK
 * new OptionalName2(undefined); // OK
 * new OptionalName2(null); // OK
 *
 * class OptionalName3 extends VOOptional(Name, [null]) {}
 * new OptionalName3('Lucas Paganini'); // OK
 * new OptionalName3(undefined); // Compilation error: Expects string | null
 * new OptionalName3(null); // OK
 * ```
 */
export const VOOptional = <VOC extends ValueObjectContructor, None extends Noneable = undefined>(
  VOC: VOC,
  nones?: Array<None>,
): VOOptionalConstructor<VOC, None> => {
  const _nones = nones ?? [<None>undefined]
  for (const [i, v] of Object.entries(_nones)) {
    if (!isNoneable(v)) throw new RawTypeError(NONEABLES.join(' | '), v, `nones[${i}]`)
  }

  const isInNones = (v: any): v is None => _nones.includes(v)
  const expectedTypes = expectedNoneableTypes(_nones)

  return class {
    public readonly value: InstanceType<VOC> | None

    public isSome(): boolean {
      return !this.isNone()
    }

    public isNone(): boolean {
      return isInNones(this.value)
    }

    constructor(raw: VOCRawInit<VOC> | None) {
      if (isInNones(raw)) {
        this.value = raw
        return
      }

      try {
        const valueObject = <InstanceType<VOC>>new VOC(raw)
        this.value = valueObject
      } catch (err) {
        if (RawTypeError.is(err)) {
          ;(<any>err).expected += ' | ' + expectedTypes.join(' | ')
        }
        throw err
      }
    }

    valueOf(): VOCRaw<VOC> | None {
      return this.isNone() ? this.value : this.value?.valueOf()
    }
  }
}
