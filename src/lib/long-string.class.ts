import { VOString } from '../core'

const maxLength = 65536 // 16 bits
export const LongString = VOString({ trim: true, maxLength })
