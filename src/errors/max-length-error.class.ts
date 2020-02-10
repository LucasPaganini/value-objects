export class MaxLengthError extends Error {
  public readonly message = 'Too long'
  constructor(public readonly maxLength: number, public readonly length: number) {
    super()
  }
}
