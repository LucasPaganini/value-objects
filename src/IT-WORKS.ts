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
type VOObjectPropsSchema<O extends VOObjectSchema<O>> = { [P in keyof O]: InstanceType<O[P]> }

interface VOObjectInstance<O extends VOObjectSchema<O>> {
  props: VOObjectPropsSchema<O>
  valueOf(): VOObjectRawSchema<O>
}

interface VOObjectConstructor<O extends VOObjectSchema<O>> {
  new (r: VOObjectRawInitSchema<O>): VOObjectInstance<O>
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

class __IDs extends IDs {
  test() {
    return true
  }
  kkkk() {
    return ''
  }
}

const _OPID = VOOptional(ID)
class OPID extends _OPID {
  rhduahrua() {
    return 1
  }
}

const sss = {
  id: ID,
  ids: __IDs,
  idss: _IDs,
  o: VOObject({ id: ID }),
  car: OPID,
}

const User = VOObject(sss)

class _User extends User {
  hasCar(): boolean {
    return this.props.car.value !== undefined
  }
}

const ids = new IDs([])

const u = new User({ id: '', ids: [''], idss: [['']], o: { id: '' }, car: '' })
const uu = new _User({ id: '', ids: [''], idss: [['']], o: { id: '' }, car: '' })

u.valueOf().o.id
uu.valueOf().o.id

type VOObjectRawSchema__<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRaw<O[P]> : never
}

type GGG = typeof sss['o']
type HHH = InstanceType<GGG>
type FFF = HHH['valueOf']

Object.assign
