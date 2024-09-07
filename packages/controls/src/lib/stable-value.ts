import { type ValueSubscription } from './value-subscription'

type Dependency = {
  name: string
  subscribe(onUpdate: () => void): () => void
}

export const StableValue = <T>({
  name,
  read,
  deps,
}: {
  name: string
  read: () => T
  deps?: Dependency[]
}): ValueSubscription<T> & { reset: () => void } => {
  let stableValue: T | undefined
  let valueUpdated: (() => void) | undefined

  const reset = () => {
    stableValue = undefined
    valueUpdated?.()
  }

  return {
    name,
    readStable: () => stableValue ?? (stableValue = read()),

    subscribe: (onUpdate: () => void) => {
      valueUpdated = onUpdate

      const unsubscribes = (deps ?? []).map((d) => d.subscribe(() => reset()))
      return () => unsubscribes.forEach((u) => u())
    },

    reset,
  }
}
