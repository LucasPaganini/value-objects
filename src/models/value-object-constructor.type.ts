import { Either } from 'fp-ts/lib/Either'
import { ValueObject } from './value-object.type'

export interface ValueObjectConstructor<E, RawInit, VO extends ValueObject<any> = ValueObject<RawInit>> {
  new (value: RawInit, trust?: boolean): VO
  (value: RawInit, trust?: boolean): VO
  fromRaw(data: RawInit): Either<E, VO>
  fromAny(data: any): Either<E, VO>
}
