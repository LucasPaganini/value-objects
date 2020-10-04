/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

type PredicateFn<T> = (v: any) => v is T
const makeIsNot = <T>(fn: PredicateFn<T>) => <V extends any>(v: V): v is Exclude<V, T> => !fn(v)

export const isString = (v: any): v is string => typeof v === 'string'
export const isNotString = makeIsNot(isString)

export const isNumber = (v: any): v is number => typeof v === 'number'
export const isNotNumber = makeIsNot(isNumber)

export const isUndefined = (v: any): v is undefined => v === undefined
export const isDefined = makeIsNot(isUndefined)

export const isNull = (v: any): v is null => v === null
export const isNotNull = makeIsNot(isNull)

export const isNil = (v: any): v is null | undefined => isNull(v) || isUndefined(v)

export const isError = (v: any): v is Error => v instanceof Error
