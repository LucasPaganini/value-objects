interface ValueObject<Raw> {
  valueOf(): Raw
}

interface ValueObjectContructor<Raw = any, RawInit = Raw> {
  new (r: RawInit): ValueObject<Raw>
}

type VORaw<VO extends ValueObject<any>> = VO extends ValueObject<infer R> ? R : never
type VOCRawInit<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor<any, infer T> ? T : never
type VOCRaw<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor ? VORaw<InstanceType<VOC>> : never

class ID implements ValueObject<number> {
  constructor(private _value: string) {}

  valueOf() {
    return 78
  }

  toNumber() {
    return 3
  }
}

interface VOArrayInstance<VO extends ValueObject<any>> extends Array<VO> {
  valueOf(): Array<VORaw<VO>>
}

interface VOArrayConstructor<VOC extends ValueObjectContructor> {
  new (r: Array<VOCRawInit<VOC>>): VOArrayInstance<InstanceType<VOC>>
}

const VOArray = <VOC extends ValueObjectContructor>(voc: VOC): VOArrayConstructor<VOC> => {
  return {} as any
}

type VOObjectSchema<O> = { [P in keyof O]: ValueObjectContructor }
type VOObjectRawInitSchema<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRawInit<O[P]> : never
}
type VOObjectRawSchema<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRaw<O[P]> : never
}

interface VOObjectConstructor<O extends VOObjectSchema<O>>
  extends ValueObjectContructor<VOObjectRawSchema<O>, VOObjectRawInitSchema<O>> {
  new (r: VOObjectRawInitSchema<O>): ValueObject<VOObjectRawSchema<O>> & { [P in keyof O]: InstanceType<O[P]> }
}

const VOObject = <O extends VOObjectSchema<O>>(o: O): VOObjectConstructor<O> => {
  return {} as any
}

interface VOOptionalInstance<VO extends ValueObject<any>> {
  value?: VO
  valueOf(): VORaw<VO> | undefined
}

interface VOOptionalConstructor<VOC extends ValueObjectContructor> {
  new (r: VOCRawInit<VOC> | undefined): VOOptionalInstance<InstanceType<VOC>>
}

const VOOptional = <VOC extends ValueObjectContructor>(voc: VOC): VOOptionalConstructor<VOC> => {
  return {} as any
}

const IDs = VOArray(ID)
const _IDs = VOArray(IDs)

const User = VOObject({
  id: ID,
  ids: IDs,
  idss: _IDs,
  o: VOObject({ id: ID }),
  car: VOOptional(ID),
})

const ids = new IDs([])

new User({ id: '', ids: [''], idss: [['']], o: { id: '' }, car: undefined }).id
