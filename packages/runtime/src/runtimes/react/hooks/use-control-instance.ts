import { useCallback, useSyncExternalStore } from 'react'
import { type AnyControlInstance, type ControlInstanceKey, isNotNil } from '@makeswift/controls'

import { useControlInstances } from './use-control-instances'

type InstanceConstructor<T extends AnyControlInstance> = abstract new (...args: never[]) => T

export function useControlInstance<T extends AnyControlInstance>(
  instanceKey: ControlInstanceKey | undefined,
  instanceClass: InstanceConstructor<T>,
): T | null {
  const { elementKey, propPath } = instanceKey ?? {}

  const instances = useControlInstances(elementKey)
  const getInstance = useCallback(
    () =>
      instances != null && propPath != null ? getInstanceByPropPath(instances, propPath) : null,
    [instances, propPath],
  )

  const subscribe = useCallback(
    (onStateChange: () => void) => {
      if (instances == null || propPath == null) return () => {}

      let unsubscribes: (() => void)[] = []

      // recompute the instance chain and resubscribe to its updates on every notification,
      // since a control's own update (e.g. a `ListControl` replacing its children) can replace
      // the instances further down the chain
      const handleStateChange = () => {
        resubscribe()
        onStateChange()
      }

      const resubscribe = () => {
        unsubscribes.forEach(unsubscribe => unsubscribe())

        const chain = getInstanceChainByPropPath(instances, propPath).filter(isNotNil)
        unsubscribes = chain.map(instance => instance.subscribe(handleStateChange))
      }

      resubscribe()

      return () => unsubscribes.forEach(unsubscribe => unsubscribe())
    },
    [instances, propPath],
  )

  const result = useSyncExternalStore(subscribe, getInstance, getInstance)

  if (result) {
    const foundKey = result.instanceKey
    if (foundKey.elementKey !== elementKey || foundKey.propPath != propPath) {
      console.error('Mismatching control instance key: expected', instanceKey, ' got', foundKey)
      return null
    }

    if (!(result instanceof instanceClass)) {
      console.error(
        `Unexpected control instance class: requested '${instanceClass.name}', found '${result.constructor.name}'`,
        { instanceKey },
      )

      return null
    }
  }

  return result
}

export function getInstanceChainByPropPath(
  instances: Record<string, AnyControlInstance>,
  propPath: string,
): (AnyControlInstance | null)[] {
  const [parentProp, ...childPath] = propPath.split('.')
  const parentInstance = instances[parentProp]

  const getInstanceChain = (
    parent: AnyControlInstance | undefined,
    childPath: string[],
  ): (AnyControlInstance | null)[] =>
    parent == null || childPath.length === 0
      ? [parent ?? null]
      : [parent, ...getInstanceChain(parent.child(childPath[0]), childPath.slice(1))]

  return getInstanceChain(parentInstance, childPath)
}

export function getInstanceByPropPath(
  instances: Record<string, AnyControlInstance>,
  propPath: string,
): AnyControlInstance | null {
  return getInstanceChainByPropPath(instances, propPath).at(-1) ?? null
}
