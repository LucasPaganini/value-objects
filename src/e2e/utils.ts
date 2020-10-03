export type ConstructorFn<C extends new (...args: any) => any> = C extends new (...args: infer P) => InstanceType<C>
  ? (...args: P) => InstanceType<C>
  : never

export const constructorFn = <C extends new (...args: any) => any>(C: C): ConstructorFn<C> => C as any
