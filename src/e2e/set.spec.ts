import { expectTypeOf } from 'expect-type'
import { VOSet } from '../..'
import { constructorFn } from './utils'

describe('VOSet', () => {
  it('Should return a class that can be extended', () => {
    class Test extends VOSet(['_test']) {
      test() {
        return 'test'
      }
    }

    const instance = new Test('_test')
    expect(instance.test()).toBe('test')
  })

  it('Should throw on base class creation if one of the values in the set is not Setable', () => {
    const tests = nonSetableValues.map(nonSetable => [...setableValues, nonSetable])

    for (const test of tests) {
      const fn = () => VOSet(test as Array<any>)
      expect(fn).toThrowError('Wrong raw value type')
    }
  })

  it('Should adapt the raw value types it expects according to the set values', () => {
    const tests = [
      { type: 'string', set: ['a', 'b', '\t', '\n'] },
      { type: 'number', set: [1, 2, 3, -1, -2, -3, 0] },
      { type: 'boolean', set: [true] },
      { type: 'boolean', set: [false] },
      { type: 'boolean | string', set: [false, 'true'] },
      { type: 'boolean | number', set: [true, 1] },
      { type: 'string | number', set: ['123', 1] },
      { type: 'string | number | boolean', set: ['123', 1, true] },
    ]

    for (const test of tests) {
      const Test = VOSet(test.set)
      const raw = new Date()
      const fn = () => new Test(raw as any)

      expect(fn).toThrowError('Wrong raw value type')
      expect(fn).toThrowMatching(err => {
        const errorType = err.expected.split(' | ')
        const testType = test.type.split(' | ')
        return testType.every(type => errorType.includes(type))
      })
    }
  })

  it('Should throw if the raw value is not in the set', () => {
    const tests = [
      { not: 'c', set: ['a', 'b', '\t', '\n'] },
      { not: 4, set: [1, 2, 3, -1, -2, -3, 0] },
      { not: false, set: [true] },
      { not: true, set: [false] },
      { not: 'false', set: [false, 'true'] },
      { not: 0, set: [true, 1] },
      { not: '1', set: ['123', 1] },
      { not: false, set: ['123', 1, true] },
    ]

    for (const test of tests) {
      const Test = VOSet(test.set)

      expect(() => new Test(test.not)).toThrowError('Value not found in set')
      for (const raw of test.set) expect(() => new Test(raw)).not.toThrow()
    }
  })

  it('Should have the correct types', () => {
    class Strict1 extends VOSet(['a', 'b', '\t', '\n'], { strict: true }) {}
    class Strict2 extends VOSet([1, 2, 3, -1, -2, -3, 0], { strict: true }) {}
    class Strict3 extends VOSet([true], { strict: true }) {}
    class Strict4 extends VOSet([false], { strict: true }) {}
    class Strict5 extends VOSet([false, 'true'], { strict: true }) {}
    class Strict6 extends VOSet([true, 1], { strict: true }) {}
    class Strict7 extends VOSet(['123', 1], { strict: true }) {}
    class Strict8 extends VOSet(['123', 1, true], { strict: true }) {}

    expectTypeOf(constructorFn(Strict1)).toEqualTypeOf<(r: 'a' | 'b' | '\t' | '\n') => Strict1>()
    expectTypeOf(constructorFn(Strict2)).toEqualTypeOf<(r: 1 | 2 | 3 | -1 | -2 | -3 | 0) => Strict2>()
    expectTypeOf(constructorFn(Strict3)).toEqualTypeOf<(r: true) => Strict3>()
    expectTypeOf(constructorFn(Strict4)).toEqualTypeOf<(r: false) => Strict4>()
    expectTypeOf(constructorFn(Strict5)).toEqualTypeOf<(r: false | 'true') => Strict5>()
    expectTypeOf(constructorFn(Strict6)).toEqualTypeOf<(r: true | 1) => Strict6>()
    expectTypeOf(constructorFn(Strict7)).toEqualTypeOf<(r: '123' | 1) => Strict7>()
    expectTypeOf(constructorFn(Strict8)).toEqualTypeOf<(r: '123' | 1 | true) => Strict8>()

    expectTypeOf(new Strict1('a').valueOf()).toEqualTypeOf<'a' | 'b' | '\t' | '\n'>()
    expectTypeOf(new Strict2(1).valueOf()).toEqualTypeOf<1 | 2 | 3 | -1 | -2 | -3 | 0>()
    expectTypeOf(new Strict3(true).valueOf()).toEqualTypeOf<true>()
    expectTypeOf(new Strict4(false).valueOf()).toEqualTypeOf<false>()
    expectTypeOf(new Strict5(false).valueOf()).toEqualTypeOf<false | 'true'>()
    expectTypeOf(new Strict6(true).valueOf()).toEqualTypeOf<true | 1>()
    expectTypeOf(new Strict7('123').valueOf()).toEqualTypeOf<'123' | 1>()
    expectTypeOf(new Strict8('123').valueOf()).toEqualTypeOf<'123' | 1 | true>()

    class Loose1 extends VOSet(['a', 'b', '\t', '\n']) {}
    class Loose2 extends VOSet([1, 2, 3, -1, -2, -3, 0]) {}
    class Loose3 extends VOSet([true]) {}
    class Loose4 extends VOSet([false]) {}
    class Loose5 extends VOSet([false, 'true']) {}
    class Loose6 extends VOSet([true, 1]) {}
    class Loose7 extends VOSet(['123', 1]) {}
    class Loose8 extends VOSet(['123', 1, true]) {}

    expectTypeOf(constructorFn(Loose1)).toEqualTypeOf<(r: string) => Loose1>()
    expectTypeOf(constructorFn(Loose2)).toEqualTypeOf<(r: number) => Loose2>()
    expectTypeOf(constructorFn(Loose3)).toEqualTypeOf<(r: boolean) => Loose3>()
    expectTypeOf(constructorFn(Loose4)).toEqualTypeOf<(r: boolean) => Loose4>()
    expectTypeOf(constructorFn(Loose5)).toEqualTypeOf<(r: boolean | string) => Loose5>()
    expectTypeOf(constructorFn(Loose6)).toEqualTypeOf<(r: boolean | number) => Loose6>()
    expectTypeOf(constructorFn(Loose7)).toEqualTypeOf<(r: string | number) => Loose7>()
    expectTypeOf(constructorFn(Loose8)).toEqualTypeOf<(r: string | boolean | number) => Loose8>()

    expectTypeOf(new Loose1('a').valueOf()).toEqualTypeOf<'a' | 'b' | '\t' | '\n'>()
    expectTypeOf(new Loose2(1).valueOf()).toEqualTypeOf<1 | 2 | 3 | -1 | -2 | -3 | 0>()
    expectTypeOf(new Loose3(true).valueOf()).toEqualTypeOf<true>()
    expectTypeOf(new Loose4(false).valueOf()).toEqualTypeOf<false>()
    expectTypeOf(new Loose5(false).valueOf()).toEqualTypeOf<false | 'true'>()
    expectTypeOf(new Loose6(true).valueOf()).toEqualTypeOf<true | 1>()
    expectTypeOf(new Loose7('123').valueOf()).toEqualTypeOf<'123' | 1>()
    expectTypeOf(new Loose8('123').valueOf()).toEqualTypeOf<'123' | 1 | true>()
  })
})

const setableValues = [1, 2, 3, -1, -2, -3, 0, 'a', 'b', '\t', '\n', true, false]
const nonSetableValues = [new Date(), null, undefined, {}, [], /abc/]
