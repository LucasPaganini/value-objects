export class NotIntegerError extends Error {
  public readonly message = 'Not an integer'
  constructor(public readonly value: number) {
    super()
  }
}
