import { useMemo, useRef, useSyncExternalStore } from 'react'

/**
 * Overload with optional server snapshot getter for SSR.
 */
export function useSyncExternalStoreWithSelector<TSnapshot, TSelection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => TSnapshot,
  getServerSnapshot: (() => TSnapshot) | undefined,
  selector: (snapshot: TSnapshot) => TSelection,
  isEqual?: (a: TSelection, b: TSelection) => boolean,
): TSelection

export function useSyncExternalStoreWithSelector<TSnapshot, TSelection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => TSnapshot,
  getServerSnapshotOrSelector:
    | ((() => TSnapshot) | undefined)
    | ((snapshot: TSnapshot) => TSelection),
  maybeSelector?: (snapshot: TSnapshot) => TSelection,
  maybeIsEqual?: (a: TSelection, b: TSelection) => boolean,
): TSelection {
  // Argument normalization to support both overloads
  const hasServerSnapshot = typeof getServerSnapshotOrSelector === 'function' && maybeSelector

  const getServerSnapshot = (
    hasServerSnapshot ? (getServerSnapshotOrSelector as (() => TSnapshot) | undefined) : undefined
  ) as (() => TSnapshot) | undefined

  const selector = (
    hasServerSnapshot
      ? (maybeSelector as (snapshot: TSnapshot) => TSelection)
      : (getServerSnapshotOrSelector as (snapshot: TSnapshot) => TSelection)
  ) as (snapshot: TSnapshot) => TSelection

  const isEqual =
    (hasServerSnapshot ? maybeIsEqual : undefined) ??
    (Object.is as (a: TSelection, b: TSelection) => boolean)

  // Refs to hold the last computed snapshot & selection used by the memoized getters
  const lastSnapshotRef = useRef<TSnapshot | null>(null)
  const lastSelectionRef = useRef<TSelection | null>(null)

  // Memoized getter that returns the selected value, preserving reference equality
  // when the snapshot is referentially equal and the selection is equal by isEqual.
  const getSelectedSnapshot = useMemo(() => {
    return () => {
      const nextSnapshot = getSnapshot()
      const prevSnapshot = lastSnapshotRef.current
      const prevSelection = lastSelectionRef.current

      // Fast path: same snapshot reference & selection equal -> reuse previous selection
      if (
        prevSnapshot === nextSnapshot &&
        prevSelection !== null &&
        isEqual(prevSelection, selector(nextSnapshot))
      ) {
        return prevSelection as TSelection
      }

      // Compute fresh selection and cache
      const nextSelection = selector(nextSnapshot)
      lastSnapshotRef.current = nextSnapshot
      lastSelectionRef.current = nextSelection
      return nextSelection
    }
    // Recreate when any dependency changes to avoid stale selector/equality
  }, [getSnapshot, selector, isEqual])

  // SSR getter mirrors the client getter, if provided
  const getSelectedServerSnapshot = useMemo(() => {
    if (!getServerSnapshot) return undefined
    return () => selector(getServerSnapshot())
  }, [getServerSnapshot, selector])

  // Memoized subscribe that only notifies when the *selected* value changes
  const subscribeWithSelector = useMemo(() => {
    // Local copies that we keep in closure for change detection
    let currentSnapshot: TSnapshot | null = null
    let currentSelection: TSelection | null = null

    const ensureCurrent = () => {
      const snap = getSnapshot()
      const sel = selector(snap)
      currentSnapshot = snap
      currentSelection = sel
    }

    // Initialize lazily; we'll compute on first subscribe call
    return (notify: () => void) => {
      // Make sure our closure has an initial baseline
      if (currentSnapshot === null) ensureCurrent()

      return subscribe(() => {
        const nextSnapshot = getSnapshot()
        // If the snapshot reference hasn't changed, we can still be conservative
        // and avoid computing selector if we know nothing changed. However, some
        // stores may return a new object every time; so we always compute selection.
        const nextSelection = selector(nextSnapshot)

        const changed =
          currentSelection === null || !isEqual(currentSelection as TSelection, nextSelection)

        // Update baselines even if we decide not to notify
        currentSnapshot = nextSnapshot
        currentSelection = nextSelection

        if (changed) {
          notify()
        }
      })
    }
  }, [subscribe, getSnapshot, selector, isEqual])

  return useSyncExternalStore(subscribeWithSelector, getSelectedSnapshot, getSelectedServerSnapshot)
}
