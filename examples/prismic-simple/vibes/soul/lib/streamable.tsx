import { Suspense, use } from 'react'

import { v4 as uuid } from 'uuid'

export type Streamable<T> = T | Promise<T>

const stableKeys = (function () {
  const cache = new WeakMap<object, string>()

  function getObjectKey(obj: object): string {
    const key = cache.get(obj)

    if (key !== undefined) {
      return key
    }

    const keyValue = uuid()

    cache.set(obj, keyValue)

    return keyValue
  }

  return {
    get: (streamable: unknown): string =>
      streamable != null && typeof streamable === 'object'
        ? getObjectKey(streamable)
        : JSON.stringify(streamable),
  }
})()

function getCompositeKey(streamables: readonly unknown[]): string {
  return streamables.map(stableKeys.get).join('.')
}

function weakRefCache<K, T extends object>() {
  const cache = new Map<K, WeakRef<T>>()

  const registry = new FinalizationRegistry((key: K) => {
    const valueRef = cache.get(key)

    if (valueRef && !valueRef.deref()) cache.delete(key)
  })

  return {
    get: (key: K) => cache.get(key)?.deref(),
    set: (key: K, value: T) => {
      cache.set(key, new WeakRef(value))
      registry.register(value, key)
    },
  }
}

const promiseCache = weakRefCache<string, Promise<unknown>>()

function isPromise<T>(value: Streamable<T>): value is Promise<T> {
  return value instanceof Promise
}

/**
 * A suspense-friendly upgrade to `Promise.all`, guarantees stability of
 * the returned promise instance if passed an identical set of inputs.
 */
function all<T extends readonly unknown[] | []>(
  streamables: T
): Streamable<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
  // Avoid creating an unnecessary promise with the `Promise.all` call below
  // if none of the streamables is a promise
  if (!streamables.some(isPromise)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return streamables as { -readonly [P in keyof T]: Awaited<T[P]> }
  }

  const cacheKey = getCompositeKey(streamables)

  const cached = promiseCache.get(cacheKey)

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  if (cached != null) return cached as { -readonly [P in keyof T]: Awaited<T[P]> }

  const result = Promise.all(streamables)

  promiseCache.set(cacheKey, result)

  return result
}

export const Streamable = {
  all,
}

export function useStreamable<T>(streamable: Streamable<T>): T {
  return isPromise(streamable) ? use(streamable) : streamable
}

function UseStreamable<T>({
  value,
  children,
}: {
  value: Streamable<T>
  children: (value: T) => React.ReactNode
}) {
  return children(useStreamable(value))
}

export function Stream<T>({
  value,
  fallback,
  children,
}: {
  value: Streamable<T>
  fallback?: React.ReactNode
  children: (value: T) => React.ReactNode
}) {
  return (
    <Suspense fallback={fallback}>
      <UseStreamable value={value}>{children}</UseStreamable>
    </Suspense>
  )
}
