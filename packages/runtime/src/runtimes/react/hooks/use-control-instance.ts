import { ControlInstance, type ControlInstanceKey } from '@makeswift/controls'

import { useControlInstances } from './use-control-instances'

export function useControlInstance({
  instanceKey: { elementKey, propName },
}: {
  instanceKey: ControlInstanceKey
}): ControlInstance | null {
  const instances = useControlInstances(elementKey)
  // FIXME: handle composite instance names
  return instances?.[propName] ?? null
}
