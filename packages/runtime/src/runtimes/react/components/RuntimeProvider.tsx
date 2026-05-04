'use client'

import { ReactNode, useEffect, useMemo } from 'react'

import { type SiteVersion } from '../../../api/site-version'

import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { useAsyncEffect } from '../hooks/use-async-effect'
import { StoreContext } from '../hooks/use-store'
import { type ReactRuntimeCore } from '../react-runtime-core'

import { PreviewSwitcher } from './preview-switcher/preview-switcher'
import { useFrameworkContext } from './hooks/use-framework-context'

export function RuntimeProvider({
  children,
  runtime,
  siteVersion: siteVersionProp,
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntimeCore
  siteVersion: SiteVersion | null | undefined
  locale?: string
}) {
  const siteVersion = siteVersionProp ?? null
  const isPreview = siteVersion != null
  const { previewStoreMiddlewares } = useFrameworkContext()
  const middlewares = useMemo(
    () => (siteVersion != null ? (previewStoreMiddlewares ?? []) : []),
    [previewStoreMiddlewares, siteVersion],
  )

  // see `getOrCreateStore` for the description of the stores' lifecycle
  const store = useMemo(
    () => runtime.getOrCreateStore({ siteVersion, locale }, { middlewares }),
    [runtime, siteVersion, locale, middlewares],
  )

  useEffect(() => {
    runtime.retainStore({ siteVersion, locale }, store)
    return () => runtime.releaseStore({ siteVersion, locale }, store)
  }, [runtime, siteVersion, locale, store])

  // if we're in the read-write mode, the reducers & middleware required for builder
  // interactions are loaded only on client side, lazily and asynchronously
  useAsyncEffect(() => store.loadReadWriteStateIfNeeded(), [store])

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      <StoreContext.Provider value={store}>
        {children}
        <PreviewSwitcher isPreview={isPreview} />
      </StoreContext.Provider>
    </ReactRuntimeContext.Provider>
  )
}
