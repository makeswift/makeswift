// FIXME: copy & paste from the builder repo, we need a `lib` package
declare const __brand: unique symbol
export type Brand<B> = { [__brand]: B }

export type Branded<T, B> = T & Brand<B>
