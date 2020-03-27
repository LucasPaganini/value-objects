import { StringConstructor } from '../constructors'

export const ID = StringConstructor({
  trim: true,
  maxLength: 256,
  minLength: 6,
})
