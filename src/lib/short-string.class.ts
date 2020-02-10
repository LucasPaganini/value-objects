import { StringConstructor, StringConstructorError } from '../constructors'
import { PatternError } from '../errors'

export const ShortString = StringConstructor(
  {
    trim: true,
    maxLength: 256, // 2 ** 8
  },
  err => err as Exclude<StringConstructorError, PatternError>,
)
