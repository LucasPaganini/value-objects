export type Setable = string | number | boolean

export type VOSetRaw<T extends Setable> =
  | (T extends number ? number : never)
  | (T extends string ? string : never)
  | (T extends boolean ? boolean : never)

export interface VOSetInstance<T extends Setable> {
  valueOf(): T
}

export interface VOSetConstructor<T extends Setable> {
  new (r: VOSetRaw<T>): VOSetInstance<T>
}

export const VOSet = <T extends Setable>(validValues: Array<T>): VOSetConstructor<T> => {
  return {} as any
}
