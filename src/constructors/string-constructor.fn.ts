import { ValueObjectConstructor, ValueObject } from '../models'
import { Either, tryCatch, left } from 'fp-ts/lib/Either'
import { MinLengthError, MaxLengthError, PatternError, NonRawTypeError, RawTypeError } from '../errors'
import { simpleValueObject, createConstructor } from '../utils'

export const StringConstructor = <E extends Error = StringConstructorError>(
  config: StringConstructorConfig = {},
  mapError: (err: StringConstructorError) => E = err => err as any,
): ValueObjectConstructor<E, string> => {
  const _class = createConstructor<ValueObject<string>, string, boolean | undefined>(
    (value: string, trust: boolean = false): ValueObject<string> => {
      if (trust) return simpleValueObject(value)

      if (config.trim) value = value.trim()
      if (config.minLength !== undefined && value.length < config.minLength)
        throw new MinLengthError(config.minLength, value.length)
      if (config.maxLength !== undefined && value.length > config.maxLength)
        throw new MaxLengthError(config.maxLength, value.length)
      if (config.pattern !== undefined && !config.pattern.test(value)) throw new PatternError()

      return simpleValueObject(value)
    },
  )

  const fromRaw = (data: string): Either<NonRawTypeError<E>, ReturnType<typeof _class>> =>
    tryCatch(
      () => _class(data, false),
      (err: StringConstructorError) => mapError(err) as NonRawTypeError<E>,
    )

  const fromAny = (data: any): Either<E, ReturnType<typeof _class>> =>
    typeof data === 'string' ? fromRaw(data) : left(mapError(new RawTypeError('string', typeof data)))

  return Object.assign(_class, { fromRaw, fromAny })
}

export interface StringConstructorConfig {
  trim?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

export type StringConstructorError = MaxLengthError | MinLengthError | PatternError | RawTypeError
