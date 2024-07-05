import { ResourceResolver, ValueSubscription, controlTraitsRegistry } from '@makeswift/controls'
import * as ReactPage from '../../state/react-page'

export function createPropsValuesSubscription(
  propDefinitions: Record<string, { type: string }>,
  elementData: Record<string, ReactPage.ElementData>,
  resourceResolver: ResourceResolver,
): ValueSubscription<Record<string, unknown>> {
  const propsSubscriptions: Record<string, ValueSubscription<any>> = Object.entries(
    propDefinitions,
  ).reduce((result, [propName, def]) => {
    const traits = controlTraitsRegistry.get(def.type)
    return traits == null
      ? result
      : {
          ...result,
          [propName]: traits.subscribeValue(elementData[propName], def as any, resourceResolver),
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
    readValue: () => {
      const { isDirty, value } = Object.entries(propsSubscriptions).reduce(
        ({ isDirty, value }, [propName, subscription]) => {
          const propValue = subscription.readValue()
          return {
            isDirty: isDirty || propValue !== lastSnapshot[propName],
            value: {
              ...value,
              [propName]: propValue,
            },
          }
        },
        { isDirty: false, value: {} },
      )

      if (isDirty) {
        lastSnapshot = value
      }

      return lastSnapshot
    },
  }
}
