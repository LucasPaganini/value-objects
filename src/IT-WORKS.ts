import { NativeValueObject, VOArray, VOInteger, VOOptional, VOSet, VOString, VOFloat } from './core'

class ID implements NativeValueObject<number> {
  constructor(private _value: string) {}

  valueOf() {
    return 78
  }

  toNumber() {
    return 3
  }
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

const SSS = VOString({ minLength: 0, maxLength: 255 })
class ShortString extends SSS {}

const AccountType = VOSet(['Admin', 'Regular', 123])
new AccountType('123').valueOf()

class Age extends VOInteger({ min: 0, max: 150 }) {
  toMonths() {
    this.valueOf() * 12
  }
}

const Percentage = VOFloat({ min: 0, max: 100, precision: 2, precisionTrim: 'round' })
