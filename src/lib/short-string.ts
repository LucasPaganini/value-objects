import { VOString } from '../core'

const maxLength = 256 // 8 bits
export const ShortString = VOString({ trim: true, maxLength })
