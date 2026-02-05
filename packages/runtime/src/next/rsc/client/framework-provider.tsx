'use client'

import { type PropsWithChildren, useMemo, useCallback } from 'react'

import { FrameworkContext } from '../../../runtimes/react/components/framework-context'

import { context as appRouterContext } from '../../components/framework-provider/app-router'
import { context as nextContext } from '../../components/framework-provider/next'
import { createRSCRefreshMiddleware } from './refresh-middleware'
import { useRouter } from 'next/navigation'
import { RSCElementData } from '../../../rsc/client/element-data'

export function NextRSCFrameworkProvider({ children }: PropsWithChildren) {
  const router = useRouter()

  const refreshRSC = useCallback(() => {
    router.refresh()
  }, [router])

  const context = useMemo<FrameworkContext>(
    () => ({
      ...appRouterContext,
      ...nextContext,
      ElementData: RSCElementData,
      previewStoreMiddlewares: [createRSCRefreshMiddleware(router)],
      refreshRSC,
    }),
    [router, refreshRSC],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
