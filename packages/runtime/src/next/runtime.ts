import { ReactRuntime } from '../runtimes/react/react-runtime'
import { type BreakpointsInput } from '../state/modules/breakpoints'

import { fetch } from './fetch'

export class NextReactRuntime extends ReactRuntime {
  constructor(
    args: { appOrigin?: string; apiOrigin?: string; breakpoints?: BreakpointsInput } = {},
  ) {
    super({ ...args, fetch })
  }
}
