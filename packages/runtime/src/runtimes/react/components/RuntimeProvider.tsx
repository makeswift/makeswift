'use client'

import { ReactNode, useEffect, useMemo } from 'react'

import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { type ReactRuntimeCore } from '../react-runtime-core'
import { type SiteVersion } from '../../../api/site-version'
import { PreviewSwitcher } from './preview-switcher/preview-switcher'
import { useBuilderConnectionPing } from './hooks/use-builder-connection-ping'

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
  // TODO: we need to decouple editability from the site version; specifically, previewing
  // a draft version of the site should not lead to switching to the read-write state
  const isReadOnly = siteVersion == null

  // setting idempotent part of the state on render, `useMemo` here is purely a performance
  // optimization; prior art for performing idempotent side-effects on render:
  // https://github.com/TanStack/query/blob/8f9f183f11df3709a1a38c4efce1452788041f88/packages/react-query/src/HydrationBoundary.tsx#L41
  useMemo(
    () => runtime.setIdempotent({ siteVersion, isReadOnly, locale }),
    [runtime, siteVersion, isPreview, locale],
  )

  useBuilderConnectionPing({ appOrigin: runtime.appOrigin })

  useSetupRuntimeStore({ runtime, isReadOnly })

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      {children}
      <PreviewSwitcher isPreview={isPreview} />
    </ReactRuntimeContext.Provider>
  )
}

function useSetupRuntimeStore({
  runtime,
  isReadOnly,
}: {
  runtime: ReactRuntimeCore
  isReadOnly: boolean
}) {
  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | null = null

    const setupStore = async () => {
      try {
        cleanup = await runtime.setupStore({ isReadOnly })

        if (cancelled) {
          cleanup()
          cleanup = null
        }
      } catch (error) {
        console.error('Failed to setup runtime store:', { error, isReadOnly })
      }
    }

    setupStore()

    return () => {
      cancelled = true
      if (cleanup) {
        cleanup()
      }
    }
  }, [runtime, isReadOnly])
}
