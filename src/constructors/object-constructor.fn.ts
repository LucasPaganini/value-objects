import { Either, isRight, Right } from 'fp-ts/lib/Either'
import { Email } from '../lib'
import { ValueObjectConstructor, ValueObject } from '../models'

export const ObjectConstructor = <E extends Error, O extends ObjectConstructorSchema<O>>(
  schema: O,
  config: ObjectConstructorConfig = {},
): ObjectConstructorReturn<E, O> => ({} as any)

export interface ObjectConstructorConfig {}

type ObjectConstructorSchema<O> = {
  [P in keyof O]: ValueObjectConstructor<any, any>
}

type ObjectConstructorSchemaValueObjects<O extends ObjectConstructorSchema<O>> = {
  [P in keyof O]: UnpackedEitherRight<ReturnType<O[P]['fromAny']>>
}

type RawObjectConstructorSchema<O extends ObjectConstructorSchema<O>> = {
  [P in keyof O]: RawValueObject<UnpackedEitherRight<ReturnType<O[P]['fromAny']>>>
}

type ObjectConstructorReturn<E extends Error, O extends ObjectConstructorSchema<O>> = ValueObjectConstructor<
  E,
  RawObjectConstructorSchema<O>,
  ValueObject<RawObjectConstructorSchema<O>> & ObjectConstructorSchemaValueObjects<O>
>

const User = ObjectConstructor({ d: Email })
const uu = User.fromAny('')
if (isRight(uu)) {
  uu.right.d
}

type RawValueObject<VO extends ValueObject<any>> = VO extends ValueObject<infer Raw> ? Raw : never

type UnpackedEitherRight<E extends Either<any, any>> = E extends Right<infer R> ? R : never
type A = UnpackedEitherRight<Either<Error, string>>

type BBB = RawObjectConstructorSchema<{ ddd: typeof Email }>

type CCC = RawValueObject<UnpackedEitherRight<ReturnType<typeof Email['fromAny']>>>
