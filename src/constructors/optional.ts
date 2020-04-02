import { Option } from 'fp-ts/lib/Option'
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

export interface ArrayConstructorConfig {}
