import { NativeValueObject, ValueObjectContructor, VOCRawInit, VORaw } from './value-object'
import { MinLengthError } from './errors'

export interface VOAnyInstance<VO extends NativeValueObject<any>> {
  readonly value: VO
  valueOf(): VORaw<VO>
}

export interface VOAnyConstructor<VOC extends ValueObjectContructor> {
  new (r: VOCRawInit<VOC>): VOAnyInstance<InstanceType<VOC>>
}

export const VOAny = <VOC extends ValueObjectContructor>(VOs: Array<VOC>): VOAnyConstructor<VOC> => {
  if (VOs.length < 1) throw new MinLengthError(1, VOs.length)

  return class {
    public readonly value: InstanceType<VOC>

    constructor(raw: VOCRawInit<VOC>) {
      const errors: Array<any> = []
      for (const VO of VOs) {
        try {
          const valueObject = <InstanceType<VOC>>new VO(raw)
          this.value = valueObject
          return
        } catch (err) {
          errors.push(err)
        }
      }
      throw errors
    }

    valueOf(): VORaw<InstanceType<VOC>> {
      return this.value.valueOf()
    }
  }
}
