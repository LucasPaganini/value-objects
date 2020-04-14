import { VOString } from '../core'

const maxLength = 65536 // 16 bits
export class LongString extends VOString({ trim: true, maxLength }) {}
