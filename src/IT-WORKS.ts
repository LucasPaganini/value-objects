import { Either, right, left, isLeft } from 'fp-ts/lib/Either'

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

export interface VOArrayOptions {
  minLength?: number
  maxLength?: number
  maxErrors?: number
}

interface VOArrayInstance<VO extends NativeValueObject<any>> extends Array<VO> {
  valueOf(): Array<VORaw<VO>>
}

interface VOArrayConstructor<VOC extends ValueObjectContructor> {
  new (r: Array<VOCRawInit<VOC>>): VOArrayInstance<InstanceType<VOC>>
}

const VOArray = <VOC extends ValueObjectContructor>(VO: VOC, options: VOArrayOptions = {}): VOArrayConstructor<VOC> => {
  return class extends Array<InstanceType<VOC>> {
    constructor(raws: Array<VOCRawInit<VOC>>) {
      if (!Array.isArray(raws)) {
        const err = Error(`Invalid raw value`)
        ;(err as any).expected = 'Array<Raw>'
        ;(err as any).actual = typeof raws
        throw err
      }

      if (options.minLength !== undefined && (!Number.isInteger(options.minLength) || options.minLength < 0)) {
        throw Error(`Min length should be a positive integer`)
      }
      if (options.minLength !== undefined && raws.length < options.minLength) {
        const err = Error(`Array is too short`)
        ;(err as any).minLength = options.minLength
        throw err
      }

      if (options.maxLength !== undefined && (!Number.isInteger(options.maxLength) || options.maxLength < 0)) {
        throw Error(`Max length should be a positive integer`)
      }
      if (options.maxLength !== undefined && raws.length > options.maxLength) {
        const err = Error(`Array is too long`)
        ;(err as any).maxLength = options.maxLength
        throw err
      }

      const maxErrors = options.maxErrors ?? 1
      const errors: Array<Error> = []
      const valueObjects: Array<InstanceType<VOC>> = []
      const fromRaw = makeFromRaw(VO)
      for (const [_i, raw] of Object.entries(raws)) {
        const index = parseInt(_i)
        const either = fromRaw(raw)
        if (isLeft(either)) {
          const errorsWithIndex = either.left.map(e => {
            ;(e as any).index = index
            return e
          })
          errors.push(...errorsWithIndex)
          if (errors.length >= maxErrors) throw errors
        } else {
          valueObjects.push(either.right)
        }
      }

      if (raws.length !== valueObjects.length) throw Error(`Unknown error`)

      super(...valueObjects)
    }

    valueOf(): Array<VORaw<InstanceType<VOC>>> {
      return this.map(vo => vo.valueOf())
    }
  }
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

export interface VOObjectOptions {
  maxErrors?: number
}

const VOObject = <O extends VOObjectSchema<O>>(o: O, options: VOObjectOptions = {}): VOObjectConstructor<O> => {
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

const makeFromAny = <VOC extends ValueObjectContructor>(VO: VOC) => (
  data: any,
): Either<Array<Error>, InstanceType<VOC>> => {
  try {
    return right(new VO(data) as any)
  } catch (err) {
    if (err instanceof Error) return left([err])
    if (err instanceof Array && err.every(e => e instanceof Error)) return left(err)
    return left([Error()])
  }
}

const getData = makeFromAny(_User)
getData(324)

const makeFromRaw = <VOC extends ValueObjectContructor>(VO: VOC) => {
  const fromAny = makeFromAny(VO)
  return (data: VOCRawInit<VOC>): Either<Array<Error>, InstanceType<VOC>> => fromAny(data)
}

const makeIsRaw = <VOC extends ValueObjectContructor>(VO: VOC) => (v: any): v is VOCRaw<VOC> => {
  try {
    new VO(v)
    return true
  } catch {
    return false
  }
}

const isRawAccountType = makeIsRaw(AccountType)

const makeIs = <VOC extends ValueObjectContructor>(VO: VOC) => (v: any): v is InstanceType<VOC> => v instanceof VO

const toRaw = <VO extends NativeValueObject<any>>(vo: VO): VO extends NativeValueObject<infer Raw> ? Raw : never =>
  vo.valueOf()

const hhh = new ID('')
const ooo = toRaw(hhh)
