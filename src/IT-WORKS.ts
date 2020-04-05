interface NativeValueObject<Raw> {
  valueOf(): Raw
}

interface ValueObject<Raw> extends NativeValueObject<Raw> {
  toRaw(): Raw
}

interface ValueObjectContructor<Raw = any, RawInit = Raw> {
  new (r: RawInit): NativeValueObject<Raw>
}

type VORaw<VO extends NativeValueObject<any>> = VO extends ValueObject<any>
  ? ReturnType<VO['toRaw']>
  : VO extends NativeValueObject<infer R>
  ? R
  : never
type VOCRawInit<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor<any, infer T> ? T : never
type VOCRaw<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor ? VORaw<InstanceType<VOC>> : never

class ID implements NativeValueObject<number> {
  constructor(private _value: string) {}

  valueOf() {
    return 78
  }

  toNumber() {
    return 3
  }
}

interface VOArrayInstance<VO extends NativeValueObject<any>> extends Array<VO> {
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

interface VOObjectInstance<O extends VOObjectSchema<O>> extends ValueObject<O> {
  props: VOObjectPropsSchema<O>
  valueOf(): VOObjectRawSchema<O>
  toRaw(): VOObjectRawSchema<O>
}

interface VOObjectConstructor<O extends VOObjectSchema<O>> {
  new (r: VOObjectRawInitSchema<O>): ValueObject<VOObjectRawSchema<O>> & { [P in keyof O]: InstanceType<O[P]> }
}

const VOObject = <O extends VOObjectSchema<O>>(o: O): VOObjectConstructor<O> => {
  return {} as any
}

type Noneable = undefined | null

interface VOOptionalInstance<VO extends NativeValueObject<any>, None extends Noneable> {
  value: VO | None
  valueOf(): VORaw<VO> | None
}

interface VOOptionalConstructor<VOC extends ValueObjectContructor, None extends Noneable> {
  new (r: VOCRawInit<VOC> | None): VOOptionalInstance<InstanceType<VOC>, None>
}

const VOOptional = <VOC extends ValueObjectContructor, None extends Noneable = undefined>(
  voc: VOC,
  nones?: Array<None>,
): VOOptionalConstructor<VOC, None> => {
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

const _OPID = VOOptional(ID, [null, undefined])
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
    return this.car.value !== undefined
  }
}

const ids = new IDs([])

const u = new User({ id: '', ids: [''], idss: [['']], o: { id: '' }, car: '' })
const uu = new _User({ id: '', ids: [''], idss: [['']], o: { id: '' }, car: '' })

u.toRaw().o.id
uu.toRaw().o.id

u.valueOf().o.id
u.valueOf().idss

uu.hasCar()

type VOObjectRawSchema__<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRaw<O[P]> : never
}

type GGG = typeof sss['o']
type HHH = InstanceType<GGG>
type FFF = HHH['toRaw']
type ZZZ = ReturnType<FFF>

interface VOStringInstance {
  valueOf(): string
}

interface VOStringConstructor {
  new (r: string): VOStringInstance
}

interface VOStringOptions {
  trim?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

const VOString = (options: VOStringOptions = {}): VOStringConstructor => {
  return {} as any
}

const SSS = VOString({ minLength: 0, maxLength: 255 })
class ShortString extends SSS {}

type SetableValue = string | number | boolean

interface VOSetInstance<T extends SetableValue> {
  valueOf(): T
}

type VOSetRaw<T extends SetableValue> =
  | (T extends number ? number : never)
  | (T extends string ? string : never)
  | (T extends boolean ? boolean : never)

interface VOSetConstructor<T extends SetableValue> {
  new (r: VOSetRaw<T>): VOSetInstance<T>
}

const VOSet = <T extends SetableValue>(validValues: Array<T>): VOSetConstructor<T> => {
  return {} as any
}

const AccountType = VOSet(['Admin', 'Regular', 123])
new AccountType('123').valueOf()

interface VOIntegerInstance {
  valueOf(): number
}

interface VOIntegerConstructor {
  new (r: number): VOIntegerInstance
}

interface VOIntegerOptions {
  min?: number
  max?: number
}

const VOInteger = (options: VOIntegerOptions = {}): VOIntegerConstructor => {
  return {} as any
}

class Age extends VOInteger({ min: 0, max: 150 }) {
  toMonths() {
    this.valueOf() * 12
  }
}

interface VOFloatInstance {
  valueOf(): number
}

interface VOFloatConstructor {
  new (r: number): VOFloatInstance
}

interface VOFloatOptions {
  min?: number
  max?: number
  precision?: number
  precisionTrim?: 'floor' | 'ceil' | 'round'
}

const VOFloat = (options: VOFloatOptions = {}): VOFloatConstructor => {
  return {} as any
}

const Percentage = VOFloat({ min: 0, max: 100, precision: 2, precisionTrim: 'round' })
