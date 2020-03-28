import { ObjectConstructor } from './constructors'
import { ArrayConstructor } from './constructors/array-constructor.fn'
import { Email, Integer, ID } from './lib'
import { ValueObject } from './models'
import { Either, Right } from 'fp-ts/lib/Either'

const IDs = ArrayConstructor(ID)
const User = ObjectConstructor({
  id: ID,
  email: Email,
  serviceIDs: IDs,
  messageCount: Integer,
})

IDs.fromRaw([''])

const user = User({ id: '', email: '', serviceIDs: [''], messageCount: 3 })

var aaa: UnpackedEitherRight<ReturnType<typeof IDs['fromAny']>>
type AAA = RawValueObject<UnpackedEitherRight<ReturnType<typeof IDs['fromAny']>>>
type RawValueObject<VO extends ValueObject<any>> = VO extends ValueObject<infer Raw> ? Raw : never
type UnpackedEitherRight<E extends Either<any, any>> = E extends Right<infer R> ? R : never

type TEST = RawValueObject<UnpackedEitherRight<Either<Error, ValueObject<Array<string>>>>>

user.serviceIDs
