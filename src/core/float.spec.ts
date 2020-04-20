import { VOFloat, VOFloatOptions } from './float'

describe('VOFloat', () => {
  it('Should return a class that can be extended', () => {
    class Test extends VOFloat() {
      test() {
        return 'test'
      }
    }

    const instance = new Test(0)
    expect(instance.test()).toBe('test')
  })

  it('Should not mutate the raw value', () => {
    const Test = VOFloat()
    const tests = [
      -5000000,
      -328103.38219839218,
      -14324,
      -0.5,
      0,
      0.5,
      1,
      4149.4124,
      86926985738,
      481284120840128948104,
      481284120840128948104.481284120840128948104,
    ]

    for (const test of tests) {
      const actual = new Test(test).valueOf()
      expect(actual).toBe(test)
    }
  })

  it('Should throw on base class creation if one of the options is invalid', () => {
    const tests: Array<VOFloatOptions & { error: string | null }> = [
      { min: -1, error: null },
      { min: 1.5, error: null },
      { min: '123' as any, error: 'Wrong raw value type' },

      { max: -1, error: null },
      { max: 1.5, error: null },
      { max: '123' as any, error: 'Wrong raw value type' },

      { min: 10, max: 5, error: 'Invalid logic' },

      { precision: -1, error: 'Too small' },
      { precision: 0, error: null },
      { precision: 1, error: null },
      { precision: 500, error: null },
      { precision: 1.5, error: 'Not an integer' },
      { precision: '123' as any, error: 'Wrong raw value type' },

      { precisionTrim: 'cei' as any, error: 'Value not found in set' },
      { precisionTrim: 123 as any, error: 'Value not found in set' },
      { precisionTrim: 'ceil', error: null },
      { precisionTrim: 'floor', error: null },
      { precisionTrim: 'round', error: null },
    ]

    for (const test of tests) {
      const fn = () => VOFloat(test)
      if (test.error === null) expect(fn).not.toThrow()
      else expect(fn).toThrowError(test.error)
    }
  })

  it('Should be able to set a precision with ceil, floor or regular rounding', () => {
    for (const test of precisionTests) {
      const Ceil = VOFloat({ precision: test.precision, precisionTrim: 'ceil' })
      const Floor = VOFloat({ precision: test.precision, precisionTrim: 'floor' })
      const Round = VOFloat({ precision: test.precision, precisionTrim: 'round' })

      expect(new Ceil(test.value).valueOf()).toBe(test.ceil)
      expect(new Floor(test.value).valueOf()).toBe(test.floor)
      expect(new Round(test.value).valueOf()).toBe(test.round)
    }
  })

  it("Should be able to set a min value and throw if it's smaller than that", () => {
    for (const test of lengthTests) {
      const Test = VOFloat({ min: test.size })
      const raw = test.size + test.range
      const fn = () => new Test(raw)

      if (test.range >= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it('Should be able to set a min value with precision and throw if the rounded value is smaller than that', () => {
    const tests: Array<{
      precision: number
      raw: number
      min: number
      errors: Array<NonNullable<VOFloatOptions['precisionTrim']>>
    }> = [
      { precision: 0, raw: 2.6, min: 3, errors: ['floor'] },
      { precision: 0, raw: 2.4, min: 3, errors: ['floor', 'round'] },
      { precision: 1, raw: 2.4, min: 3, errors: ['floor', 'round', 'ceil'] },
      { precision: 3, raw: 2.00005, min: 2.00005, errors: ['floor', 'round'] },
      { precision: 5, raw: 2.00005, min: 2.00005, errors: [] },

      { precision: 0, raw: -2.6, min: -2, errors: ['floor', 'round'] },
      { precision: 0, raw: -2.4, min: -2, errors: ['floor'] },
      { precision: 1, raw: -2.4, min: -2, errors: ['floor', 'round', 'ceil'] },
      { precision: 3, raw: -2.00005, min: -2.00005, errors: ['floor'] },
      { precision: 5, raw: -2.00005, min: -2.00005, errors: [] },
    ]

    for (const test of tests) {
      const Ceil = VOFloat({ min: test.min, precision: test.precision, precisionTrim: 'ceil' })
      const Floor = VOFloat({ min: test.min, precision: test.precision, precisionTrim: 'floor' })
      const Round = VOFloat({ min: test.min, precision: test.precision, precisionTrim: 'round' })

      const ceil = () => new Ceil(test.raw)
      const floor = () => new Floor(test.raw)
      const round = () => new Round(test.raw)

      if (test.errors.includes('ceil')) expect(ceil).toThrowError('Too small')
      else expect(ceil).not.toThrow()

      if (test.errors.includes('floor')) expect(floor).toThrowError('Too small')
      else expect(floor).not.toThrow()

      if (test.errors.includes('round')) expect(round).toThrowError('Too small')
      else expect(round).not.toThrow()
    }
  })

  it("Should be able to set a max value and throw if it's longer than that", () => {
    for (const test of lengthTests) {
      const Test = VOFloat({ max: test.size })
      const raw = test.size + test.range
      const fn = () => new Test(raw)

      if (test.range <= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it('Should be able to set a max value with precision and throw if the rounded value is longer than that', () => {
    const tests: Array<{
      precision: number
      raw: number
      max: number
      errors: Array<NonNullable<VOFloatOptions['precisionTrim']>>
    }> = [
      { precision: 0, raw: 2.6, max: 2, errors: ['ceil', 'round'] },
      { precision: 0, raw: 2.4, max: 2, errors: ['ceil'] },
      { precision: 1, raw: 2.4, max: 2, errors: ['floor', 'round', 'ceil'] },
      { precision: 3, raw: 2.00005, max: 2.00005, errors: ['ceil'] },
      { precision: 5, raw: 2.00005, max: 2.00005, errors: [] },

      { precision: 0, raw: -2.6, max: -3, errors: ['ceil'] },
      { precision: 0, raw: -2.4, max: -3, errors: ['ceil', 'round'] },
      { precision: 1, raw: -2.4, max: -3, errors: ['floor', 'round', 'ceil'] },
      { precision: 3, raw: -2.00005, max: -2.00005, errors: ['ceil', 'round'] },
      { precision: 5, raw: -2.00005, max: -2.00005, errors: [] },
    ]

    for (const test of tests) {
      const Ceil = VOFloat({ max: test.max, precision: test.precision, precisionTrim: 'ceil' })
      const Floor = VOFloat({ max: test.max, precision: test.precision, precisionTrim: 'floor' })
      const Round = VOFloat({ max: test.max, precision: test.precision, precisionTrim: 'round' })

      const ceil = () => new Ceil(test.raw)
      const floor = () => new Floor(test.raw)
      const round = () => new Round(test.raw)

      if (test.errors.includes('ceil')) expect(ceil).toThrowError('Too big')
      else expect(ceil).not.toThrow()

      if (test.errors.includes('floor')) expect(floor).toThrowError('Too big')
      else expect(floor).not.toThrow()

      if (test.errors.includes('round')) expect(round).toThrowError('Too big')
      else expect(round).not.toThrow()
    }
  })
})

const lengthTests = (() => {
  const ranges = [-10, -7.5, -5, -0.999999999, -0.0000000001, 0, 0.0000000001, 0.9999999999, 5, 10]
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

const precisionTests = [
  { value: 1.0006, precision: 3, floor: 1.0, ceil: 1.001, round: 1.001 },
  { value: 1.0004, precision: 3, floor: 1.0, ceil: 1.001, round: 1.0 },
  { value: 1.9599599954, precision: 9, floor: 1.959959995, ceil: 1.959959996, round: 1.959959995 },
  { value: 1.9599599956, precision: 9, floor: 1.959959995, ceil: 1.959959996, round: 1.959959996 },
  { value: 1.9599599956, precision: 0, floor: 1, ceil: 2, round: 2 },
  { value: 1.9599599956, precision: 3, floor: 1.959, ceil: 1.96, round: 1.96 },

  { value: -1.0006, precision: 3, floor: -1.001, ceil: -1.0, round: -1.001 },
  { value: -1.0004, precision: 3, floor: -1.001, ceil: -1.0, round: -1.0 },
  { value: -1.9599599954, precision: 9, floor: -1.959959996, ceil: -1.959959995, round: -1.959959995 },
  { value: -1.9599599956, precision: 9, floor: -1.959959996, ceil: -1.959959995, round: -1.959959996 },
  { value: -1.9599599956, precision: 0, floor: -2, ceil: -1, round: -2 },
  { value: -1.9599599956, precision: 3, floor: -1.96, ceil: -1.959, round: -1.96 },
]
