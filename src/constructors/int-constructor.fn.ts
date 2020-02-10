import { ValueObjectConstructor, ValueObject } from '../models'
import { Either, tryCatch, left } from 'fp-ts/lib/Either'
import { MaxLengthError, NonRawTypeError, RawTypeError, MinSizeError, NotIntegerError, MaxSizeError } from 'src/errors'
import { simpleValueObject, createConstructor } from '../utils'

export const IntConstructor = <E extends Error = IntConstructorError>(
  config: IntConstructorConfig = {},
  mapError: (err: IntConstructorError) => E = err => err as any,
): ValueObjectConstructor<E, number> => {
  const _class = createConstructor<ValueObject<number>, number, boolean | undefined>(
    (value: number, trust: boolean = false): ValueObject<number> => {
      if (trust) return simpleValueObject(value)

      if (config.min !== undefined && value < config.min) throw new MinSizeError(config.min, value)
      if (config.max !== undefined && value > config.max) throw new MaxLengthError(config.max, value)
      if (!Number.isInteger(value)) throw new NotIntegerError(value)

      return simpleValueObject(value)
    },
  )

  const fromRaw = (data: number): Either<NonRawTypeError<E>, ReturnType<typeof _class>> =>
    tryCatch(
      () => _class(data, false),
      (err: IntConstructorError) => mapError(err) as NonRawTypeError<E>,
    )

  const fromAny = (data: any): Either<E, ReturnType<typeof _class>> =>
    typeof data === 'number' ? fromRaw(data) : left(mapError(new RawTypeError('number', typeof data)))

  return Object.assign(_class, { fromRaw, fromAny })
}

export interface IntConstructorConfig {
  min?: number
  max?: number
}

export type IntConstructorError = RawTypeError | MaxSizeError | MinSizeError | NotIntegerError
