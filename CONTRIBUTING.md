# Contributing guide

Before starting any work, make sure there's a github issue describing what will be done (if there's none, [create one](https://github.com/LucasPaganini/value-objects/issues/new)). In that issue, assign yourself as the responsible and tag it with `"In progress"`. With an existing issue associated with your work, create a branch for your work using the following convention:

- `fix/{issue}` for fixes and hotfixes
- `feature/{issue}` for features

Other branch conventions are:

- `version/{version}` for versions
- `dev` for the latest development version
- `master` for the latest general released version

Once your work is done and [conforms with our style conventions](#style-conventions):

1. Create a pull request (PR)
2. Link the issue
3. Tag the issue with `"To verify"`
4. Untag the issue with `"In progress"`
5. Assign yourself as the responsible for the PR
6. At least one contributor will review you work
7. Once it's approved, we'll merge it

## Roadmap

- Remove the `lib` module (?)
- Figure out how to generate a website for the API docs
- Write gamified guides for common use cases
- Youtube video for the quickstart
- Youtube tutorials for how I built this library
- Youtube tutorials for this lib including usage
- Youtube tutorials on alternative libs compared to this lib/approach

## Style conventions

Before pushing (and preferably commiting too) any code, make sure it conforms to our conventions described below:

- 🚫 Not verified by `npm run lint`, needs to be manually checked
- ✅ Verified by `npm run lint`, needs to be manually fixed
- 🚀 Verified by `npm run lint`, automatically fixed by `npm run format`

| What                          | Convention      |
| :---------------------------- | :-------------- |
| 🚀 Semicolon                  | Avoid           |
| 🚀 Quotes                     | Prefer single   |
| 🚀 Trailing comma             | Multiple lines  |
| 🚀 Bracket spacing            | Always          |
| 🚀 Arrow function parenthesis | Avoid           |
| 🚀 Indentation                | 2 spaces        |
| 🚀 Max width                  | 120             |
| 🚀 Array types                | Generic         |
| 🚀 Comment padding            | 1 space         |
| 🚀 Member access              | Always explicit |
| ✅ Variables                  | Prefer const    |
| ✅ Equality                   | Triple equals   |
| ✅ All caps                   | Only const      |
| 🚫 File names                 | Kebab case      |

> NOTE: We have git hooks to check for some of those rules pre commit and pre push. You can bypass the pre commit hook with `--no-verify` if necessary, but **never** bypass it when pushing.

### 🚀 Semicolon, avoid

Only use semicolons when necessary.

### 🚀 Quotes, prefer single

Use single quotes unless the string contains a single quote, in that case use double quotes.

Do:

- `"It's my birthday"`
- `'It is my birthday'`

Don't :

- `"It is my birthday"`
- `'It\'s my birthday'`

### 🚀 Trailing comma, multiple lines

Add a trailing comma wherever possible when the list spams through multiple lines.

This rule clarifies our `git diff`s. If you were to add an element to a list with one element per line, you would have a diff showing the element you've added and the comma you had to put in the line above it. Using this rule, we won't have that problem.

Do:

<ul>
<li><code>[1, 2, 3];</code></li>
<li><pre>[
  longVariable,
  anotherLongVariable,
  yetAnotherLongVariable,
  theListWillCollapseSoon,
  itsTooLongToBeInASingleLine,
  addATrailingCommaNow,
];</pre></li>
</ul>

Don't:

<ul>
<li><code>[1, 2, 3,];</code></li>
<li><pre>[
  longVariable,
  anotherLongVariable,
  yetAnotherLongVariable,
  theListWillCollapseSoon,
  itsTooLongToBeInASingleLine,
  addATrailingCommaNow
];</pre></li>
</ul>

### 🚀 Bracket spacing, always

Add spaces between brackets.

Do:

- `const { a, b } = foo;`
- `import { x } from 'y';`

Don't:

- `const {a,b} = foo;`
- `import {x} from 'y';`

### 🚀 Arrow function parenthesis, avoid

Avoid adding parenthesis to arrow functions when there's only one parameter and it's type is inferred.

Do:

- `(a, b) => a + b;`
- `a => a + 1;`
- `(a: Date) => a.getTime();`

Don't:

- `(a) => a + 1;`

### 🚀 Indentation, 2 spaces

Use 2 spaces for indentation.

### 🚀 Max width, 120

Wherever possible, collapse lines longer than 120 characters.

### 🚀 Array types, generic

Describe array types using `Array<T>` instead of `T[]`.

### 🚀 Comment padding, 1 space

Comments must start with a space.

Do:

- `// NOTE: Blah blah blah`
- `// Foo bar baz`

Don't:

- `//NOTE: Blah blah blah`
- `//Foo bar baz`

### 🚀 Member access, always explicit

Always declare the property/method access level.

Do:

- `public property: string`
- `private _property: string`
- `public get property(): string`

Don't:

- `property: string`
- `get property(): string`

### ✅ Variables, prefer const

Prefer `const`, avoid `let` and never use `var`.

### ✅ Equality, triple equals

Always use `===` and `!==` for equality checks. Never use `==` or `!=`.

### ✅ All caps, only const

Only allow `const` declarations to be ALL_CAPS.

Do:

- `const SOME_FIXED_VALUE = 123;`
- `let someChangingValue = 123;`

Don't:

- `let SOME_CHANGING_VALUE = 123;`

### 🚫 File names, kebab case

All lowercase, use `-` for spaces, use `.spec.ts` for tests.

Do:

- `value-object.ts`
- `array.spec.ts`

Don't:

- `ValueObject.ts`
- `array-spec.ts`

Exceptions:

- `README.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
