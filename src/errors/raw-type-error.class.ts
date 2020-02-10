export class RawTypeError extends TypeError {
  public readonly message = 'Wrong raw value type'
  constructor(public readonly expected: string, public readonly actual: string) {
    super()
  }
}
