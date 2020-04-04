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

type VOArrayInstance<VOC extends ValueObjectContructor> = ValueObject<Array<VOCRaw<VOC>>> & Array<InstanceType<VOC>>

interface VOArrayConstructor<VOC extends ValueObjectContructor> {
  new (r: Array<VOCRawInit<VOC>>): ValueObject<Array<VOCRaw<VOC>>> & Array<InstanceType<VOC>>
}

const VOArray = <VOC extends ValueObjectContructor>(voc: VOC): VOArrayConstructor<VOC> => {
  return {} as any
}

const IDs = VOArray(ID)
const _IDs = VOArray(IDs)

new _IDs([['']]).map(x => x.map(y => y.valueOf()))

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

const User = VOObject({
  id: ID,
  ids: IDs,
})

const ids = new IDs([])
ids.map(x => x.valueOf())

new User({ id: '', ids: [''] }).valueOf()
