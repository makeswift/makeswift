import {
  ControlInstance,
  type ControlDefinition,
  type ResourceResolver,
  type ValueSubscription,
} from '@makeswift/controls'

import { isLegacyDescriptor, type Descriptor } from '../../prop-controllers/descriptors'
import * as ReactPage from '../../state/react-page'
import { type EffectorFactory } from './use-effector'

export function createPropsValuesSubscription(
  propDefinitions: Record<string, Descriptor>,
  controls: Record<string, ControlInstance> | null,
  elementData: Record<string, ReactPage.ElementData>,
  resourceResolver: ResourceResolver,
  effectorFactory: EffectorFactory,
): ValueSubscription<Record<string, unknown>> {
  const propsSubscriptions = createPropsSubscriptions(propDefinitions, (def, propName) =>
    def.resolveValue(
      elementData[propName],
      resourceResolver,
      effectorFactory.get(propName),
      controls?.[propName],
    ),
  )

  let lastSnapshot: Record<string, unknown> = {}

  return {
    subscribe: (onUpdate: () => void): (() => void) => {
      const unsubscribes = Object.values(propsSubscriptions).map(s => s.subscribe(onUpdate))
      return () => {
        unsubscribes.forEach(u => u())
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

function createPropsSubscriptions(
  propDefinitions: Record<string, Descriptor>,
  createSubscription: (def: ControlDefinition, propName: string) => ValueSubscription<any>,
): Record<string, ValueSubscription<any>> {
  return Object.entries(propDefinitions).reduce(
    (result, [propName, def]) =>
      isLegacyDescriptor(def)
        ? result
        : {
            ...result,
            [propName]: createSubscription(def, propName),
          },
    {},
  )
}
