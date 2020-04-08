import { isLeft } from 'fp-ts/lib/Either'
import { makeFromRaw } from './functions'
import { NativeValueObject, ValueObjectContructor, VOCRawInit, VORaw } from './value-object'

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
  return class extends Array<InstanceType<VOC>> {
    constructor(raws: Array<VOCRawInit<VOC>>) {
      if (!Array.isArray(raws)) {
        const err = Error(`Invalid raw value`)
        ;(err as any).expected = 'Array<Raw>'
        ;(err as any).actual = typeof raws
        throw err
      }

      if (options.minLength !== undefined && (!Number.isInteger(options.minLength) || options.minLength < 0)) {
        throw Error(`Min length should be a positive integer`)
      }
      if (options.minLength !== undefined && raws.length < options.minLength) {
        const err = Error(`Array is too short`)
        ;(err as any).minLength = options.minLength
        throw err
      }

      if (options.maxLength !== undefined && (!Number.isInteger(options.maxLength) || options.maxLength < 0)) {
        throw Error(`Max length should be a positive integer`)
      }
      if (options.maxLength !== undefined && raws.length > options.maxLength) {
        const err = Error(`Array is too long`)
        ;(err as any).maxLength = options.maxLength
        throw err
      }

      const maxErrors = options.maxErrors ?? 1
      const errors: Array<Error> = []
      const valueObjects: Array<InstanceType<VOC>> = []
      const fromRaw = makeFromRaw(VO)
      for (const [_i, raw] of Object.entries(raws)) {
        const index = parseInt(_i)
        const either = fromRaw(raw)
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

      if (raws.length !== valueObjects.length) throw Error(`Unknown error`)

      super(...valueObjects)
    }

    valueOf(): Array<VORaw<InstanceType<VOC>>> {
      return this.map(vo => vo.valueOf())
    }
  }
}
