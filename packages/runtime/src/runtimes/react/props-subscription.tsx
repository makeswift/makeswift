import {
  ControlInstance,
  type ResourceResolver,
  type ValueSubscription,
  type Effector,
} from '@makeswift/controls'

import { isLegacyDescriptor, type Descriptor } from '../../prop-controllers/descriptors'
import * as ReactPage from '../../state/react-page'

export function createPropsValuesSubscription(
  propDefinitions: Record<string, Descriptor>,
  controls: Record<string, ControlInstance> | null,
  elementData: Record<string, ReactPage.ElementData>,
  resourceResolver: ResourceResolver,
  effector: Effector,
): ValueSubscription<Record<string, unknown>> {
  const propsSubscriptions: Record<string, ValueSubscription<any>> = Object.entries(
    propDefinitions,
  ).reduce((result, [propName, def]) => {
    if (isLegacyDescriptor(def)) {
      return result
    }

    return {
      ...result,
      [propName]: def.resolveValue(
        elementData[propName],
        resourceResolver,
        effector,
        controls?.[propName],
      ),
    }
  }, {})

  let lastSnapshot: Record<string, unknown> = {}

  return {
    subscribe: (onUpdate: () => void): (() => void) => {
      const unsubscribe = Object.values(propsSubscriptions).map(subscription =>
        subscription.subscribe(onUpdate),
      )
      return () => {
        unsubscribe.forEach(fn => fn())
      }
    },
    readStableValue: () => {
      const { isDirty, snapshot } = Object.entries(propsSubscriptions).reduce(
        ({ isDirty, snapshot }, [propName, subscription]) => {
          const lastPropValue = lastSnapshot[propName]
          const propValue = subscription.readStableValue(lastPropValue)
          return {
            isDirty: isDirty || propValue !== lastPropValue,
            snapshot: {
              ...snapshot,
              [propName]: propValue,
            },
          }
        },
        { isDirty: false, snapshot: {} },
      )

      if (isDirty) {
        lastSnapshot = snapshot
      }

      return lastSnapshot
    },
  }
}
