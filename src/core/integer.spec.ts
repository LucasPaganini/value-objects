import { isNull } from '../utils'
import { VOInteger, VOIntegerOptions } from './integer'

describe('VOInteger', () => {
  it('Should return a class that can be extended', () => {
    class Test extends VOInteger() {
      test() {
        return 'test'
      }
    }

    const instance = new Test(0)
    expect(instance.test()).toBe('test')
  })

  it('Should not mutate the raw value', () => {
    const Test = VOInteger()
    const tests = [-5000000, -14324, 0, 1, 86926985738, 481284120840128948104]

    for (const test of tests) {
      const actual = new Test(test).valueOf()
      expect(actual).toBe(test)
    }
  })

  it('Should throw on base class creation if one of the options is invalid', () => {
    const tests: Array<VOIntegerOptions & { error: string | null }> = [
      { min: -1, error: null },
      { min: 1.5, error: null },
      { min: '123' as any, error: 'Wrong raw value type' },

      { max: -1, error: null },
      { max: 1.5, error: null },
      { max: '123' as any, error: 'Wrong raw value type' },

      { min: 10, max: 5, error: 'Invalid logic' },
    ]

    for (const test of tests) {
      const fn = () => VOInteger(test)
      if (isNull(test.error)) expect(fn).not.toThrow()
      else expect(fn).toThrowError(test.error)
    }
  })

  it("Should be able to set a min value and throw if it's smaller than that", () => {
    for (const test of lengthTests) {
      const Test = VOInteger({ min: test.size })
      const raw = test.size + test.range
      const fn = () => new Test(raw)

      if (test.range >= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it("Should be able to set a max value and throw if it's longer than that", () => {
    for (const test of lengthTests) {
      const Test = VOInteger({ max: test.size })
      const raw = test.size + test.range
      const fn = () => new Test(raw)

      if (test.range <= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
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
