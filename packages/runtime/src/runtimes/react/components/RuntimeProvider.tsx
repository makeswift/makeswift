'use client'

import { ReactNode, useMemo } from 'react'

import { type SiteVersion } from '../../../api/site-version'

import { ReactRuntimeContext } from '../hooks/use-react-runtime'
import { useAsyncEffect } from '../hooks/use-async-effect'
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
  // TODO: we need to decouple editability from the site version; specifically, previewing
  // a draft version of the site should not lead to switching to the read-write state
  const isReadOnly = siteVersion == null

  // setting idempotent part of the state on render to have parity between server-side and
  // client-side rendering depending on this state; `useMemo` here is purely a performance
  // optimization; prior art for performing idempotent side effects on render:
  // https://github.com/TanStack/query/blob/8f9f183f11df3709a1a38c4efce1452788041f88/packages/react-query/src/HydrationBoundary.tsx#L41
  useMemo(
    () => runtime.setIdempotent({ siteVersion, isReadOnly, locale }),
    [runtime, siteVersion, isReadOnly, locale],
  )

  useAsyncEffect(() => runtime.setupStore({ isReadOnly }), [runtime, isReadOnly])

  return (
    <ReactRuntimeContext.Provider value={runtime}>
      {children}
      <PreviewSwitcher isPreview={isPreview} />
    </ReactRuntimeContext.Provider>
  )
}
