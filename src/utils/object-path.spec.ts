import { ObjectPath, ObjectPathProperty } from './object-path'

describe('ObjectPath', () => {
  it('Should show a path to the error', () => {
    const tests: Array<[Array<ObjectPathProperty>, string]> = [
      [['foo', 5, 'bar'], 'foo[5].bar'],
      [['foo'], 'foo'],
      [['foo', 'bar'], 'foo.bar'],
      [[5, 10], '[5][10]'],
    ]

    for (const [pathProps, expectedPath] of tests) {
      const path = new ObjectPath(pathProps)
      const actualPath = path.valueOf()
      expect(actualPath).toBe(expectedPath)
    }
  })
})
