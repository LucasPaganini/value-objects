import { VOString, StringConstructorError } from '../constructors'
import { PatternError } from '../errors'

export const ShortString = VOString(
  {
    trim: true,
    maxLength: 256, // 2 ** 8
  },
  err => err as Exclude<StringConstructorError, PatternError>,
)
