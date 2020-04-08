import { Either, left, right } from 'fp-ts/lib/Either'
import { NativeValueObject, ValueObjectContructor, VOCRaw, VOCRawInit } from './value-object'

export const makeFromAny = <VOC extends ValueObjectContructor>(VO: VOC) => (
  data: any,
): Either<Array<Error>, InstanceType<VOC>> => {
  try {
    return right(new VO(data) as any)
  } catch (err) {
    if (err instanceof Error) return left([err])
    if (err instanceof Array && err.every(e => e instanceof Error)) return left(err)
    return left([Error()])
  }
}

export const makeFromRaw = <VOC extends ValueObjectContructor>(VO: VOC) => {
  const fromAny = makeFromAny(VO)
  return (data: VOCRawInit<VOC>): Either<Array<Error>, InstanceType<VOC>> => fromAny(data)
}

export const makeIsRaw = <VOC extends ValueObjectContructor>(VO: VOC) => (v: any): v is VOCRaw<VOC> => {
  try {
    new VO(v)
    return true
  } catch {
    return false
  }
}

export const makeIs = <VOC extends ValueObjectContructor>(VO: VOC) => (v: any): v is InstanceType<VOC> =>
  v instanceof VO

export const toRaw = <VO extends NativeValueObject<any>>(
  vo: VO,
): VO extends NativeValueObject<infer Raw> ? Raw : never => vo.valueOf()
