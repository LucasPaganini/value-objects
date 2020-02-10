export class MinSizeError extends Error {
  public readonly message = 'Too small'
  constructor(public readonly min: number, public readonly valueSize: number) {
    super()
  }
}
