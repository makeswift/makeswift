import { useMemo, useEffect, useSyncExternalStore } from 'react'
import { Resolvable, ResourceResolver } from '@makeswift/controls'

import { useResourceResolver } from './use-resource-resolver'
import { propErrorHandlingProxy } from '../utils/prop-error-handling-proxy'

export function useResolvedValue<D, T>(
  data: D,
  resolver: (data: D, resourceResolver: ResourceResolver) => Resolvable<T>,
  defaultValue?: T,
): T | undefined {
  const resourceResolver = useResourceResolver()
  const resolvable = useMemo(() => {
    return propErrorHandlingProxy(resolver(data, resourceResolver), defaultValue, error => {
      console.warn(`Error resolving data, falling back to \`${defaultValue}\`.`, { error, data })
    })
  }, [data, resourceResolver, defaultValue])

  useEffect(() => {
    resolvable.triggerResolve()
  }, [resolvable])

  return useSyncExternalStore(resolvable.subscribe, resolvable.readStable, resolvable.readStable)
}
