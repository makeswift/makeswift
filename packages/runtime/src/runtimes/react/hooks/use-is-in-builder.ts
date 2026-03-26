import { useStore } from './use-store'
import { getIsInBuilder } from '../../../state/read-only-state'
import { useSyncExternalStore } from 'react'

/**
 * When multiple React roots share a single store, `isInBuilder` can become
 * `true` before all roots have hydrated. React uses `getServerSnapshot` during
 * client hydration — not just on the server — so if it reads from the live
 * store, it may see `true` while the server HTML was rendered with `false`,
 * causing a hydration mismatch that React may fail to recover from inside
 * nested Suspense boundaries. This can manifest as cases where the correct
 * value of `isInBuilder` is read in the component, but the DOM remains stale.
 *
 * https://react.dev/reference/react/useSyncExternalStore#parameters
 *
 * TODO: For now, we're fixing this by returning a fixed `false` from
 * `getServerSnapshot` to match what the server actually rendered. After
 * hydration, the subscription picks up changes to this value which can only be
 * initiated client-side. We'll need to revisit this problem to reconsider how
 * we holistically handle store state changes across the server/client.
 */
function getServerSnapshot(): boolean {
  return false
}

export function useIsInBuilder(): boolean {
  const store = useStore()

  return useSyncExternalStore(
    store.subscribe,
    () => getIsInBuilder(store.getState()),
    getServerSnapshot,
  )
}
