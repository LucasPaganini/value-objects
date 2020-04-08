import { NativeValueObject, ValueObjectContructor, VOCRawInit, VORaw } from './value-object'

export type Noneable = undefined | null

export interface VOOptionalInstance<VO extends NativeValueObject<any>, None extends Noneable> {
  value: VO | None
  valueOf(): VORaw<VO> | None
}

export interface VOOptionalConstructor<VOC extends ValueObjectContructor, None extends Noneable> {
  new (r: VOCRawInit<VOC> | None): VOOptionalInstance<InstanceType<VOC>, None>
}

export const VOOptional = <VOC extends ValueObjectContructor, None extends Noneable = undefined>(
  voc: VOC,
  nones?: Array<None>,
): VOOptionalConstructor<VOC, None> => {
  return {} as any
}
