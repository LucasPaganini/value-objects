import { ShortString } from './short-string'

describe('ShortString', () => {
  it('Should trim the value', () => {
    const tests = [
      { raw: '   ', expected: '' },
      { raw: ' abc ', expected: 'abc' },
      { raw: ' a b c ', expected: 'a b c' },
    ]

    for (const { raw, expected } of tests) {
      const instance = new ShortString(raw)
      expect(instance.valueOf()).toBe(expected)
    }
  })

  it('Should wrap the string', () => {
    const actual = new ShortString('abc').valueOf()
    const expected = 'abc'
    expect(actual).toBe(expected)
  })

  it('Should reject strings longer than 256', () => {
    const tests = [
      { length: 0, ok: true },
      { length: 50, ok: true },
      { length: 200, ok: true },
      { length: 256, ok: true },
      { length: 257, ok: false },
      { length: 500, ok: false },
      { length: 1000, ok: false },
      { length: 2000, ok: false },
    ]

    for (const { length, ok } of tests) {
      const str = ''.padEnd(length, 'abc')
      const fn = () => new ShortString(str)

      if (!ok) expect(fn).toThrowError('Too long')
      else expect(fn).not.toThrow()
    }
  })
})
