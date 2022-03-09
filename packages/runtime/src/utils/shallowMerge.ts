import keys from './keys'
import coalesce from './coalesce'

export default function shallowMerge<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>,
>(a: A, b: B): A & B {
  const bKeys = keys(b)
  const merged = { ...a } as A & B

  bKeys.forEach(key => {
    // @ts-expect-error: `coalesce` returns `null | undefined` regardless of input guarantees.
    merged[key] = coalesce(merged[key], b[key])
  })

  return merged
}
