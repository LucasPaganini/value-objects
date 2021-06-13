# Quickstart

## Understanding our context

Let's say we have a REST API and we're working in the request responsible for creating a new user account `POST /api/users`.

This route receives a JSON object with the user `name`, `email` and `password`, saves the user in a database and returns the user `name`, `email` and `id`. In TypeScript, that would be:

```typescript
interface ReceivedData {
  name: string;
  email: string;
  password: string;
}

interface ReturnedData {
  id: string;
  name: string;
  email: string;
}
```

Our problem is that people are submitting invalid data to this route and we're accepting it instead of throwing errors. The other day someone created an account with the email `not-an-actual-email`, the password `abc` and a name 64.000 characters long. We need to make sure that:

- The email property is a valid email
- The password has at least, 8 characters, a digit, a lowercase letter and a uppercase letter
- None of those fields is longer than 256 characters
- None of those fields is an empty string `""`

This is the current route code written with Express:

```typescript
app.post('/api/users', (req, res) => {
  const data: ReceivedData = req.data;
  const user = createUser(data);
  delete user.password;
  res.status(200).json(user);
});
```

## Validating our data

Ok, let's make sure our received data passes the requirements and we'll return a `400 Bad Request` otherwise. **PS: Don't freak out when you see the following code**

```typescript
app.post('/api/users', (req, res) => {
  const data: ReceivedData = req.data;

  if (data.name.trim() === '')
    return res.status(400).json({ error: "Name can't be empty" });
  if (data.name.length > 256)
    return res
      .status(400)
      .json({ error: "Name can't be longer than 256 characters" });

  if (data.email.trim() === '')
    return res.status(400).json({ error: "Email can't be empty" });
  if (data.email.length > 256)
    return res
      .status(400)
      .json({ error: "Email can't be longer than 256 characters" });
  const EMAIL_REGEX = /imagine-a-super-cool-regex-validating-the-email-here/;
  if (!EMAIL_REGEX.test(data.email))
    return res.status(400).json({ error: 'Invalid email' });

  if (data.password.trim() === '')
    return res.status(400).json({ error: "Password can't be empty" });
  if (data.password.length > 256)
    return res
      .status(400)
      .json({ error: "Password can't be longer than 256 characters" });
  const PASSWORD_REGEX =
    /imagine-a-super-cool-regex-validating-the-password-here/;
  if (!PASSWORD_REGEX.test(data.password))
    return res.status(400).json({ error: 'Invalid password' });

  const user = createUser(data);
  delete user.password;
  res.status(200).json(user);
});
```

- **Your conscience**: Holy #!&@, that's ugly.
- **Boss**: Hey, we forgot to check for `undefined` and there's a route to change a user password and we need to validate that too
- **Your conscience again**: OHH MY GOD, I ALREADY HATE THIS CODE
- **PS: Now you can freak out**

## Let's clean this mess

Yo, you know what? We're only having this problem because we were treating every `string` as a valid name/email/password. Imagine a world where we have an `Email` type, a `Password` type and a `Name` type. That would be awesome...

Let's build that using classes, and we'll also add the `valueOf()` method to convert them back to strings.

```typescript
class Name {
  private value: string;

  constructor(rawInit: string) {
    if (rawInittrim() === '') throw Error("Can't be empty");
    if (rawInit.length > 256) throw Error('Too long');
    this.value = rawInit;
  }

  public valueOf(): string {
    return this.value;
  }
}

class Email {
  private value: string;

  constructor(rawInit: string) {
    if (rawInittrim() === '') throw Error("Can't be empty");
    if (rawInit.length > 256) throw Error('Too long');
    const EMAIL_REGEX = /imagine-a-super-cool-regex-validating-the-email-here/;
    if (!EMAIL_REGEX.test(rawInit)) throw Error("Doesn't match the pattern");
    this.value = rawInit;
  }

  public valueOf(): string {
    return this.value;
  }
}

class Password {
  private value: string;

  constructor(rawInit: string) {
    if (rawInittrim() === '') throw Error("Can't be empty");
    if (rawInit.length > 256) throw Error('Too long');
    const PASSWORD_REGEX =
      /imagine-a-super-cool-regex-validating-the-password-here/;
    if (!PASSWORD_REGEX.test(rawInit)) throw Error("Doesn't match the pattern");
    this.value = rawInit;
  }

  public valueOf(): string {
    return this.value;
  }
}
```

And now we can add the validation this way:

```typescript
app.post('/api/users', (req, res) => {
  const data: ReceivedData = req.data;

  try {
    new Name(data.name);
    new Email(data.email);
    new Password(data.password);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  const user = createUser(data);
  delete user.password;
  res.status(200).json(user);
});
```

## Reusing the code

This code is super repetitive though, and it's weird to test the value individually, that's why I built this library. This library is a collection of functions that you can use to create your own types using classes. For example, we'll use the [`VOString()`](api.md#vostring) to simplify all those classes. You can read the documentation for it but maybe you'll understand just by looking at the code.

```typescript
import { VOString } from '@lucaspaganini/value-objects';

const EMAIL_REGEX = /imagine-a-super-cool-regex-validating-the-email-here/;
const PASSWORD_REGEX = /imagine-a-super-cool-regex-validating-the-password-here/;

class Name extends VOString({ trim: true, minLength: 1, maxLength: 256 });
class Email extends VOString({ trim: true, maxLength: 256, pattern: EMAIL_PATTERN });
class Password extends VOString({
  minLength: 8,
  maxLength: 256,
  pattern: PASSWORD_REGEX
});
```

And to create a class that agregates all of those, we can use the [`VOObject()`](api.md#voobject).

```typescript
import { VOObject } from '@lucaspaganini/value-objects';

class CreateUserData extends VOObject({
  name:Name,
  email:Email,
  password:Password
})

app.post('/api/users', (req, res) => {
  const data: ReceivedData = req.data;

  try {
    new CreateUserData(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  const user = createUser(data);
  delete user.password;
  res.status(200).json(user);
});
```

Done.

## A word of caution

Classes can become a burden if you don't know what is going on. I did my best to simplify this library and avoid any unnecessary methods and properties because **I don't want you thinking this is magic**. If you still do not fully understand how this works, I encourage you to ~~watch this video series were I decribe how I built this library (besides teaching how it works, you'll learn _a lot_ of advanced TypeScript techniques)~~ [read the API docs](api.md).

## Next steps

There's _so much_ that wasn't mentioned here, like:

- [VOInteger](api.md#vointeger)
- [VOFloat](api.md#vofloat)
- [VOSet](api.md#voset)
- [VOOptional](api.md#vooptional)
- [VOArray](api.md#voarray)
- [VOAny](api.md#voany)
- [Functional helpers](api.md#functional-helpers)

Plus a bunch of conceptual discussions about why, how and when you can use value objects. For now, what I can recommend you is:

- ~~Learn how I built this library~~ (not ready yet)
- [Read the API docs](api.md)
- Read articles about value objects
- Read about Domain Driven Design (DDD)
