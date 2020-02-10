// import { ValueObject } from '../models'
// import { Either, left, isLeft, right } from 'fp-ts/lib/Either'

// export class Record {
//   fromAny(data: any): Either<any, Dictionary<ValueObject<any, any>>> {
//     if (data === null || typeof data !== 'object') return left(new InvalidRecordError())

//     const rs: Dictionary<ValueObject<any, any>> = {}
//     for (const [key, value] of Object.entries(this.value)) {
//       const r = value.fromAny(data[key])
//       if (isLeft(r)) return r
//       rs[key] = r.right
//     }
//     return right(rs)
//   }

//   constructor(private value: { [key: string]: ValueObject<any, any> }) { }
// }

// export class InvalidRecordError {
//   public readonly message: 'Invalid record'
// }

// type Dictionary<T> = { [key: string]: T }
