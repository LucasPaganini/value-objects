export interface VOStringOptions {
  trim?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

export interface VOStringInstance {
  valueOf(): string
}

export interface VOStringConstructor {
  new (r: string): VOStringInstance
}

export const VOString = (options: VOStringOptions = {}): VOStringConstructor => {
  return {} as any
}
