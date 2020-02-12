import { ShortString } from './short-string.class'

describe('ShortString', () => {
  it('Should trim the value', () => {
    const actuals = ['   ', ' abc ', ' a b c '].map(v => ShortString(v)).map(v => v.value)
    const expecteds = ['', 'abc', 'a b c']

    for (let i = 0; i < actuals.length; i++) expect(actuals[i]).toBe(expecteds[i])
  })

  it('Should wrap the string', () => {
    const actual = ShortString('abc').value
    const expected = 'abc'
    expect(actual).toBe(expected)
  })

  it('Should reject long strings', () => {
    const actuals = [0, 50, 200, 256, 257, 500, 1000, 2000]
    const expecteds = [true, true, true, true, false, false, false, false]

    for (let i = 0; i < actuals.length; i++) {
      const str = ''.padEnd(actuals[i], 'abc')
      const fn = () => ShortString(str)

      const expectedToThrow = !expecteds[i]
      if (expectedToThrow) expect(fn).toThrowError('Too long')
      else expect(fn).not.toThrow()
    }
  })

  it('Should instantiate', () => {
    const str = ''
    const actuals = [ShortString(str), new ShortString(str)]
    const actualEithers = [ShortString.fromRaw(str), ShortString.fromAny(str)]

    actuals.forEach(v => expect(v).toBeInstanceOf(ShortString))
    actualEithers.forEach(v => {
      expect(v._tag).toBe('Right')
      if (v._tag !== 'Right') throw Error()
      expect(v.right).toBeInstanceOf(ShortString)
    })
  })
})
