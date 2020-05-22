import { Either, left, right } from '../utils'
import { ValueObjectContructor, VOCRawInit } from './value-object'

export const makeIsValidRawInit = <VOC extends ValueObjectContructor>(VO: VOC) => (v: any): v is VOCRawInit<VOC> => {
  try {
    new VO(v)
    return true
  } catch {
    return false
  }
}

export const makeFromRawInit = <VOC extends ValueObjectContructor>(VO: VOC) => (
  data: VOCRawInit<VOC>,
): Either<Array<Error>, InstanceType<VOC>> => {
  const isError = (v: any): v is Error => v instanceof Error

  try {
    return right(new VO(data) as any)
  } catch (err) {
    if (isError(err)) return left([err])
    if (err instanceof Array && err.every(isError)) return left(err)
    return left([Error()])
  }
}

export interface ValueObjectFunctions<VOC extends ValueObjectContructor> {
  isValidRawInit(v: any): v is VOCRawInit<VOC>
  fromRawInit(data: VOCRawInit<VOC>): Either<Array<Error>, InstanceType<VOC>>
}

export const makeFunctions = <VOC extends ValueObjectContructor>(VO: VOC): ValueObjectFunctions<VOC> => ({
  isValidRawInit: makeIsValidRawInit(VO),
  fromRawInit: makeFromRawInit(VO),
})
