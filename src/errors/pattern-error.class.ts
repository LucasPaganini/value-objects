export class PatternError extends Error {
  public readonly message = "Value doesn't match pattern"
  constructor() {
    super()
  }
}
