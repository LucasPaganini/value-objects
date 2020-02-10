import { Either } from 'fp-ts/lib/Either'
import { ValueObject } from './value-object.type';

export interface ValueObjectConstructor<E, RawInit, RawValue = RawInit> {
  new(value: RawInit, trust?: boolean): ValueObject<RawValue>
  (value: RawInit, trust?: boolean): ValueObject<RawValue>
  fromRaw(data: RawInit): Either<E, ValueObject<RawValue>>
  fromAny(data: any): Either<E, ValueObject<RawValue>>
}