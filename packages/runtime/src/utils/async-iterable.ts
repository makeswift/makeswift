export class AsyncIterableExt<T> implements AsyncIterable<T> {
  constructor(public readonly iterable: AsyncIterable<T>) {}

  async *[Symbol.asyncIterator]() {
    for await (const value of this.iterable) {
      yield value
    }
  }

  map<U>(callback: (arg: T) => U) {
    const iterable = this.iterable
    return makeAsyncIterableExt<U>(async function* () {
      for await (const value of iterable) {
        yield callback(value)
      }
    })
  }

  filter(predicate: (arg: T) => Boolean) {
    const iterable = this.iterable
    return makeAsyncIterableExt<T>(async function* () {
      for await (const value of iterable) {
        if (predicate(value)) yield value
      }
    })
  }

  async toArray() {
    const result: T[] = []
    for await (const item of this) {
      result.push(item)
    }
    return result
  }
}

export function makeAsyncIterableExt<T>(generator: () => AsyncIterator<T>) {
  return new AsyncIterableExt<T>({
    [Symbol.asyncIterator]: generator,
  })
}
