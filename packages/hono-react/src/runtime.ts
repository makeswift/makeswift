import { ReactRuntimeCore } from '@makeswift/runtime/react/core'

type Args = Omit<ConstructorParameters<typeof ReactRuntimeCore>[0], 'fetch'>

/**
 * Note that this runtime class does not automatically register Makeswift's
 * built-in components.
 */
export class ReactRuntime extends ReactRuntimeCore {
  constructor(args: Args = {}) {
    super({
      ...args,
      fetch: (url, init) => fetch(url, init), // TODO: revalidation support?
    })
  }
}
