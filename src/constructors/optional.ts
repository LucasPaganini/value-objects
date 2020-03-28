import { Either, Right } from 'fp-ts/lib/Either'
import { Option, isSome } from 'fp-ts/lib/Option'
import { Email, ID } from '../lib'
import {
  RawValueFromValueObjectConstructor as VOCRaw,
  ValueObject,
  ValueObjectConstructor,
  VOCInstance,
} from '../models'

export const VOOptional = <E extends Error, VOC extends ValueObjectConstructor<any, any>, D = undefined>(
  valueObjectConstructor: VOC,
  defaultValue: D | undefined = undefined,
): ValueObjectConstructor<E, VOCRaw<VOC> | D, ValueObject<VOCRaw<VOC> | D> & Option<VOCInstance<VOC>>> => ({} as any)

type Raw<VOC extends ValueObjectConstructor<any, any>> = RawValueObject<UnpackedEitherRight<ReturnType<VOC['fromAny']>>>

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

const Emailss = VOOptional(Email)
const ee = Emailss(undefined)
if (isSome(ee)) ee.value

const IDs = ArrayConstructor(ID)
const eee = Emails([''])
IDs([''])

type RawValueObject<VO extends ValueObject<any>> = VO extends ValueObject<infer Raw> ? Raw : never

type UnpackedEitherRight<E extends Either<any, any>> = E extends Right<infer R> ? R : never
type A = UnpackedEitherRight<Either<Error, string>>

type BBB = RawObjectConstructorSchema<{ ddd: typeof Email }>

type CCC = RawValueObject<UnpackedEitherRight<ReturnType<typeof Email['fromAny']>>>
