import { Either, Right } from 'fp-ts/lib/Either'
import { ObjectConstructor, VOOptional } from './constructors'
import { ArrayConstructor } from './constructors/array-constructor.fn'
import { Email, ID, Integer, LongString } from './lib'
import { ValueObject } from './models'

const Message = VOOptional(
  ObjectConstructor({
    id: ID,
    text: LongString,
  }),
)

const IDs = ArrayConstructor(ID)
const User = ObjectConstructor({
  id: ID,
  email: Email,
  serviceIDs: IDs,
  messageCount: Integer,
  lastMessage: VOOptional(
    ObjectConstructor({
      id: ID,
      text: LongString,
    }),
  ),
})

Message.fromRaw(undefined)

IDs.fromRaw([''])
Message({ id: '', text: '' }).valueOf()?.text

const user = User({ id: '', email: '', serviceIDs: [''], messageCount: 3, lastMessage: '' })

var aaa: UnpackedEitherRight<ReturnType<typeof IDs['fromAny']>>
type AAA = RawValueObject<UnpackedEitherRight<ReturnType<typeof IDs['fromAny']>>>
type RawValueObject<VO extends ValueObject<any>> = VO extends ValueObject<infer Raw> ? Raw : never
type UnpackedEitherRight<E extends Either<any, any>> = E extends Right<infer R> ? R : never

type TEST = RawValueObject<UnpackedEitherRight<Either<Error, ValueObject<Array<string>>>>>

user.serviceIDs

type ObjectProps<O> = O extends { [s: string]: infer T } ? T : never
type DDD = ObjectProps<{ a: string; b: number }>
