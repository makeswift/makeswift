'use client'

import { ReactNode, useEffect } from 'react'

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

  useBuilderConnectionPing({ appOrigin: runtime.appOrigin.toString() })

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
