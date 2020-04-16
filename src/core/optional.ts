import { NativeValueObject, ValueObjectContructor, VOCRawInit, VORaw, VOCRaw } from './value-object'
import { RawTypeError } from './errors'

export type Noneable = undefined | null
const NONEABLES: Array<Noneable> = [undefined, null]
const isNoneable = (v: any): v is Noneable => NONEABLES.includes(v)

export interface VOOptionalNoneInstance<None extends Noneable> {
  value: None
  isSome(): false
  isNone(): true
  valueOf(): None
}

export interface VOOptionalSomeInstance<VO extends NativeValueObject<any>> {
  value: VO
  isSome(): true
  isNone(): false
  valueOf(): VORaw<VO>
}

export type VOOptionalInstance<VO extends NativeValueObject<any>, None extends Noneable> =
  | VOOptionalNoneInstance<None>
  | VOOptionalSomeInstance<VO>

export interface VOOptionalConstructor<VOC extends ValueObjectContructor, None extends Noneable> {
  new (r: VOCRawInit<VOC> | None): VOOptionalInstance<InstanceType<VOC>, None>
}

export const VOOptional = <VOC extends ValueObjectContructor, None extends Noneable = undefined>(
  VO: VOC,
  nones?: Array<None>,
): VOOptionalConstructor<VOC, None> => {
  const _nones = nones ?? []
  for (const [i, v] of Object.entries(_nones)) {
    if (!isNoneable(v)) throw new RawTypeError(NONEABLES.join(' | '), v, `nones[${i}]`)
  }

  return <any>class {
    public readonly value: InstanceType<VOC> | None

    public isSome(): boolean {
      return !this.isNone()
    }

    public isNone(): boolean {
      return _nones.some(none => none === this.value)
    }

    constructor(raw: VOCRawInit<VOC> | None) {
      for (const none of _nones)
        if (raw === none) {
          this.value = raw
          return
        }

      const valueObject = <InstanceType<VOC>>new VO(raw)
      this.value = valueObject
    }

    valueOf(): VOCRaw<VOC> | None {
      return this.isNone() ? this.value : this.value?.valueOf()
    }
  }
}
