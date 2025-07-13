import { AsyncIterableExt } from './async-iterable'

type PaginationResult<T> = { data: T[]; hasMore: boolean }
type IterablePaginationResult<T> = Promise<PaginationResult<T>> & AsyncIterableExt<T>

type PaginationFunction<Options, R extends { id: any }> = Options extends {
  after?: string
}
  ? (options: Options) => Promise<PaginationResult<R>>
  : never

type IterableMethod<Options, R> =
  Partial<Options> extends Options
    ? (options?: Options) => IterablePaginationResult<R>
    : (options: Options) => IterablePaginationResult<R>

export function toIterablePaginationResult<Options, R extends { id: string }>(
  fn: PaginationFunction<Options, R>,
): IterableMethod<Options, R> {
  return (options?: Options): IterablePaginationResult<R> => {
    let __promise: Promise<PaginationResult<R>>

    function getPromise() {
      if (__promise) return __promise
      __promise = fn(options ?? ({} as Options))
      return __promise
    }

    async function* generator() {
      let hasMore = true
      let after: string | undefined = undefined

      while (hasMore) {
        const pages: PaginationResult<R> = await fn({ ...options, after } as Options)
        const { data, hasMore: hasMoreNext } = pages
        hasMore = hasMoreNext
        after = data.at(-1)?.id
        for (const item of data) {
          yield item
        }
      }
    }

    const result: Partial<IterablePaginationResult<R>> = new AsyncIterableExt<R>({
      [Symbol.asyncIterator]: generator,
    })

    result.then = (onfulfilled?, onrejected?) => getPromise().then(onfulfilled, onrejected)
    result.catch = onrejected => getPromise().catch(onrejected)
    result.finally = onfinally => getPromise().finally(onfinally)
    return result as IterablePaginationResult<R>
  }
}
