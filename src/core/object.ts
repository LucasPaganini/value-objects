import { isLeft } from '../utils'
import { MinSizeError, NotIntegerError, RawTypeError } from './errors'
import { makeFromRawInit } from './functions'
import { ValueObject, ValueObjectContructor, VOCRaw, VOCRawInit } from './value-object'

export interface VOObjectOptions {
  maxErrors?: number
}

type VOObjectSchema<O> = { [P in keyof O]: ValueObjectContructor }
type VOObjectRawInitSchema<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRawInit<O[P]> : never
}
type VOObjectRawSchema<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRaw<O[P]> : never
}

export type VOObjectInstance<O extends VOObjectSchema<O>> = ValueObject<VOObjectRawSchema<O>> &
  { [P in keyof O]: InstanceType<O[P]> }

export interface VOObjectConstructor<O extends VOObjectSchema<O>> {
  new (r: VOObjectRawInitSchema<O>): VOObjectInstance<O>
}

export const VOObject = <O extends VOObjectSchema<O>>(
  schema: O,
  options: VOObjectOptions = {},
): VOObjectConstructor<O> => {
  if (options.maxErrors !== undefined) {
    if (typeof options.maxErrors !== 'number')
      throw new RawTypeError('number', typeof options.maxErrors, 'options.maxErrors')
    if (!Number.isInteger(options.maxErrors)) throw new NotIntegerError(options.maxErrors, 'options.maxErrors')
    if (options.maxErrors < 0) throw new MinSizeError(options.maxErrors, 0)
  }

  const maxErrors = options.maxErrors ?? 1

  return <any>class {
    constructor(raw: VOObjectRawInitSchema<O>) {
      if (raw === undefined || raw === null) throw new RawTypeError('object', typeof raw, 'raw')

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

    valueOf(): VOObjectRawSchema<O> {
      return Object.keys(schema).reduce<any>((acc, key) => {
        acc[key] = (<any>this)[key].valueOf()
        return acc
      }, {})
    }

    toRaw(): VOObjectRawSchema<O> {
      return this.valueOf()
    }
  }
}
