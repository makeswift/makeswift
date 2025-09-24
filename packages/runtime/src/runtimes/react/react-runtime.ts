import { registerBuiltinComponents } from '../../components/builtin/register'
import { BreakpointsInput } from '../../state/modules/breakpoints'
import { ReactRuntimeCore } from './react-runtime-core'

export class ReactRuntime extends ReactRuntimeCore {
  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    super({ breakpoints })
    registerBuiltinComponents(this)
  }
}
