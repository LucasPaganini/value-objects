import { StringConstructor, StringConstructorError } from '../constructors'
import { PatternError } from '../errors'

export const LongString = StringConstructor(
  {
    trim: true,
    maxLength: 65536, // 2 ** 16
  },
  err => err as Exclude<StringConstructorError, PatternError>,
)
