import { type DependencyList, useEffect } from 'react'

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
        console.error('Async effect error:', { error, deps })
      }
    }

    runAsyncEffect()

    return () => {
      cancelled = true
      try {
        cleanup?.()
      } catch (error) {
        console.error('Async effect cleanup error:', { error, deps })
      }
    }
  }, deps)
}
