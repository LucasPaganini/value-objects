interface CreateConstructor {
  <R, A>(fn: (a: A) => R): { new(a: A): R; (a: A): R }
  <R, A, B>(fn: (a: A, b: B) => R): { new(a: A, b: B): R; (a: A, b: B): R }
  <R, A, B, C>(fn: (a: A, b: B, c: C) => R): { new(a: A, b: B, c: C): R; (a: A, b: B, c: C): R }
  <R, A, B, C, D>(fn: (a: A, b: B, c: C, d: D) => R): { new(a: A, b: B, c: C, d: D): R; (a: A, b: B, c: C, d: D): R }
  <R, A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E) => R): { new(a: A, b: B, c: C, d: D, e: E): R; (a: A, b: B, c: C, d: D, e: E): R }
}

export const createConstructor: CreateConstructor = <T>(
  fn: (...args: any[]) => T,
): {
  new(...args: any[]): T
  (...args: any[]): T
} => {
  return function _class(...args: any[]): typeof _class {
    if (!(this instanceof _class)) return new (_class as any)(...args)
    return fn(...args) as any
  } as any
}

