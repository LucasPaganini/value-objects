import { StringConstructor, StringConstructorError } from '../constructors'
import { MinLengthError } from '../errors'

export const Email = StringConstructor(
  {
    trim: true,
    maxLength: 256,
    pattern: /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,
  },
  err => err as Exclude<StringConstructorError, MinLengthError>,
)
