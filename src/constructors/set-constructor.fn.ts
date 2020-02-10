import { ValueObjectConstructor, ValueObject } from '../models'
import { Either, tryCatch, left } from 'fp-ts/lib/Either'
import { NotFoundError, NonRawTypeError, RawTypeError } from 'src/errors'
import { simpleValueObject, createConstructor } from '../utils'

export const StringSetConstructor = <T extends string, E extends Error = StringSetConstructorError>(
  validValues: Array<T>,
  config: StringSetConstructorConfig = {},
  mapError: (err: StringSetConstructorError) => E = err => err as any,
): ValueObjectConstructor<E, string, T> => {
  const set = new Set(validValues)

  const _class = createConstructor<ValueObject<T>, string, boolean | undefined>(
    (value: string, trust: boolean = false): ValueObject<T> => {
      if (trust) return simpleValueObject(<T>value)

      if (config.trim) value = value.trim()
      if (!set.has(<T>value)) throw new NotFoundError()

      return simpleValueObject(<T>value)
    },
  )

  const fromRaw = (data: string): Either<NonRawTypeError<E>, ReturnType<typeof _class>> =>
    tryCatch(
      () => _class(data, false),
      (err: StringSetConstructorError) => mapError(err) as NonRawTypeError<E>,
    )

  const fromAny = (data: any): Either<E, ReturnType<typeof _class>> =>
    typeof data === 'string' ? fromRaw(data) : left(mapError(new RawTypeError('string', typeof data)))

  return Object.assign(_class, { fromRaw, fromAny })
}

export interface StringSetConstructorConfig {
  trim?: boolean
}

export type StringSetConstructorError = RawTypeError | NotFoundError
