import { registerBuiltinComponents } from '../../components/builtin/register'
import { ReactRuntimeCore } from './react-runtime-core'

export class ReactRuntime extends ReactRuntimeCore {
  constructor(...args: ConstructorParameters<typeof ReactRuntimeCore>) {
    super(...args)
    registerBuiltinComponents(this)
  }
}
