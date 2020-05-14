import { NotInSetError, RawTypeError } from './errors'

export interface VOSetOptions<Strict extends boolean = boolean> {
  /**
   * Whether it expects the set literal types for instantiation.
   * @type {boolean} Defaults to false
   */
  strict?: Strict
}

export type Setable = string | number | boolean

export type VOSetRaw<T extends Setable, Strict extends boolean> = Strict extends true
  ? T
  : (T extends number ? number : never) | (T extends string ? string : never) | (T extends boolean ? boolean : never)

export interface VOSetInstance<T extends Setable> {
  valueOf(): T
}

export interface VOSetConstructor<T extends Setable, Strict extends boolean> {
  new (r: VOSetRaw<T, Strict>): VOSetInstance<T>
}

const isSetable = (v: any): v is Setable => ['number', 'string', 'boolean'].includes(typeof v)
const expectedSetableTypes = (set: Array<Setable>): Array<'number' | 'string' | 'boolean'> =>
  Array.from(new Set(set.map(v => <'number' | 'string' | 'boolean'>typeof v)))

export const VOSet = <T extends Setable, Strict extends boolean>(
  setValues: Array<T>,
  options: VOSetOptions<Strict> = {},
): VOSetConstructor<T, Strict> => {
  for (const [i, v] of Object.entries(setValues))
    if (!isSetable(v)) throw new RawTypeError('number | string | boolean', typeof v, `setValues[${i}]`)

  const set = new Set(setValues)
  const stringfiedSet = Array.from(set).map(x => x.toString())
  const isInSet = (v: any): v is T => set.has(v)

  const strict = options.strict ?? false
  const nonStrictExpectedTypes = expectedSetableTypes(setValues)

  return class {
    protected _value: T

    constructor(raw: VOSetRaw<T, Strict>) {
      if (!strict && !nonStrictExpectedTypes.includes(typeof raw as any))
        throw new RawTypeError(nonStrictExpectedTypes.join(' | '), typeof raw)
      if (!isInSet(raw)) throw new NotInSetError(stringfiedSet, raw.toString(), '')
      this._value = raw
    }

    valueOf(): T {
      return this._value
    }
  }
}
