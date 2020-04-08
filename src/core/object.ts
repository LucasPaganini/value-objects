import { ValueObject, ValueObjectContructor, VOCRaw, VOCRawInit } from './value-object'

export interface VOObjectOptions {
  maxErrors?: number
}

type VOObjectSchema<O> = { [P in keyof O]: ValueObjectContructor }
type VOObjectRawInitSchema<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRawInit<O[P]> : never
}
type VOObjectRawSchema<O extends VOObjectSchema<O>> = {
  [P in keyof O]: O[P] extends ValueObjectContructor ? VOCRaw<O[P]> : never
}

export type VOObjectInstance<O extends VOObjectSchema<O>> = ValueObject<VOObjectRawSchema<O>> &
  { [P in keyof O]: InstanceType<O[P]> }

export interface VOObjectConstructor<O extends VOObjectSchema<O>> {
  new (r: VOObjectRawInitSchema<O>): VOObjectInstance<O>
}

export const VOObject = <O extends VOObjectSchema<O>>(o: O, options: VOObjectOptions = {}): VOObjectConstructor<O> => {
  return {} as any
}
