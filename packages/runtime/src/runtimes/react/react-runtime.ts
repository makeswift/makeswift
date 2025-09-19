import { registerDefaultComponents } from '../../components/builtin/register/defaults'
import { BreakpointsInput } from '../../state/modules/breakpoints'
import { BasicReactRuntime } from './basic-react-runtime'

export class ReactRuntime extends BasicReactRuntime {
  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    super({ breakpoints })
    registerDefaultComponents(this)
  }
}
