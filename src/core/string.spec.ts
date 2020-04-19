import { VOString, VOStringOptions } from './string'

describe('VOString', () => {
  it('Should return a class that can be extended', () => {
    class Test extends VOString() {
      test() {
        return 'test'
      }
    }

    const instance = new Test('')
    expect(instance.test()).toBe('test')
  })

  it('Should throw on base class creation if one of the options is invalid', () => {
    const tests: Array<VOStringOptions> = [
      { minLength: -1 },
      { minLength: 1.5 },
      { minLength: '123' as any },

      { maxLength: -1 },
      { maxLength: 1.5 },
      { maxLength: '123' as any },

      { minLength: 10, maxLength: 5 },

      { trim: 'true' as any },
      { trim: 1 as any },
      { trim: 0 as any },

      { pattern: 'abc' as any },
    ]

    for (const test of tests) {
      const fn = () => VOString(test)
      expect(fn).toThrow()
    }
  })

  it('Should be able to trim', () => {
    const Test = VOString({ trim: true })
    const tests = [
      { raw: ' abc ', expected: 'abc' },
      { raw: ' a b c ', expected: 'a b c' },
      { raw: '  ', expected: '' },
      { raw: '\t\tabc\t\t', expected: 'abc' },
      { raw: '\n\nabc\n\n', expected: 'abc' },
      { raw: '\t abc \t', expected: 'abc' },
      { raw: '\n\tabc\t\n', expected: 'abc' },
    ]
    for (const test of tests) {
      const instance = new Test(test.raw)
      expect(instance.valueOf()).toBe(test.expected)
    }
  })

  it('Should be able to not trim', () => {
    const Test = VOString({ trim: false })
    const tests = [
      { raw: ' abc ' },
      { raw: ' a b c ' },
      { raw: '  ' },
      { raw: '\t\tabc\t\t' },
      { raw: '\n\nabc\n\n' },
      { raw: '\t abc \t' },
      { raw: '\n\tabc\t\n' },
    ]
    for (const test of tests) {
      const instance = new Test(test.raw)
      expect(instance.valueOf()).toBe(test.raw)
    }
  })

  it("Should be able to set a min length and throw if it's smaller than that", () => {
    for (const test of lengthTests) {
      const Test = VOString({ minLength: test.length })
      const raw = ''.padEnd(test.length + test.range, test.pattern)
      const fn = () => new Test(raw)

      if (test.range >= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it('Should be able to set a min length with trim and throw if the trimed value is smaller than that', () => {
    for (const test of lengthTests) {
      const Test = VOString({ minLength: test.length, trim: true })
      const raw = ''.padEnd(test.length + test.range, test.pattern)
      const trimedLength = raw.trim().length
      const fn = () => new Test(raw)

      if (trimedLength >= test.length) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it("Should be able to set a max length and throw if it's longer than that", () => {
    for (const test of lengthTests) {
      const Test = VOString({
        maxLength: test.length,
      })
      const raw = ''.padEnd(test.length + test.range, test.pattern)
      const fn = () => new Test(raw)

      if (test.range <= 0) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it('Should be able to set a max length with trim and throw if the trimed value is longer than that', () => {
    for (const test of lengthTests) {
      const Test = VOString({ maxLength: test.length, trim: true })
      const raw = ''.padEnd(test.length + test.range, test.pattern)
      const trimedLength = raw.trim().length
      const fn = () => new Test(raw)

      if (trimedLength <= test.length) expect(fn).not.toThrow()
      else expect(fn).toThrow()
    }
  })

  it("Should be able to set a pattern and throw if it doesn't match it", () => {
    const tests = [{ pattern: /abc/, successes: ['abc', ' abc ', 'xabc', 'abcx'], failures: ['a b c', 'axbc', 'abxc'] }]
    for (const test of tests) {
      const Test = VOString({ pattern: test.pattern })
      const makeFn = (raw: string) => () => new Test(raw)
      for (const raw of test.successes) expect(makeFn(raw)).not.toThrow()
      for (const raw of test.failures) expect(makeFn(raw)).toThrow()
    }
  })
})

const lengthTests = (() => {
  const ranges = [-10, -5, 0, 5, 10]
  const testsBase = [
    { pattern: 'abc', length: 10 },
    { pattern: ' abc ', length: 99 },
    { pattern: ' a b c ', length: 287 },
    { pattern: '  ', length: 573 },
    { pattern: '\t\tabc\t\t', length: 904 },
    { pattern: '\n\nabc\n\n', length: 2187 },
    { pattern: '\t abc \t', length: 6700 },
    { pattern: '\n\tabc\t\n', length: 68000 },
  ]
  return testsBase.map(test => ranges.map(range => ({ ...test, range }))).reduce((acc, curr) => acc.concat(curr), [])
})()
