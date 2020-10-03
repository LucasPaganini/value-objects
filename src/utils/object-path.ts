import { isDefined, isNumber } from './guards'

const DOT_PROPERTY_PATTERN = /^[a-z_][\w]*$/i
const isDotProperty = (prop: ObjectPathProperty): boolean => {
  if (isNumber(prop)) return false
  return DOT_PROPERTY_PATTERN.test(prop)
}

export type ObjectPathProperty = string | number
export class ObjectPath {
  constructor(private readonly _pathArray: Array<ObjectPathProperty>) {}

  public push(prop: ObjectPathProperty): void {
    this._pathArray.push(prop)
  }

  public toArray(): Array<ObjectPathProperty> {
    return this._pathArray.concat([])
  }

  public valueOf(): string {
    return this._pathArray.reduce<string>((path, currentProp, i, arr) => {
      const lastProp: ObjectPathProperty | undefined = arr[i - 1]
      const propPrefix = isDefined(lastProp) && isDotProperty(currentProp) ? '.' : ''
      const propString = isDotProperty(currentProp) ? currentProp : `[${currentProp}]`
      return path + propPrefix + propString
    }, '')
  }

  public toJSON(): string {
    return this.valueOf()
  }
}
