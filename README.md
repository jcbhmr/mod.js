# mod.js

## Development

### Go ➡️ JavaScript idioms

How do you faithfully represent ultiple return values in JavaScript? What about
the special `(T, bool)` and `(T, error)` conventions? What about `(T, U, bool)`?

The conventions that were chosen for this package are:

- Convert `(T, U, ..., error)` returns into `[T, U, ...]` with a `@throws`
  annotation.
- Convert `(T, error)` returns into `T` with a `@throws` annotation.
- Convert `(T, U, ..., bool)` returns into `[T, U, ...] | null`.
- Convert `(T, bool)` returns into `T | null`. Unless `T` could be `null` when
  the `ok bool` would be `true`, in which case... I don't know.

Go structs are modeled as classes with zero-argument constructors. Each property
of a struct-like JavaScript class should have a valid default state. For example
`name: string = ""` or `count: number = 0`. This behaves like a zero-value for
that property. Properties should then be set either by `instance.name = "Alan Turing"` property assignment or using `Object.assign(new Struct(), { name: "Alan Turing" } satisfies Partial<Struct>)`.
