import { VOString, StringConstructorError } from '../constructors'
import { PatternError } from '../errors'

export const MediumString = VOString(
  {
    trim: true,
    maxLength: 4096, // 2 ** 12
  },
  err => err as Exclude<StringConstructorError, PatternError>,
)
