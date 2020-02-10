import { ValueObjectConstructor, ValueObject } from '../models'
import { Either, tryCatch, left } from 'fp-ts/lib/Either'
import { MaxLengthError, NonRawTypeError, RawTypeError, MinSizeError, MaxSizeError } from '../errors'
import { simpleValueObject, createConstructor } from '../utils'


export const FloatConstructor = <E extends Error = FloatConstructorError>(
  config: FloatConstructorConfig = {},
  mapError: (err: FloatConstructorError) => E = err => err as any,
): ValueObjectConstructor<E, number> => {
  const precisionPower = 10 ** (config.precision || 0)
  const precisionTrim = config.precisionTrim || 'round'

  const _class = createConstructor<ValueObject<number>, number, boolean | undefined>(
    (value: number, trust: boolean = false): ValueObject<number> => {
      if (trust) return simpleValueObject(value)

      if (config.precision !== undefined) value = Math[precisionTrim](value * precisionPower) / precisionPower
      if (config.min !== undefined && value < config.min) throw new MinSizeError(config.min, value)
      if (config.max !== undefined && value > config.max) throw new MaxLengthError(config.max, value)

      return simpleValueObject(value)
    },
  )

  const fromRaw = (data: number): Either<NonRawTypeError<E>, ReturnType<typeof _class>> =>
    tryCatch(
      () => _class(data, false),
      (err: FloatConstructorError) => mapError(err) as NonRawTypeError<E>,
    )

  const fromAny = (data: any): Either<E, ReturnType<typeof _class>> =>
    typeof data === 'number' ? fromRaw(data) : left(mapError(new RawTypeError('number', typeof data)))

  return Object.assign(_class, { fromRaw, fromAny })
}

export interface FloatConstructorConfig {
  min?: number
  max?: number
  precision?: number
  precisionTrim?: 'floor' | 'ceil' | 'round'
}

export type FloatConstructorError = RawTypeError | MaxSizeError | MinSizeError
