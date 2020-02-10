import { StringConstructor, StringConstructorError } from 'src/constructors'
import { PatternError } from 'src/errors'

export const LongString = StringConstructor(
  {
    trim: true,
    maxLength: 65536, // 2 ** 16
  },
  err => err as Exclude<StringConstructorError, PatternError>,
)
