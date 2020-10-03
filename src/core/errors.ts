import { ObjectPath } from '../utils'

const VO_ERROR_TAG = {}
export class VOError extends Error {
  private _tag = VO_ERROR_TAG

  constructor(message?: string | undefined, public readonly path = new ObjectPath([])) {
    super(message)
  }

  static is(err: Error): err is VOError {
    return (<VOError>err)._tag === VO_ERROR_TAG
  }
}

export class MaxLengthError extends VOError {
  public readonly message = 'Too long'
  constructor(public readonly maxLength: number, public readonly length: number) {
    super()
  }
}

export class MaxSizeError extends VOError {
  public readonly message = 'Too big'
  constructor(public readonly max: number, public readonly valueSize: number) {
    super()
  }
}

export class MinLengthError extends VOError {
  public readonly message = 'Too short'
  constructor(public readonly minLength: number, public readonly length: number) {
    super()
  }
}

export class MinSizeError extends VOError {
  public readonly message = 'Too small'
  constructor(public readonly min: number, public readonly valueSize: number) {
    super()
  }
}

export class NotInSetError extends VOError {
  public readonly message = 'Value not found in set'
  constructor(public readonly set: Array<string>, public readonly value: string, public readonly prop?: string) {
    super()
  }
}

export class NotIntegerError extends VOError {
  public readonly message = 'Not an integer'
  constructor(public readonly value: number, public readonly prop?: string) {
    super()
  }
}

export class PatternError extends VOError {
  public readonly message = "Value doesn't match pattern"
  constructor() {
    super()
  }
}

export class RawTypeError extends TypeError {
  public readonly message = 'Wrong raw value type'
  constructor(public readonly expected: string, public readonly actual: string, public readonly prop?: string) {
    super()
  }

  static is(err: Error): err is RawTypeError {
    return err.message === 'Wrong raw value type'
  }
}

export class UnknownError extends VOError {
  public readonly message = 'Unknown error'
  constructor() {
    super()
  }
}

export class LogicError extends VOError {
  public readonly message = 'Invalid logic'
  constructor(public readonly expected: string) {
    super()
  }
}
