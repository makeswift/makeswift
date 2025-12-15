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
  siteVersion,
  locale = undefined,
}: {
  children: ReactNode
  runtime: ReactRuntimeCore
  siteVersion: SiteVersion | null
  locale?: string
}) {
  const isPreview = siteVersion != null

  // setting site version on render, `useMemo` is purely a performance optimization;
  // prior art for performing idempotent side-effects on render:
  // https://github.com/TanStack/query/blob/8f9f183f11df3709a1a38c4efce1452788041f88/packages/react-query/src/HydrationBoundary.tsx#L41
  useMemo(() => runtime.setSiteVersion({ siteVersion }), [runtime, siteVersion])

  useBuilderConnectionPing({ appOrigin: runtime.appOrigin })

  useSetupRuntimeStore({ runtime, siteVersion, locale })

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      {children}
      <PreviewSwitcher isPreview={isPreview} />
    </ReactRuntimeContext.Provider>
  )
}

function useSetupRuntimeStore({
  runtime,
  siteVersion,
  locale,
}: {
  runtime: ReactRuntimeCore
  siteVersion: SiteVersion | null
  locale?: string
}) {
  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | null = null

    const setupStore = async () => {
      try {
        cleanup = await runtime.setupStore({ siteVersion, locale })

        if (cancelled) {
          cleanup()
          cleanup = null
        }
      } catch (error) {
        console.error('Failed to setup runtime store:', { error, siteVersion, locale })
      }
    }

    setupStore()

    return () => {
      cancelled = true
      if (cleanup) {
        cleanup()
      }
    }
  }, [runtime, siteVersion, locale])
}
