export class UnknownError extends Error {
  public readonly message = 'Unknown error'
  constructor() {
    super()
  }
}
