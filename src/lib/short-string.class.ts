import { StringConstructor, StringConstructorError } from 'src/constructors'
import { PatternError } from 'src/errors'

export const ShortString = StringConstructor(
  {
    trim: true,
    maxLength: 256, // 2 ** 8
  },
  err => err as Exclude<StringConstructorError, PatternError>,
)
