export class NotFoundError extends Error {
  public readonly message = 'Value not found in set'
  constructor() {
    super()
  }
}
