import { VOString } from '../core'

const maxLength = 4096 // 12 bits
export const MediumString = VOString({ trim: true, maxLength })
