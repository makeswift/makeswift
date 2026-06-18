import { type BreakpointsInput } from '../../../state/modules/breakpoints'
import { TestOrigins } from '../../../testing/fixtures'
import { ReactRuntime } from '../react-runtime'

export function createReactRuntime({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
  return new ReactRuntime({
    // Mock Service Worker patches global `fetch` for interception; make sure our test calls go
    // through the patched version instead of an eagerly captured reference to the original
    fetch: (...args) => globalThis.fetch(...args),
    breakpoints,
    ...TestOrigins,
  })
}
