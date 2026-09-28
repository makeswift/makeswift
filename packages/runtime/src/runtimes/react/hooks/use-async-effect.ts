import { type DependencyList, useEffect } from 'react'

import { errorMessage } from '../../../utils/error-message'

export function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps: DependencyList) {
  useEffect(() => {
    let cancelled = false
    let cleanup: void | (() => void) | null = null

    const runAsyncEffect = async () => {
      try {
        cleanup = await effect()

        if (cancelled) {
          cleanup?.()
          cleanup = null
        }
      } catch (error) {
        console.error(`Async effect error: ${errorMessage(error)}`, { error, deps })
      }
    }

    void runAsyncEffect()

    return () => {
      cancelled = true
      try {
        cleanup?.()
      } catch (error) {
        console.error(`Async effect cleanup error: ${errorMessage(error)}`, { error, deps })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
