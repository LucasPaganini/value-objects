import { ValueObjectConstructor } from './value-object-constructor.type'
import { Either, Right } from 'fp-ts/lib/Either'

export type RawValueFromValueObjectConstructor<VOC extends ValueObjectConstructor<any, any>> = FirstParameter<
  VOC['fromRaw']
>

type FirstParameter<F extends (...args: any[]) => any> = F extends (a: infer A) => any
  ? A
  : F extends (a: infer A, b: any) => any
  ? A
  : never

export type VOCInstance<VOC extends ValueObjectConstructor<any, any>> = UnpackedEitherRight<ReturnType<VOC['fromRaw']>>
type UnpackedEitherRight<E extends Either<any, any>> = E extends Right<infer R> ? R : never
