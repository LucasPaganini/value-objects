import { expectTypeOf } from 'expect-type'
import { VOAny } from '../..'
import { constructorFn } from './utils'

describe('VOAny', () => {
  class BaseA {
    constructor(number: 123) {
      if (number !== 123) throw Error()
    }
    valueOf(): 'baseA' {
      return 'baseA'
    }
  }

  class BaseB {
    constructor(number: 456) {
      if (number !== 456) throw Error()
    }
    valueOf(): 'baseB' {
      return 'baseB'
    }
  }

  it('Should return a class that can be extended', () => {
    class Test extends VOAny([BaseA, BaseB]) {
      test() {
        return 'test'
      }
    }

    const instance = new Test(123)
    expect(instance.test()).toBe('test')
  })

  it('Should throw on base class creation if the value objects array is empty', () => {
    const fn = () => VOAny([])
    expect(fn).toThrowError('Too short')
  })

  it("Should return a value object instance if it's a valid raw value", () => {
    const tests = [
      { raw: 123, class: BaseA },
      { raw: 456, class: BaseB },
    ] as const
    class Test extends VOAny([BaseA, BaseB]) {}

    for (const test of tests) {
      const directInstance = new (<any>test.class)(test.raw)
      const v = directInstance.valueOf()

      const instance = new Test(test.raw)
      expect(instance.value instanceof test.class).toBe(true)
      expect(instance.value.valueOf()).toBe(v)
    }
  })

  it('Should throw if it fails to instantiate all inner classes', () => {
    const tests = [789, undefined, null, 'abc']
    class Test extends VOAny([BaseA, BaseB]) {}

    for (const test of tests) {
      const fn = () => new Test(test as any)
      expect(fn).toThrow()
    }
  })

  it('Should have the correct types', () => {
    class Test extends VOAny([BaseA, BaseB]) {}

    expectTypeOf(constructorFn(Test)).toEqualTypeOf<(r: 123 | 456) => Test>()
    expectTypeOf(new Test(123).valueOf()).toEqualTypeOf<'baseA' | 'baseB'>()
    expectTypeOf(new Test(123).value).toEqualTypeOf<BaseA | BaseB>()
  })
})
