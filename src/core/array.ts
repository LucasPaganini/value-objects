import { isLeft } from 'fp-ts/lib/Either'
import { makeFromRaw } from './functions'
import { NativeValueObject, ValueObjectContructor, VOCRawInit, VORaw } from './value-object'
import { RawTypeError, NotIntegerError, MinSizeError, LogicError, MinLengthError, MaxLengthError } from './errors'

export interface VOArrayOptions {
  minLength?: number
  maxLength?: number
  maxErrors?: number
}

export interface VOArrayInstance<VO extends NativeValueObject<any>> extends Array<VO> {
  valueOf(): Array<VORaw<VO>>
}

export interface VOArrayConstructor<VOC extends ValueObjectContructor> {
  new (r: Array<VOCRawInit<VOC>>): VOArrayInstance<InstanceType<VOC>>
}

export const VOArray = <VOC extends ValueObjectContructor>(
  VO: VOC,
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

  return class extends Array<InstanceType<VOC>> {
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
      const valueObjects: Array<InstanceType<VOC>> = []
      const fromRaw = makeFromRaw(VO)

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
          valueObjects.push(either.right)
        }
      }

      if (raw.length !== valueObjects.length) throw Error(`Unknown error`)

      super()
      for (const vo of valueObjects) this.push(vo)
    }

    valueOf(): Array<VORaw<InstanceType<VOC>>> {
      return [...this].map(vo => vo.valueOf())
    }
  }
}
