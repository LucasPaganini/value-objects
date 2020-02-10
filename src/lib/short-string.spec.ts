import { ShortString } from './short-string.class'

describe('ShortString', () => {

  it('Should trim the value', () => {
    const actual = ShortString('   ').value
    const expected = ''
    expect(actual).toBe(expected)
  })

  it('Should wrap the string', () => {
    const actual = ShortString('abc').value
    const expected = 'abc'
    expect(actual).toBe(expected)
  })

  it('Should reject long strings', () => {
    const actual = () => ShortString(''.padEnd(300, 'abc')).value
    expect(actual).toThrow()
  })

})