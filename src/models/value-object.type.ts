export interface ValueObject<RawValue> {
  valueOf(): RawValue
  toJSON(): RawValue
}
