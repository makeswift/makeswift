import { type Breakpoints, ReactRuntime } from '@makeswift/runtime/unstable-framework-support'

export class HonoReactRuntime extends ReactRuntime {
  constructor(args: { appOrigin?: string; apiOrigin?: string; breakpoints?: Breakpoints } = {}) {
    super({
      ...args,
      fetch: (url, init) => fetch(url, init), // TODO: revalidation support
    })
  }
}
