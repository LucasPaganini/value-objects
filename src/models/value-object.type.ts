export interface ValueObject<RawValue> {
  readonly value: RawValue
  valueOf(): RawValue
  toJSON(): RawValue
}
