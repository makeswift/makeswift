import { ReactRuntimeCore } from '@makeswift/runtime/react/core'

type Args = ConstructorParameters<typeof ReactRuntimeCore>[0]

/**
 * Note that this runtime class does not automatically register Makeswift's
 * built-in components.
 */
export class ReactRuntime extends ReactRuntimeCore {
  constructor({ fetch, ...args }: Omit<Args, 'fetch'> & { fetch?: Args['fetch'] } = {}) {
    super({
      ...args,
      fetch: fetch ?? ((url, init) => globalThis.fetch(url, init)),
    })
  }
}

export class RSCReactRuntime extends ReactRuntime {
  protected override isRSCEnv() {
    return true
  }
}
