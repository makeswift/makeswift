import { registerCoreComponents } from '../../components/builtin/register/core'
import { BreakpointsInput } from '../../state/modules/breakpoints'
import { ReactRuntimeCore } from './react-runtime-core'

export class BasicReactRuntime extends ReactRuntimeCore {
  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    super({ breakpoints })
    registerCoreComponents(this)
  }
}
