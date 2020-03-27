import { StringConstructor, StringConstructorError } from '../constructors'
import { PatternError } from '../errors'

export const MediumString = StringConstructor(
  {
    trim: true,
    maxLength: 4096, // 2 ** 12
  },
  err => err as Exclude<StringConstructorError, PatternError>,
)
