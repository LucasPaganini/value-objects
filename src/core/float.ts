export interface VOFloatOptions {
  min?: number
  max?: number
  precision?: number
  precisionTrim?: 'floor' | 'ceil' | 'round'
}

export interface VOFloatInstance {
  valueOf(): number
}

export interface VOFloatConstructor {
  new (r: number): VOFloatInstance
}

export const VOFloat = (options: VOFloatOptions = {}): VOFloatConstructor => {
  return {} as any
}
