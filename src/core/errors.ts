export class MaxLengthError extends Error {
  public readonly message = 'Too long'
  constructor(public readonly maxLength: number, public readonly length: number) {
    super()
  }
}

export class MaxSizeError extends Error {
  public readonly message = 'Too big'
  constructor(public readonly max: number, public readonly valueSize: number) {
    super()
  }
}

export class MinLengthError extends Error {
  public readonly message = 'Too short'
  constructor(public readonly minLength: number, public readonly length: number) {
    super()
  }
}

export class MinSizeError extends Error {
  public readonly message = 'Too small'
  constructor(public readonly min: number, public readonly valueSize: number) {
    super()
  }
}

export class NotFoundError extends Error {
  public readonly message = 'Value not found in set'
  constructor() {
    super()
  }
}

export class NotIntegerError extends Error {
  public readonly message = 'Not an integer'
  constructor(public readonly value: number) {
    super()
  }
}

export class PatternError extends Error {
  public readonly message = "Value doesn't match pattern"
  constructor() {
    super()
  }
}

export class RawTypeError extends TypeError {
  public readonly message = 'Wrong raw value type'
  constructor(public readonly expected: string, public readonly actual: string) {
    super()
  }
}

export class UnknownError extends Error {
  public readonly message = 'Unknown error'
  constructor() {
    super()
  }
}
