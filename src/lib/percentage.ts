import { VOFloat } from '../core'

export class Percentage extends VOFloat({ min: 0, max: 100, precision: 2, precisionTrim: 'round' }) {}
