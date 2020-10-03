import { isNull } from '../utils'
import { VOError } from './errors'
import { VOObject, VOObjectOptions } from './object'

describe('VOObject', () => {
  class AAA {
    constructor(raw: 123) {
      if (isNull(raw)) throw new VOError('AAA test error')
    }
    valueOf(): 'aaa' {
      return 'aaa'
    }
  }

  class BBB {
    constructor(raw: 456) {
      if (isNull(raw)) throw new VOError('BBB test error')
    }
    valueOf(): 'bbb' {
      return 'bbb'
    }
  }

  class CCC {
    constructor(raw: 789) {
      if (isNull(raw)) throw new VOError('CCC test error')
    }
    valueOf(): 'ccc' {
      return 'ccc'
    }
  }

  it('Should return a class that can be extended', () => {
    class Test extends VOObject({ aaa: AAA, bbb: BBB, ccc: CCC }) {
      test() {
        return 'test'
      }
    }

    const instance = new Test({ aaa: 123, bbb: 456, ccc: 789 })
    expect(instance.test()).toBe('test')
    expect(instance.valueOf()).toEqual({ aaa: 'aaa', bbb: 'bbb', ccc: 'ccc' })
  })

  it('Should return an record of instantiated inner classes', () => {
    class Test extends VOObject({ aaa: AAA, bbb: BBB, ccc: CCC }) {}

    const instance = new Test({ aaa: 123, bbb: 456, ccc: 789 })
    expect(instance.aaa instanceof AAA).toBe(true)
    expect(instance.bbb instanceof BBB).toBe(true)
    expect(instance.ccc instanceof CCC).toBe(true)
  })

  it("Should call each inner class' valueOf() when it's valueOf() is called", () => {
    class Test extends VOObject({ aaa: AAA, bbb: BBB, ccc: CCC }) {}

    const instance = new Test({ aaa: 123, bbb: 456, ccc: 789 })
    const aaa = new AAA(123)
    const bbb = new BBB(456)
    const ccc = new CCC(789)

    expect(instance.valueOf()).toEqual({ aaa: aaa.valueOf(), bbb: bbb.valueOf(), ccc: ccc.valueOf() })
  })

  it("Should add a .prop property to errors thrown by the instantiation of it's inner classes", () => {
    class Test extends VOObject({ aaa: AAA, bbb: BBB, ccc: CCC }, { maxErrors: 10 }) {}

    const tests = [
      { aaa: null, props: ['aaa'] },
      { bbb: null, props: ['bbb'] },
      { ccc: null, props: ['ccc'] },
      { aaa: null, bbb: null, props: ['aaa', 'bbb'] },
      { bbb: null, ccc: null, props: ['bbb', 'ccc'] },
      { aaa: null, ccc: null, props: ['aaa', 'ccc'] },
      { aaa: null, bbb: null, ccc: null, props: ['aaa', 'bbb', 'ccc'] },
    ]

    for (const test of tests) {
      const validRaws = { aaa: 123, bbb: 456, ccc: 789 } as const
      const fn = () => new Test({ ...validRaws, ...(<any>test) })

      expect(fn).toThrowMatching(
        (errArray): boolean =>
          Array.isArray(errArray) &&
          errArray.length === test.props.length &&
          errArray.every(VOError.is) &&
          errArray.every(err => test.props.includes(<string>err.path.toArray().pop())),
      )
    }
  })

  it('Should throw on base class creation if one of the options is invalid', () => {
    const tests: Array<VOObjectOptions & { error: string | null }> = [
      { maxErrors: -1, error: 'Too small' },
      { maxErrors: 0, error: null },
      { maxErrors: 1, error: null },
      { maxErrors: 500, error: null },
      { maxErrors: 1.5, error: 'Not an integer' },
      { maxErrors: '123' as any, error: 'Wrong raw value type' },
    ]

    for (const test of tests) {
      const fn = () => VOObject({ aaa: AAA }, test)
      if (isNull(test.error)) expect(fn).not.toThrow()
      else expect(fn).toThrowError(test.error)
    }
  })

  it('Should be able to set a max errors and throw when the limit is reached or when there are no more values to instantiate', () => {
    const tests = [10, 99, 287, 573, 904, 2187, 6700]

    class Base {
      constructor(raw: number) {
        throw new VOError('Test error')
      }
      valueOf(): 'base test' {
        return 'base test'
      }
    }

    const schema = Array.from({ length: Math.max(...tests) * 2 }).reduce<{ [key: string]: typeof Base }>(
      (acc, _, i) => {
        acc[i.toString()] = Base
        return acc
      },
      {},
    )

    const rawValues = Object.keys(schema).reduce<{ [key: string]: number }>((acc, key, i) => {
      acc[key] = i
      return acc
    }, {})

    for (const maxErrors of tests) {
      class Test extends VOObject(schema, { maxErrors }) {}
      const fn = () => new Test(rawValues)

      expect(fn).toThrowMatching((errArray): boolean => {
        const props = new Set(Object.keys(schema))

        return (
          Array.isArray(errArray) &&
          errArray.length === maxErrors &&
          errArray.every(VOError.is) &&
          errArray.every(err => props.has(<string>err.path.toArray().pop()))
        )
      })
    }
  })
})
