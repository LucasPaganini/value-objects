import { isLeft, isRight } from 'fp-ts/lib/Either'
import { Email, ID } from '../lib'
import { ObjectConstructor } from './object-constructor.fn'

describe('VOObject', () => {
  it('Should work', () => {
    const Schema = ObjectConstructor({
      id: ID,
      email: Email,
    })

    const data = { id: '123', email: 'test@email.com' }
    const tests = [Schema.fromRaw(data), Schema.fromAny(data)]
    for (const test of tests) expect(isRight(test)).toBe(true)
  })

  it('Should error', () => {
    const Schema = ObjectConstructor({
      id: ID,
      email: Email,
    })

    const datas = [
      { id: 123, email: 'test@email.com' },
      undefined,
      {},
      123,
      [],
      { id: undefined, email: undefined },
      { id: '123', email: true },
    ]
    const tests = flatMap(datas.map(data => [Schema.fromRaw(data as any), Schema.fromAny(data)]))
    for (const test of tests) expect(isLeft(test)).toBe(true)
  })
})

const flatMap = <T>(arr: Array<Array<T>>): Array<T> => arr.reduce((acc, curr) => acc.concat(curr), [])
