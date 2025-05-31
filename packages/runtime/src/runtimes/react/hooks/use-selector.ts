import { useSyncExternalStore, useRef, useEffect, useMemo, useDebugValue } from 'react'
import { useStore } from './use-store'
import { State as ReactPageState } from '../../../state/react-page'
import { State as ReactBuilderPreviewState } from '../../../state/react-builder-preview'

type State = ReactPageState | ReactBuilderPreviewState

export function useSelector<R>(selector: (state: State) => R): R {
  const store = useStore()

  return useSyncExternalStoreWithSelector(store.subscribe, store.getState, store.getState, selector)
}

// DECOUPLE_TODO: Ported this code to TypeScript using AI from https://github.com/facebook/react/blob/65b5aae010002ef88221cc4998711eaef6068006/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js#L19
// Please double-check it

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Same as React’s `useSyncExternalStore`, but with `selector` and optional
 * `isEqual` arguments so that callers can “pick” part of the snapshot and
 * avoid re-renders when the selected slice is unchanged.
 */
function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: (() => Snapshot) | null | undefined,
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
  /** Tracks the most recently rendered selection so we can try to reuse it. */
  type Inst = { hasValue: true; value: Selection } | { hasValue: false; value: null }

  const instRef = useRef<Inst | null>(null)
  const inst: Inst =
    instRef.current ??
    (() => {
      const initial: Inst = { hasValue: false, value: null }
      instRef.current = initial
      return initial
    })()

  /** Memoize selector results to avoid unnecessary work/renders. */
  const [getSelection, getServerSelection] = useMemo(() => {
    let hasMemo = false
    let memoizedSnapshot: Snapshot | undefined
    let memoizedSelection: Selection | undefined

    const memoizedSelector = (nextSnapshot: Snapshot): Selection => {
      if (!hasMemo) {
        // First run.
        hasMemo = true
        memoizedSnapshot = nextSnapshot
        const nextSelection = selector(nextSnapshot)

        if (isEqual && inst.hasValue && isEqual(inst.value as Selection, nextSelection)) {
          memoizedSelection = inst.value as Selection
          return memoizedSelection
        }

        memoizedSelection = nextSelection
        return nextSelection
      }

      // Compare new snapshot to previous.
      const prevSnapshot = memoizedSnapshot as Snapshot
      const prevSelection = memoizedSelection as Selection

      if (Object.is(prevSnapshot, nextSnapshot)) {
        // Snapshot unchanged → reuse previous selection.
        return prevSelection
      }

      const nextSelection = selector(nextSnapshot)

      if (isEqual && isEqual(prevSelection, nextSelection)) {
        // Snapshot changed but selected value is “equal” → keep old selection.
        memoizedSnapshot = nextSnapshot
        return prevSelection
      }

      memoizedSnapshot = nextSnapshot
      memoizedSelection = nextSelection
      return nextSelection
    }

    const maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot

    return [
      () => memoizedSelector(getSnapshot()),
      maybeGetServerSnapshot === null
        ? undefined
        : () => memoizedSelector(maybeGetServerSnapshot()),
    ] as const
  }, [getSnapshot, getServerSnapshot, selector, isEqual])

  /** React 18 external-store primitive. */
  const value = useSyncExternalStore(subscribe, getSelection, getServerSelection)

  /** Keep the ref in sync so memoizedSelector can compare against it. */
  useEffect(() => {
    inst.hasValue = true
    inst.value = value as Selection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useDebugValue(value)
  return value
}
