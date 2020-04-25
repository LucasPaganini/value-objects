import { VOSet } from './set'

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
      const fn = () => VOSet(test as any[])
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
})

const setableValues = [1, 2, 3, -1, -2, -3, 0, 'a', 'b', '\t', '\n', true, false]
const nonSetableValues = [new Date(), null, undefined, {}, [], /abc/]
