import { Noneable, RawTypeError, VOOptional } from '../..'

describe('VOOptional', () => {
  class Base {
    constructor(raw: number) {}
    valueOf(): 'base test' {
      return 'base test'
    }
  }

  it('Should return a class that can be extended', () => {
    class Test extends VOOptional(Base) {
      test() {
        return 'test'
      }
    }

    const instance = new Test(123)
    expect(instance.test()).toBe('test')
  })

  it('Should throw on base class creation if one of the values in the nones is not Noneable', () => {
    const tests = nonNoneableValues.map(nonNoneable => [...noneableValues, nonNoneable])

    for (const test of tests) {
      const fn = () => VOOptional(Base, <Array<any>>test)
      expect(fn).toThrowError('Wrong raw value type')
    }
  })

  it('Should adapt the raw value types it expects according to the nones values', () => {
    const tests = [
      { type: 'undefined', nones: [undefined] },
      { type: 'null', nones: [null] },
      { type: 'undefined | null', nones: [undefined, null] },
      { type: '', nones: [] },
    ]

    class Base {
      constructor(raw: number) {
        throw new RawTypeError('number', typeof raw)
      }
    }

    for (const test of tests) {
      const Test = VOOptional(Base, test.nones)
      const raw = new Date()
      const fn = () => new Test(raw as any)

      expect(fn).toThrowError('Wrong raw value type')
      expect(fn).toThrowMatching(err => {
        const errorType = err.expected.split(' | ')
        const testType = test.type
          .split(' | ')
          .concat('number')
          .filter(type => type !== '')
        return testType.every(type => errorType.includes(type))
      })
    }
  })

  it("Should return some if it' a some raw value", () => {
    class Test extends VOOptional(Base) {}
    const instance = new Test(123)

    expect(instance.isSome()).toBe(true)
    expect(instance.isNone()).toBe(false)
    expect(instance.value instanceof Base).toBe(true)
    expect(instance.value!.valueOf()).toBe('base test')
  })

  it("Should return none if it's a none raw value", () => {
    const tests = [
      { nones: [null], raw: null },
      { nones: [undefined], raw: undefined },
      { nones: [undefined, null], raw: undefined },
      { nones: [undefined, null], raw: null },
    ]

    for (const test of tests) {
      class Test extends VOOptional(Base, test.nones) {}
      const instance = new Test(test.raw)

      expect(instance.isNone()).toBe(true)
      expect(instance.isSome()).toBe(false)
      expect(instance.value instanceof Base).toBe(false)
      expect(instance.value).toBe(test.raw)
    }
  })
})

const noneableValues: Array<Noneable> = [null, undefined]
const nonNoneableValues = [0, false, []]
