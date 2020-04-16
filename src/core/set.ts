import { NotInSetError, RawTypeError } from './errors'

export type Setable = string | number | boolean

export type VOSetRaw<T extends Setable> =
  | (T extends number ? number : never)
  | (T extends string ? string : never)
  | (T extends boolean ? boolean : never)

export interface VOSetInstance<T extends Setable> {
  valueOf(): T
}

export interface VOSetConstructor<T extends Setable> {
  new (r: VOSetRaw<T>): VOSetInstance<T>
}

const isSetable = (v: any): v is Setable => ['number', 'string', 'boolean'].includes(typeof v)
const expectedSetableTypes = (set: Array<Setable>): Array<'number' | 'string' | 'boolean'> =>
  Array.from(new Set(set.map(v => <'number' | 'string' | 'boolean'>typeof v)))

export const VOSet = <T extends Setable>(setValues: Array<T>): VOSetConstructor<T> => {
  for (const [i, v] of Object.entries(setValues))
    if (!isSetable(v)) throw new RawTypeError('number | string | boolean', typeof v, `setValues[${i}]`)

  const set = new Set(setValues)
  const stringSet = Array.from(set).map(x => x.toString())
  const isInSet = (v: any): v is T => set.has(v)
  const expectedTypes = expectedSetableTypes(setValues)

  return class {
    protected _value: T

    constructor(raw: VOSetRaw<T>) {
      if (!expectedTypes.includes(typeof raw as any)) throw new RawTypeError(expectedTypes.join(' | '), typeof raw)
      if (!isInSet(raw)) throw new NotInSetError(stringSet, raw.toString(), '')
      this._value = raw
    }

    valueOf(): T {
      return this._value
    }
  }
}
