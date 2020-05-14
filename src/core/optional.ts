import { NativeValueObject, ValueObjectContructor, VOCRawInit, VORaw, VOCRaw } from './value-object'
import { RawTypeError } from './errors'

export type Noneable = undefined | null
const NONEABLES: Array<Noneable> = [undefined, null]
const isNoneable = (v: any): v is Noneable => NONEABLES.includes(v)

export interface VOOptionalInstance<VO extends NativeValueObject<any>, None extends Noneable> {
  value: VO | None
  isSome(): boolean
  isNone(): boolean
  valueOf(): VORaw<VO> | None
}

export interface VOOptionalConstructor<VOC extends ValueObjectContructor, None extends Noneable> {
  new (r: VOCRawInit<VOC> | None): VOOptionalInstance<InstanceType<VOC>, None>
}

const expectedNoneableTypes = (nones: Array<Noneable>): Array<'undefined' | 'null'> =>
  Array.from(new Set(nones.map(v => (v === undefined ? 'undefined' : 'null'))))

export const VOOptional = <VOC extends ValueObjectContructor, None extends Noneable = undefined>(
  VO: VOC,
  nones?: Array<None>,
): VOOptionalConstructor<VOC, None> => {
  const _nones = nones ?? [<None>undefined]
  for (const [i, v] of Object.entries(_nones)) {
    if (!isNoneable(v)) throw new RawTypeError(NONEABLES.join(' | '), v, `nones[${i}]`)
  }

  const isInNones = (v: any): v is None => _nones.includes(v)
  const expectedTypes = expectedNoneableTypes(_nones)

  return class {
    public readonly value: InstanceType<VOC> | None

    public isSome(): boolean {
      return !this.isNone()
    }

    public isNone(): boolean {
      return _nones.some(none => none === this.value)
    }

    constructor(raw: VOCRawInit<VOC> | None) {
      if (isInNones(raw)) {
        this.value = raw
        return
      }

      try {
        const valueObject = <InstanceType<VOC>>new VO(raw)
        this.value = valueObject
      } catch (err) {
        if (RawTypeError.is(err)) {
          ;(<any>err).expected += ' | ' + expectedTypes.join(' | ')
        }
        throw err
      }
    }

    valueOf(): VOCRaw<VOC> | None {
      return this.isNone() ? this.value : this.value?.valueOf()
    }
  }
}
