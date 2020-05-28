export interface ValueObject<Raw> {
  valueOf(): Raw
}

export interface ValueObjectWorkAround<Raw> extends ValueObject<Raw> {
  toRaw(): Raw
}

export interface ValueObjectContructor<Raw = any, RawInit = Raw> {
  new (r: RawInit): ValueObject<Raw>
}

export type VORaw<VO extends ValueObject<any>> = VO extends ValueObjectWorkAround<any>
  ? ReturnType<VO['toRaw']>
  : VO extends ValueObject<infer R>
  ? R
  : never
export type VOCRawInit<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor<any, infer T> ? T : never
export type VOCRaw<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor
  ? VORaw<InstanceType<VOC>>
  : never
