type Dependency = {
  subscribe(onUpdate: () => void): () => void
}

export const StableValue = <T>({
  read,
  deps,
}: {
  read: () => T
  deps?: Dependency[]
}) => {
  let stableValue: T | undefined

  return {
    read: () => stableValue ?? (stableValue = read()),
    subscribe: (onUpdate?: () => void) => {
      const unsubscribes = (deps ?? []).map((d) =>
        d.subscribe(() => {
          stableValue = undefined
          onUpdate?.()
        }),
      )

      return () => unsubscribes.forEach((u) => u())
    },
  }
}
