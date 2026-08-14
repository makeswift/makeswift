import { type BreakpointsInput } from '../../../state/modules/breakpoints'
import { TestOrigins } from '../../../testing/fixtures'
import { ReactRuntime } from '../react-runtime'

type RuntimeEnv = 'client' | 'ssr' | 'rsc'

class TestReactRuntime extends ReactRuntime {
  readonly env: RuntimeEnv

  constructor({
    env,
    ...args
  }: ConstructorParameters<typeof ReactRuntime>[0] & { env?: RuntimeEnv }) {
    super(args)
    this.env = env ?? 'client'
  }

  protected isRSCEnv() {
    return this.env === 'rsc'
  }
}

export function createReactRuntime({
  breakpoints,
  env,
}: { breakpoints?: BreakpointsInput; env?: RuntimeEnv } = {}) {
  return new TestReactRuntime({
    // Mock Service Worker patches global `fetch` for interception; make sure our test calls go
    // through the patched version instead of an eagerly captured reference to the original
    fetch: (...args) => globalThis.fetch(...args),
    breakpoints,
    env,
    ...TestOrigins,
  })
}
