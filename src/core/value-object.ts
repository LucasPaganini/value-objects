/**
 * This is the base interface that drives this whole library.
 * All the utility functions, be it {@link VOInteger}, {@link VOArray} or {@link VOSet},
 * they all return classes that comply with the `ValueObject` interface.
 *
 * The choice for `valueOf()` is **super** important because it allows us to leverage
 * the way that JavaScript works. Every Object in JavaScript implements `valueOf()`,
 * it's a native thing. That means `Date`, `Boolean`, `Number`, and _many many many other_
 * JavaScript classes comply with this library.
 *
 * @template Raw Primitive(ish) representation of the value object.
 */
export interface ValueObject<Raw> {
  /**
   * Returns the primitive(ish) value that represents this value object.
   */
  valueOf(): Raw
}

/**
 * Work around to make the {@link VORaw} type extractor work with {@link VOObject}.
 *
 * @internal
 * @template Raw Primitive(ish) representation of the value object.
 */
export interface ValueObjectWorkAround<Raw> extends ValueObject<Raw> {
  toRaw(): Raw
}

/**
 * @template Raw Primitive(ish) representation of the value object.
 * @template RawInit Initial primitive(ish) used to instantiate the value object.
 */
export interface ValueObjectContructor<Raw = any, RawInit = Raw> {
  new (r: RawInit): ValueObject<Raw>
}

/**
 * Returns the raw type of a value object. The raw type is the type of the value
 * returned by the value object when calling `valueOf()`.
 *
 * @template VO The value object from which the raw type is extracted.
 */
export type VORaw<VO extends ValueObject<any>> = VO extends ValueObjectWorkAround<any>
  ? ReturnType<VO['toRaw']>
  : VO extends ValueObject<infer R>
  ? R
  : never

/**
 * Returns the initial raw type of a value object constructor. The initial raw type is the
 * type of the value used to instantiate the value object when calling `constructor(rawInit)`.
 *
 * @template VOC The value object constructor from which the initial raw type is extracted.
 */
export type VOCRawInit<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor<any, infer T> ? T : never

/**
 * Returns the raw type of a value object constructor. The raw type is the type of
 * the value returned by the value object when calling `valueOf()`.
 *
 * @template VOC The value object constructor from which the raw type is extracted.
 */
export type VOCRaw<VOC extends ValueObjectContructor> = VOC extends ValueObjectContructor
  ? VORaw<InstanceType<VOC>>
  : never
