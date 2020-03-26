import { Either } from "fp-ts/lib/Either";
import { ValueObjectConstructor } from "src/models";
import { Email, ShortString } from "src/lib";

export const fromSchema = <T>(schema: T): Either<SchemaErrors<T>, SchemaValue<T>> => {

}



export type Schema = {
  [key: string]: ValueObjectConstructor<any, any> | Schema
}

export type RawValueObjectConstructor<T, C extends ValueObjectConstructor<any, any, T>> = T


const a: Schema = {
  email: Email,
  test: {
    ss: ShortString
  }
}

type RawSchema<S extends Schema> = {
  [P in keyof Schema]: 
}