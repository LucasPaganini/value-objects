import { NotInSetError, RawTypeError } from './errors'

export interface VOSetOptions<Strict extends boolean = boolean> {
  /**
   * Whether it should expect the set elements literal types or their closest
   * supersets (eg. `true => boolean` and `"abc" => string`) for instantiation.
   * Defaults to false.
   */
  strict?: Strict
}

export type Setable = string | number | boolean

export type VOSetRaw<Element extends Setable, Strict extends boolean> = Strict extends true
  ? Element
  :
      | (Element extends number ? number : never)
      | (Element extends string ? string : never)
      | (Element extends boolean ? boolean : never)

export interface VOSetInstance<Element extends Setable> {
  valueOf(): Element
}

export interface VOSetConstructor<Element extends Setable, Strict extends boolean> {
  new (r: VOSetRaw<Element, Strict>): VOSetInstance<Element>
}

const isSetable = (element: any): element is Setable => ['number', 'string', 'boolean'].includes(typeof element)
const expectedSetableTypes = (set: Array<Setable>): Array<'number' | 'string' | 'boolean'> =>
  Array.from(new Set(set.map(v => <'number' | 'string' | 'boolean'>typeof v)))

/**
 * Function to create a set of elements value object constructor.
 *
 * @template Element Literal type of the set elements.
 * @template Strict Literal boolean indicating the `options.strict` flag.
 * @param elements Elements in the set, they must be {@link Setable}.
 * @param options Customizations for the returned class constructor.
 * @returns Class constructor that accepts a set element for instantiation
 * and returns that element when {@link VOSetInstance.valueOf} is called.
 *
 * @example
 * ```typescript
 * class TestSet extends VOSet([123, 'abc']) {}
 * new TestSet('abc'); // OK
 * new TestSet(''); // Runtime error: Not in set
 * new TestSet(1); // Runtime error: Not in set
 * new TestSet(false); // Compilation error: Expects string | number
 * ```
 *
 * The coolest part of `VOSet` are definitely the conditional types
 * in {@link VOSetRaw} that decide what is expected for instantiation and
 * the customization of this behaviour using the `options.strict` flag.
 * See the examples below.
 *
 * @example
 * ```typescript
 * class NonStrictSet extends VOSet([123, true]) {}
 * new NonStrictSet(true); // OK
 * new NonStrictSet('abc'); // Compilation error: Expects number | boolean
 * new NonStrictSet(''); // Compilation error: Expects number | boolean
 * new NonStrictSet(1); // Runtime error: Not in set
 * new NonStrictSet(false); // Runtime error: Not in set
 * ```
 *
 * @example
 * ```typescript
 * class StrictSet extends VOSet([123, true], { strict: true }) {}
 * new StrictSet(true); // OK
 * new StrictSet('abc'); // Compilation error: Expects true | 123
 * new StrictSet(''); // Compilation error: Expects true | 123
 * new StrictSet(1); // Compilation error: Expects true | 123
 * new StrictSet(false); // Compilation error: Expects true | 123
 * ```
 */
export const VOSet = <Element extends Setable, Strict extends boolean>(
  elements: Array<Element>,
  options: VOSetOptions<Strict> = {},
): VOSetConstructor<Element, Strict> => {
  for (const [i, v] of Object.entries(elements))
    if (!isSetable(v)) throw new RawTypeError('number | string | boolean', typeof v, `elements[${i}]`)

  const set = new Set(elements)
  const stringfiedSet = Array.from(set).map(x => x.toString())
  const isInSet = (v: any): v is Element => set.has(v)

  const strict = options.strict ?? false
  const nonStrictExpectedTypes = expectedSetableTypes(elements)

  return class {
    protected _value: Element

    constructor(raw: VOSetRaw<Element, Strict>) {
      if (!strict && !nonStrictExpectedTypes.includes(typeof raw as any))
        throw new RawTypeError(nonStrictExpectedTypes.join(' | '), typeof raw)
      if (!isInSet(raw)) throw new NotInSetError(stringfiedSet, raw.toString(), '')
      this._value = raw
    }

    valueOf(): Element {
      return this._value
    }
  }
}
