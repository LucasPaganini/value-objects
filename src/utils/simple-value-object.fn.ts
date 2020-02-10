import { ValueObject } from '../models'

export const simpleValueObject = <T>(value: T): ValueObject<T> => ({
  value,
  valueOf: () => value,
  toJSON: () => value,
})
