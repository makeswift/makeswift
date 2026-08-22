import { TestOrigins } from '../../../testing/fixtures'
import { ReactRuntime } from '../react-runtime'

type RuntimeEnv = 'client' | 'ssr' | 'rsc'
type RuntimeArgs = ConstructorParameters<typeof ReactRuntime>[0]

class TestReactRuntime extends ReactRuntime {
  readonly env: RuntimeEnv

  constructor({ env, ...args }: RuntimeArgs & { env?: RuntimeEnv }) {
    super(args)
    this.env = env ?? 'client'
  }

  protected isRSCEnv() {
    return this.env === 'rsc'
  }
}

export function createReactRuntime({
  breakpoints,
  requestKey,
  env,
}: {
  breakpoints?: RuntimeArgs['breakpoints']
  requestKey?: RuntimeArgs['requestKey']
  env?: RuntimeEnv
} = {}) {
  return new TestReactRuntime({
    // Mock Service Worker patches global `fetch` for interception; make sure our test calls go
    // through the patched version instead of an eagerly captured reference to the original
    fetch: (...args) => globalThis.fetch(...args),
    breakpoints,
    requestKey,
    env,
    ...TestOrigins,
  })
}
