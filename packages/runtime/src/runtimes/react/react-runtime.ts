import { registerCoreComponents } from '../../components/builtin/register/core'
import { registerDefaultComponents } from '../../components/builtin/register/defaults'

import { BreakpointsInput } from '../../state/modules/breakpoints'
import { ReactRuntimeCore } from './react-runtime-core'

export class ReactRuntime extends ReactRuntimeCore {
  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    super({ breakpoints })
    registerCoreComponents(this)
    registerDefaultComponents(this)
  }
}
