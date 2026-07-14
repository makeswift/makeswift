import {
  deserializeFunction,
  serializeFunction,
} from './function-serialization'
import {
  unstable_getControlContext,
  unstable_runWithControlContext,
} from './control-context'

describe('control-context seam', () => {
  test('getOptions reads the context sent with the call', async () => {
    let seen: Record<string, unknown> | undefined
    const serialized = serializeFunction((query: string) => {
      seen = unstable_getControlContext()
      return `ok:${query}`
    })
    const getOptions = deserializeFunction(serialized)

    const result = await unstable_runWithControlContext(
      { productId: { value: { id: 'p1' } } },
      () => getOptions('shoes'),
    )

    expect(result).toBe('ok:shoes')
    expect(seen).toEqual({ productId: { value: { id: 'p1' } } })
    serialized.close()
  })

  test('no-context call yields empty context (backward-compatible [callId, args])', async () => {
    let seen: Record<string, unknown> | undefined
    const serialized = serializeFunction(() => {
      seen = unstable_getControlContext()
      return 42
    })
    const fn = deserializeFunction(serialized)

    const result = await fn()

    expect(result).toBe(42)
    expect(seen).toEqual({})
    serialized.close()
  })

  test('ambient context is cleared outside a call', () => {
    expect(unstable_getControlContext()).toEqual({})
  })

  test('outgoing context does not leak across sequential calls', async () => {
    const seen: Array<Record<string, unknown>> = []
    const serialized = serializeFunction(() => {
      seen.push(unstable_getControlContext())
      return null
    })
    const fn = deserializeFunction(serialized)

    await unstable_runWithControlContext({ a: 1 }, () => fn())
    await fn()

    expect(seen[0]).toEqual({ a: 1 })
    expect(seen[1]).toEqual({})
    serialized.close()
  })
})
