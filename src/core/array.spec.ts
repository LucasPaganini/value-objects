import { VOArray, VOArrayOptions } from './array'

describe('VOArray', () => {
  it('Should return a class that can be extended', () => {
    class Base {
      constructor(raw: 123) {}
      valueOf(): 456 {
        return 456
      }
    }
    class Test extends VOArray(Base) {
      test() {
        return 'test'
      }
    }

    const instance = new Test([123, 123])
    expect(instance.test()).toBe('test')
    expect(instance.valueOf()).toEqual([456, 456])
  })

  it('Should instantiate an array of instantiated inner classes', () => {
    class Base {
      constructor(raw: 123) {}
      valueOf(): 456 {
        return 456
      }
    }
    class Test extends VOArray(Base) {
      test() {
        return 'test'
      }
    }

    const instance = new Test([123, 123])
    expect(instance instanceof Array).toBe(true)
    for (const element of instance) expect(element instanceof Base).toBe(true)
  })

  it("Should call each inner class' valueOf() when it's valueOf() is called", () => {
    const quantity = 15

    class Base {
      constructor(raw: 123) {}
      valueOf(): 456 {
        return 456
      }
    }
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

    class Base {
      constructor(error: boolean) {
        if (error) throw Error('Test error')
      }
      valueOf(): 456 {
        return 456
      }
    }
    class Test extends VOArray(Base) {}

    const rawValues = Array.from({ length: quantity }).map((_, i) => !!(i % 2))
    const fn = () => new Test(rawValues)
    expect(fn).toThrowMatching(
      (errArray): boolean =>
        Array.isArray(errArray) &&
        errArray.every(err => err instanceof Error) &&
        errArray.every(err => typeof err.index === 'number'),
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

    class Base {
      constructor(raw: '123') {}
      valueOf(): 789 {
        return 789
      }
    }

    for (const test of tests) {
      const fn = () => VOArray(Base, test)
      if (test.error === null) expect(fn).not.toThrow()
      else expect(fn).toThrowError(test.error)
    }
  })

  it("Should be able to set a min length and throw if it's shorter than that", () => {
    class Base {
      constructor(raw: string) {}
      valueOf(): string {
        return 'base'
      }
    }

    for (const test of lengthTests) {
      const Test = VOArray(Base, { minLength: test.size })
      const raw = new Array(test.size + test.range).fill('')
      const fn = () => new Test(raw)

      if (test.range >= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it("Should be able to set a max length and throw if it's larger than that", () => {
    class Base {
      constructor(raw: string) {}
      valueOf(): string {
        return 'base'
      }
    }

    for (const test of lengthTests) {
      const Test = VOArray(Base, { maxLength: test.size })
      const raw = new Array(test.size + test.range).fill('')
      const fn = () => new Test(raw)

      if (test.range <= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it('Should be able to set a max errors and throw when the limit is reached or when there are no more values to instantiate', () => {
    const tests = lengthTests.map(t => t.size).filter(size => size <= 5000)
    const rawValues = new Array<number>(Math.max(...tests) * 2).fill(0)

    class Base {
      constructor(raw: number) {
        throw Error('Test error')
      }
      valueOf(): 456 {
        return 456
      }
    }

    for (const maxErrors of tests) {
      class Test extends VOArray(Base, { maxErrors }) {}
      const fn = () => new Test(rawValues)

      expect(fn).toThrowMatching(
        (errArray): boolean =>
          Array.isArray(errArray) &&
          errArray.length === maxErrors &&
          errArray.every(err => err instanceof Error) &&
          errArray.every(err => typeof err.index === 'number') &&
          errArray.every((err, i) => err.index === i),
      )
    }
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
