import { ReactRuntimeCore } from '../runtimes/react/react-runtime-core'
import { registerBuiltinComponents } from '../components/builtin/register'
import { getPropControllerDescriptors } from '../state/read-only-state'
import type { DescriptorsByComponentType } from '../state/modules/prop-controllers'

let cached: DescriptorsByComponentType | null = null

export function getBuiltInPropControllerDescriptors(): DescriptorsByComponentType {
  if (cached != null) return cached

  const runtime = new ReactRuntimeCore({
    fetch: async () => new Response('{}', { status: 200 }),
  })
  registerBuiltinComponents(runtime)
  cached = getPropControllerDescriptors(runtime.store.getState())
  return cached
}
