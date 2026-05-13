'use client'

import { ReactNode, useEffect, useMemo } from 'react'

import { type SiteVersion } from '../../../api/site-version'

// Eagerly evaluate the client-log relay so it installs its console /
// window.error / unhandledrejection wrappers at module-load time. Captures
// early-render logs (RSC console replay, hydration warnings) that would
// otherwise miss the `setupClientLogCapture` call inside the read-write
// middleware setup. The wrapper is a no-op outside an iframe and buffers
// entries until `setupClientLogCapture` supplies an `appOrigin`.
//
// Imported via a named binding (not bare side-effect) so bundlers that
// honor `sideEffects: false` still preserve the module evaluation.
import { CLIENT_LOG_MESSAGE_TYPE as _CLIENT_LOG_MESSAGE_TYPE } from '../../../state/builder-api/client-log-relay'
void _CLIENT_LOG_MESSAGE_TYPE

import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { useAsyncEffect } from '../hooks/use-async-effect'
import { StoreContext } from '../hooks/use-store'
import { type ReactRuntimeCore } from '../react-runtime-core'

import { PreviewSwitcher } from './preview-switcher/preview-switcher'

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

  // see `getOrCreateStore` for the description of the stores' lifecycle
  const store = useMemo(
    () => runtime.getOrCreateStore({ siteVersion, locale }),
    [runtime, siteVersion, locale],
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
