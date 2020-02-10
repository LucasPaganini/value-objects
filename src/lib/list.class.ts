// import { ValueObject } from '../models'
// import { Either, left, isLeft, right } from 'fp-ts/lib/Either'
// import { createConstructor, simpleValueObject } from 'src/utils'




// export class List<T extends ValueObject<E, T>, E> implements ValueObject<E | InvalidListError, Array<T>> {
//   fromAny(data: any): Either<E | InvalidListError, Array<T>> {
//     if (!(data instanceof Array)) return left(new InvalidListError())

//     const rs: Array<T> = []
//     for (const d of data) {
//       const r = this.value.fromAny(d)
//       if (isLeft(r)) return r
//       rs.push(r.right)
//     }
//     return right(rs)
//   }

//   constructor(private value: T) { }
// }

// export class InvalidListError {
//   public readonly message: 'Invalid list'
// }
