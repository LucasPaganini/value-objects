import { VOString } from '../core'

const maxLength = 256 // 8 bits
export class ShortString extends VOString({ trim: true, maxLength }) {}
