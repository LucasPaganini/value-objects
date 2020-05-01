# Value Objects

A TypeScript first validation and class creation library. [Learn in 10 minutes with the quickstart](docs/quickstart.md).

- 100% typed
- 100% tested
- Simple syntax
- Zero dependencies
- Exported in ES5

## IMPORTANT: About the package size

NPM's "Unpacked Size" is innacurate because the package includes the source maps and files for easier debugging. Also, The `lib/` folder is a module aside, it includes some common use cases for the library but it's not included in the main bundle, it's just there for your convenience. I'd bet that most users won't touch the `lib/`, so, the accurate size of this library for most users is this:

| Version 1.0.2           |     Size |
| :---------------------- | -------: |
| Unpacked                | 40.91 KB |
| Minified bundle         | 16.08 KB |
| Gzipped minified bundle |  3.73 KB |

## Motivation

If you have to represent the user age in years, would you use a `string` or a `number`? **Doesn't matter, they're both not ideal**. Every age in years could be represented as a `string` or as a `number`, but not every `string` or `number` could represent a valid age.

Value objects to the rescue: If you want an age, create an Age object.

```typescript
import { VOInteger } from '@lucaspaganini/value-objects'

class Age {
  private _value: number

  constructor(raw: number) {
    if (raw < 0) throw Error('Too small')
    if (raw > 150) throw Error('Too big')
    if (!Number.isInteger(raw)) throw Error('Not an integer')
    this._value = raw
  }

  valueOf(): number {
    return this._value
  }

  toMonths(): number {
    return this.valueOf() * 12
  }
}
```

But that's ugly, so I made this library to ease your pain.

```typescript
import { VOInteger } from '@lucaspaganini/value-objects'

class Age extends VOInteger({ min: 0, max: 150 }) {
  toMonths(): number {
    return this.valueOf() * 12
  }
}
```

## Usage

### Creating value objects

```typescript
import { VOString, VOInteger, VOSet, VOArray, VOObject } from '@lucaspaganini/value-objects'

const EMAIL_PATTERN = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/
export class Email extends VOString({ trim: true, maxLength: 256, pattern: EMAIL_PATTERN }) {
  getHost(): string {
    const arr = this.valueOf().split('@')
    return arr[arr.length - 1]
  }
}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]*$/ // One lowercase, one uppercase, one number
class Password extends VOString({ trim: false, minLength: 8, maxLength: 256, pattern: PASSWORD_PATTERN }) {}

class Age extends VOInteger({ min: 0, max: 150 }) {
  toMonths(): number {
    return this.valueOf() * 12
  }
}

class NetflixShow extends VOSet(['You', 'House of Cards', 'Sense8', 'The Witcher']) {}

class NetflixShows extends VOArray(NetflixShow, { minLength: 1 }) {}

class User extends VOObject({
  email: Email,
  password: Password,
  age: Age,
  favoriteShows: NetflixShows,
}) {}
```

### Type safety

```typescript
const userError = new User({
  email: '', // RUNTIME ERROR: Will throw when trying to instantiate an Email with an empty string, but it's still a `string` so it's type is correct
  password: 123, // COMPILATION ERROR: TypeScript expects a `string` because that's what the Password constructor expects
  age: 21.5, // RUNTIME ERROR: Will throw when trying to instantiate an Age with a non integer number. If you want a float, you can extend `VOFloat()`
  favoriteShows: ['Lost'], // RUNTIME ERROR: "Lost" is not in the set. You might think it shouldn't accept any string, but it's a design decision (see VOSet in the docs)
})

const userSuccess = new User({
  email: 'test@example.com',
  password: '123abc',
  age: 150,
  favoriteShows: ['Lost'],
})
```

### Validating / instantiating objects

```typescript
import { makeFromAny, makeFromRaw } from '@lucaspaganini/value-objects'

const userFromRaw = makeFromRaw(User)
const userFromAny = makeFromAny(User)

userFromRaw({}) // COMPILATION ERROR: It expects a correct raw user structure
userFromAny({}) // It expects `any` and will return a `Left<Error[]>`

app.post('/api/create-user', (req, res) => {
  const userEither = userFromAny(req.body)
  if (userEither._tag === 'Left') return res.status(400).json({ errors: userEither.left })
  const user = userEither.right

  const createdUser = createUser(user)
  res.status(200).json({ user: createdUser })
})
```

## Resources

- [Learn in 10 minutes with the quickstart](docs/quickstart.md)
- [API](docs/api.md)
  - [VOInteger](docs/api.md#vointeger)
  - [VOFloat](docs/api.md#vofloat)
  - [VOString](docs/api.md#vostring)
  - [VOSet](docs/api.md#voset)
  - [VOOptional](docs/api.md#vooptional)
  - [VOArray](docs/api.md#voarray)
  - [VOObject](docs/api.md#voobject)
  - [VOAny](docs/api.md#voany)
  - [Functional helpers](docs/api.md#functions)
- [Contribute](docs/contributing.md)
