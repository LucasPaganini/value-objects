export interface NativeValueObject<Raw> {
  valueOf(): Raw
}

export interface ValueObject<Raw> extends NativeValueObject<Raw> {
  toRaw(): Raw
}

export interface ValueObjectContructor<Raw = any, RawInit = Raw> {
  new (r: RawInit): NativeValueObject<Raw>
}

export type VORaw<VO extends NativeValueObject<any>> = VO extends ValueObject<any>
  ? ReturnType<VO['toRaw']>
  : VO extends NativeValueObject<infer R>
  ? R
  : never
export type VOCRawInit<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor<any, infer T> ? T : never
export type VOCRaw<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor
  ? VORaw<InstanceType<VOC>>
  : never
