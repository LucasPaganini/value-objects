export interface VOIntegerOptions {
  min?: number
  max?: number
}

export interface VOIntegerInstance {
  valueOf(): number
}

export interface VOIntegerConstructor {
  new (r: number): VOIntegerInstance
}

export const VOInteger = (options: VOIntegerOptions = {}): VOIntegerConstructor => {
  return {} as any
}
