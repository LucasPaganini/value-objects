export class MaxSizeError extends Error {
  public readonly message = 'Too big'
  constructor(public readonly max: number, public readonly valueSize: number) {
    super()
  }
}
