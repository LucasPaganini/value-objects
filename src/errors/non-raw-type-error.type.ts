import { RawTypeError } from './raw-type-error.class'

export type NonRawTypeError<E> = E extends RawTypeError ? never : E
