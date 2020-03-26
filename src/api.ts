import { Email } from './lib'

const Schema = createSchema({
  worktype: lazyMapRequiredOrInvalid(IDFactory.fromAny, e.requiredBodyWorktype, e.invalidBodyWorktype),
  code: lazyMapRequiredOrInvalid(IntegerFactory.fromAny, e.requiredBodyCode, e.invalidBodyCode),
  isFieldTicket: lazyMapRequiredOrInvalid(
    BooleanFactory.fromAny,
    e.requiredBodyIsFieldTicket,
    e.invalidBodyIsFieldTicket,
  ),
  description: lazyMapRequiredOrInvalid(
    MediumStringFactory.fromAny,
    e.requiredBodyDescription,
    e.invalidBodyDescription,
  ),
  details: lazyMapRequiredOrInvalid(MediumStringFactory.fromAny, e.requiredBodyDetails, e.invalidBodyDetails),
})

const data = Schema.fromAny(body)

const lazyMapRequiredOrInvalid = <ValueObject, RequiredError extends HTTPError, InvalidError extends HTTPError>(
  fn: (value: any) => Either<string, ValueObject>,
  requiredError: RequiredError,
  invalidError: InvalidError,
) => (value: any): Either<RequiredError | InvalidError, ValueObject> =>
  mapLeft(error => (isRequiredError(error) ? requiredError : invalidError))(fn(value))

const Schema22 = createSchema({
  worktype: ID.fromAny,
  code: raw =>
    mapInvalid(
      IntegerFactory.fromAny(raw),
      invalidError,
    )(isUndefined(raw) ? right(none) : mapLeft(() => invalidError, IntegerFactory.fromAny(raw))),
})

const ServiceIDs = VOArray(ID, { minLength: 1, maxLength: 20 })()

const User = VOSchema({
  id: ID,
  email: Email,
  hashedPassword: HashedString,
  serviceIDs: ServiceIDs,
})

User.fromAny({})
