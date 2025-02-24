import { type Resolvable } from '@makeswift/controls'
import { useMemo, useRef } from 'react'

type Snapshot = {
  resolvedValues: Record<string, unknown>
  dirtyProps: Set<string>
}

export function useResolvableRecord(
  resolvables: Record<string, Resolvable<unknown>>,
): Resolvable<Record<string, unknown>> {
  const snapshot = useRef<Snapshot>({ resolvedValues: {}, dirtyProps: new Set() })

  return useMemo<Resolvable<Record<string, unknown>>>(() => {
    return {
      name: 'resolvable-record',
      subscribe: (onUpdate: () => void): (() => void) => {
        const unsubscribes = Object.values(resolvables).map(s => s.subscribe(onUpdate))
        return () => {
          unsubscribes.forEach(u => u())
        }
      },

      readStable: () => {
        const nextSnapshot = Object.entries(resolvables).reduce<Snapshot>(
          ({ dirtyProps, resolvedValues }, [propName, subscription]) => {
            const lastPropValue = snapshot.current.resolvedValues[propName]
            const propValue = subscription.readStable()
            const isDirty = propValue !== lastPropValue

            return {
              dirtyProps: isDirty ? dirtyProps.add(propName) : dirtyProps,
              resolvedValues: { ...resolvedValues, [propName]: propValue },
            }
          },
          { resolvedValues: {}, dirtyProps: new Set() },
        )

        if (nextSnapshot.dirtyProps.size > 0) {
          snapshot.current = nextSnapshot
        }

        return snapshot.current.resolvedValues
      },

      triggerResolve: async () => {
        // While we _could_ only trigger resolution on the dirty props, this is
        // not an airtight solution. Some controls will resolve to nullish
        // values even when the underlying data changes, so they won't be dirty
        // (ex: an Image control where the data changes from `undefined` to a
        // file that has not yet been fetched). Even if you add a nullish check
        // on the resolved value, some controls can resolve to non-nullish value
        // when the resolution does not occur (ex: swatches can resolve to
        // black). The true solution is to trigger resolve on underlying data
        // change, and moving these dirtiness optimizations for resolution
        // triggering at the control level.
        return await Promise.all(
          Object.entries(resolvables).map(([propName, sub]) =>
            sub.triggerResolve(snapshot.current.resolvedValues[propName]),
          ),
        )
      },
    }
  }, [resolvables])
}
