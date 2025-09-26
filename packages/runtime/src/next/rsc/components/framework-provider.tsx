'use client'

import { type PropsWithChildren, useMemo } from 'react'

import { useIsPagesRouter } from '../../hooks/use-is-pages-router'
import { FrameworkContext } from '../../../runtimes/react/components/framework-context'

import { context as appRouterContext } from '../../components/framework-provider/app-router'
import { context as nextContext } from '../../components/framework-provider/next'
import { createRSCElementMiddleware } from '../middleware/rsc-element-middleware'
import { useRouter } from 'next/navigation'

export function NextRSCFrameworkProvider({
  children,
  forcePagesRouter,
}: PropsWithChildren<{ forcePagesRouter?: boolean }>) {
  const isPagesRouter = useIsPagesRouter() || forcePagesRouter
  const router = useRouter()

  const context = useMemo<FrameworkContext>(
    () => ({
      ...appRouterContext,
      ...nextContext,
      previewStoreMiddlewares: [createRSCElementMiddleware(router)],
    }),
    [isPagesRouter],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
