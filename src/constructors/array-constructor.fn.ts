import { Either, isRight, Right } from 'fp-ts/lib/Either'
import { Email } from '../lib'
import { ValueObjectConstructor, ValueObject } from '../models'

export const ArrayConstructor = <E extends Error, VO extends ValueObjectConstructor<any, any>>(
  valueObjectConstructor: VO,
  config: ArrayConstructorConfig = {},
): ValueObjectConstructor<E, ArrayRaw<VO>, ValueObject<ArrayRaw<VO>> & Array<VO>> => ({} as any)

type ArrayRaw<VO extends ValueObjectConstructor<any, any>> = Array<
  RawValueObject<UnpackedEitherRight<ReturnType<VO['fromAny']>>>
>

export interface ArrayConstructorConfig {}

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

const Emails = ArrayConstructor(Email)
const eee = Emails.fromAny('')
if (isRight(eee)) {
  eee.right
}

type RawValueObject<VO extends ValueObject<any>> = VO extends ValueObject<infer Raw> ? Raw : never

type UnpackedEitherRight<E extends Either<any, any>> = E extends Right<infer R> ? R : never
type A = UnpackedEitherRight<Either<Error, string>>

type BBB = RawObjectConstructorSchema<{ ddd: typeof Email }>

type CCC = RawValueObject<UnpackedEitherRight<ReturnType<typeof Email['fromAny']>>>
