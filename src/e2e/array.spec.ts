import { expectTypeOf } from 'expect-type'
import { VOArray, VOArrayOptions, VOError } from '../..'
import { isNull, isNumber } from '../utils'
import { constructorFn } from './utils'

describe('VOArray', () => {
  class Base {
    constructor(raw: 123) {}
    valueOf(): 456 {
      return 456
    }
  }

  class Failure {
    constructor(raw: boolean) {
      throw new VOError('Test error')
    }
    valueOf(): 456 {
      return 456
    }
  }

  it('Should return a class that can be extended', () => {
    class Test extends VOArray(Base) {
      test() {
        return 'test'
      }
    }

    const instance = new Test([123, 123])
    expect(instance.test()).toBe('test')
    expect(instance.valueOf()).toEqual([456, 456])
  })

  it('toArray() should return an array of instantiated inner classes', () => {
    class Test extends VOArray(Base) {}

    const instance = new Test([123, 123])
    expect(instance.toArray() instanceof Array).toBe(true)
    for (const element of instance.toArray()) expect(element instanceof Base).toBe(true)
  })

  it("Should call each inner class' valueOf() when it's valueOf() is called", () => {
    const quantity = 15

    class Test extends VOArray(Base) {
      test() {
        return 'test'
      }
    }

    const rawValues = new Array<123>(quantity).fill(123)
    const isolatedBases = rawValues.map(raw => new Base(raw))
    const wrappedBases = new Test(rawValues)

    expect(isolatedBases.map(v => v.valueOf())).toEqual(wrappedBases.valueOf())
  })

  it("Should add a .index property to errors thrown by the instantiation of it's inner classes", () => {
    const quantity = 15

    class Test extends VOArray(Failure) {}

    const rawValues = Array.from({ length: quantity }).map((_, i) => !!(i % 2))
    const fn = () => new Test(rawValues)
    expect(fn).toThrowMatching(
      (errArray): boolean =>
        Array.isArray(errArray) &&
        errArray.every(VOError.is) &&
        errArray.every(err => isNumber(err.path.toArray().pop())),
    )
  })

  it('Should throw on base class creation if one of the options is invalid', () => {
    const tests: Array<VOArrayOptions & { error: string | null }> = [
      { minLength: -1, error: 'Too small' },
      { minLength: 0, error: null },
      { minLength: 1.5, error: 'Not an integer' },
      { minLength: '123' as any, error: 'Wrong raw value type' },

      { maxLength: -1, error: 'Too small' },
      { maxLength: 0, error: null },
      { maxLength: 1.5, error: 'Not an integer' },
      { maxLength: '123' as any, error: 'Wrong raw value type' },

      { minLength: 10, maxLength: 5, error: 'Invalid logic' },

      { maxErrors: -1, error: 'Too small' },
      { maxErrors: 0, error: null },
      { maxErrors: 1, error: null },
      { maxErrors: 500, error: null },
      { maxErrors: 1.5, error: 'Not an integer' },
      { maxErrors: '123' as any, error: 'Wrong raw value type' },
    ]

    for (const test of tests) {
      const fn = () => VOArray(Base, test)
      if (isNull(test.error)) expect(fn).not.toThrow()
      else expect(fn).toThrowError(test.error)
    }
  })

  it("Should be able to set a min length and throw if it's shorter than that", () => {
    for (const test of lengthTests) {
      const Test = VOArray(Base, { minLength: test.size })
      const raw = new Array(test.size + test.range).fill('')
      const fn = () => new Test(raw)

      if (test.range >= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it("Should be able to set a max length and throw if it's larger than that", () => {
    for (const test of lengthTests) {
      const Test = VOArray(Base, { maxLength: test.size })
      const raw = new Array(test.size + test.range).fill('')
      const fn = () => new Test(raw)

      if (test.range <= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it('Should be able to set a max errors and throw when the limit is reached or when there are no more values to instantiate', () => {
    const tests = Array.from(new Set(lengthTests.map(t => t.size))).filter(size => size <= 5000)
    const rawValues = new Array<number>(Math.max(...tests) * 2).fill(0).map(() => true)

    for (const maxErrors of tests) {
      class Test extends VOArray(Failure, { maxErrors }) {}
      const fn = () => new Test(rawValues)

      expect(fn).toThrowMatching(
        (errArray): boolean =>
          Array.isArray(errArray) &&
          errArray.length === maxErrors &&
          errArray.every(VOError.is) &&
          errArray.every((err, i) => err.path.toArray().pop() === i),
      )
    }
  })

  it('Should have the correct types', () => {
    class Test extends VOArray(Base) {}

    expectTypeOf(constructorFn(Test)).toEqualTypeOf<(r: Array<123>) => Test>()
    expectTypeOf(new Test([]).valueOf()).toEqualTypeOf<Array<456>>()
    expectTypeOf(new Test([]).toArray()).toEqualTypeOf<Array<Base>>()
  })
})

const lengthTests = (() => {
  const ranges = [-10, -5, 0, 5, 10]
  const testsBase = [
    { size: 10 },
    { size: 99 },
    { size: 287 },
    { size: 573 },
    { size: 904 },
    { size: 2187 },
    { size: 6700 },
    { size: 68000 },
  ]
  return testsBase.map(test => ranges.map(range => ({ ...test, range }))).reduce((acc, curr) => acc.concat(curr), [])
})()
