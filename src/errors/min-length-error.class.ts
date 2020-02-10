export class MinLengthError extends Error {
  public readonly message = 'Too short'
  constructor(public readonly minLength: number, public readonly length: number) {
    super()
  }
}
