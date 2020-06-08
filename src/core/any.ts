import { ValueObject, ValueObjectContructor, VOCRawInit, VORaw } from './value-object'
import { MinLengthError } from './errors'

export interface VOAnyInstance<VO extends ValueObject<any>> {
  readonly value: VO
  valueOf(): VORaw<VO>
}

export interface VOAnyConstructor<VOC extends ValueObjectContructor> {
  new (r: VOCRawInit<VOC>): VOAnyInstance<InstanceType<VOC>>
}

/**
 * Function to create a value object constructor with many inner value
 * object constructors to attempt instantiation.
 * Useful if you're expecting one of many value objects.
 *
 * @template VOC Value object constructor type to make an wrapper of.
 * @param VOCs Array of value object constructor to attempt instantiation in order.
 * @return Class constructor that accepts all that the inner value object
 * constructors would accept and tries to instantiate one of the inner
 * value object constructors in the order that they were given.
 * The class created by `VOAny` wraps the inner classes and
 * exposes the one used for instantiation through the `.value`
 * property. Calling {@link VOAnyInstance.valueOf} will call
 * `valueOf()` for that inner class.
 *
 * @example
 * ```typescript
 * class Email { ... }
 * class UserName { ... }
 * class EmailOrUserName extends VOAny([Email, UserName]) {}
 *
 * new EmailOrUserName('lucas@example.com').value // Email
 * new EmailOrUserName('lucas').value // UserName
 * ```
 */
export const VOAny = <VOC extends ValueObjectContructor>(VOCs: Array<VOC>): VOAnyConstructor<VOC> => {
  if (VOCs.length < 1) throw new MinLengthError(1, VOCs.length)

  return class {
    public readonly value: InstanceType<VOC>

    constructor(raw: VOCRawInit<VOC>) {
      const errors: Array<any> = []
      for (const VO of VOCs) {
        try {
          const valueObject = <InstanceType<VOC>>new VO(raw)
          this.value = valueObject
          return
        } catch (err) {
          errors.push(err)
        }
      }
      throw errors
    }

    valueOf(): VORaw<InstanceType<VOC>> {
      return this.value.valueOf()
    }
  }
}
