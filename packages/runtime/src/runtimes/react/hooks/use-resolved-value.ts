import { useMemo, useEffect, useSyncExternalStore } from 'react'
import { Resolvable, ResourceResolver } from '@makeswift/controls'

import { useResourceResolver } from './use-resource-resolver'

export function useResolvedValue<D, T>(
  data: D,
  resolver: (data: D, resourceResolver: ResourceResolver) => Resolvable<T>,
): T {
  const resourceResolver = useResourceResolver()
  const resolvable = useMemo(() => resolver(data, resourceResolver), [data, resourceResolver])

  useEffect(() => {
    resolvable.triggerResolve()
  }, [])

  return useSyncExternalStore(resolvable.subscribe, resolvable.readStable, resolvable.readStable)
}
