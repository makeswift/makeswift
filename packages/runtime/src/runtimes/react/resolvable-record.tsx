import { type Resolvable } from '@makeswift/controls'

export function resolvableRecord(
  resolvables: Record<string, Resolvable<unknown>>,
): Resolvable<Record<string, unknown>> {
  let resolvedValues: Record<string, unknown> = {}

  return {
    name: 'resolvable-record',
    subscribe: (onUpdate: () => void): (() => void) => {
      const unsubscribes = Object.values(resolvables).map(s => s.subscribe(onUpdate))
      return () => {
        unsubscribes.forEach(u => u())
      }
    },

    readStable: () => {
      const { isDirty, resolved } = Object.entries(resolvables).reduce(
        ({ isDirty, resolved }, [propName, subscription]) => {
          const lastPropValue = resolvedValues[propName]
          const propValue = subscription.readStable()
          return {
            isDirty: isDirty || propValue !== lastPropValue,
            resolved: {
              ...resolved,
              [propName]: propValue,
            },
          }
        },
        { isDirty: false, resolved: {} },
      )

      if (isDirty) {
        resolvedValues = resolved
      }

      return resolvedValues
    },

    triggerResolve: async () => {
      return await Promise.all(
        Object.entries(resolvables).map(([propName, sub]) =>
          sub.triggerResolve(resolvedValues[propName]),
        ),
      )
    },
  }
}
