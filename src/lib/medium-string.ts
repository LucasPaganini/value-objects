import { VOString } from '../core'

const maxLength = 4096 // 12 bits
export class MediumString extends VOString({ trim: true, maxLength }) {}
