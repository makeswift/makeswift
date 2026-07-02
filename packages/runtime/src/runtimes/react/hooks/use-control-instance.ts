import { ControlInstance, type ControlInstanceKey } from '@makeswift/controls'

import { useControlInstances } from './use-control-instances'

export function useControlInstance({
  instanceKey: { propName },
}: {
  instanceKey: ControlInstanceKey
}): ControlInstance | null {
  // FIXME: pass element key for debugging/diagnostics?
  const instances = useControlInstances()
  // FIXME: handle composite instance names
  return instances?.[propName] ?? null
}
