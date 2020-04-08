import { VOFloat } from '../core'

export const Percentage = VOFloat({ min: 0, max: 100, precision: 2, precisionTrim: 'round' })
