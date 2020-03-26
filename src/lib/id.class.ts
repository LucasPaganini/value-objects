import { VOString } from '../constructors'

export const ID = VOString({
  trim: true,
  maxLength: 256,
  minLength: 6,
})
