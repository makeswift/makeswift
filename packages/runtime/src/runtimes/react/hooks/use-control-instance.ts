import { ControlInstance, type ControlInstanceKey } from '@makeswift/controls'

import { useControlInstances } from './use-control-instances'

export function useControlInstance({
  instanceKey,
}: {
  instanceKey: ControlInstanceKey
}): ControlInstance | null {
  const instances = useControlInstances()

  const { elementKey, propPath } = instanceKey
  const result = getInstanceByPropPath(instances, propPath)

  if (result) {
    const foundKey = result.instanceKey
    if (foundKey.elementKey !== elementKey || foundKey.propPath != propPath) {
      console.error('Mismatching control instance key: expected', instanceKey, ' got', foundKey)
    }
  }

  return result
}

function getInstanceByPropPath(
  instances: Record<string, ControlInstance> | null,
  propPath: string,
): ControlInstance | null {
  const [parentProp, ...childPath] = propPath.split('.')
  const parentInstance = instances?.[parentProp]

  const getChild = (
    parent: ControlInstance | undefined,
    childPath: string[],
  ): ControlInstance | undefined =>
    childPath.length === 0 || parent == null
      ? parent
      : getChild(parent.child(childPath[0]), childPath.slice(1))

  return getChild(parentInstance, childPath) ?? null
}
