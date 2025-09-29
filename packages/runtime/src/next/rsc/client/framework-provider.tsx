'use client'

import { type PropsWithChildren, useMemo } from 'react'

import { FrameworkContext } from '../../../runtimes/react/components/framework-context'

import { context as appRouterContext } from '../../components/framework-provider/app-router'
import { context as nextContext } from '../../components/framework-provider/next'
import { createRSCRefreshMiddleware } from './element-middleware'
import { useRouter } from 'next/navigation'
import { RSCElementData } from './element-data'

export function NextRSCFrameworkProvider({ children }: PropsWithChildren) {
  const router = useRouter()

  const context = useMemo<FrameworkContext>(
    () => ({
      ...appRouterContext,
      ...nextContext,
      ElementData: RSCElementData,
      previewStoreMiddlewares: [createRSCRefreshMiddleware(router)],
    }),
    [router],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
