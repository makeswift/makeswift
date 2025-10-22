'use client'

import { type PropsWithChildren, useMemo } from 'react'

import { useIsPagesRouter } from '../../hooks/use-is-pages-router'
import { FrameworkContext } from '../../../runtimes/react/components/framework-context'

import { context as appRouterContext } from './app-router'
import { context as pagesRouterContext } from './pages-router'
import { context as nextContext } from './next'

export function FrameworkProvider({
  children,
  forcePagesRouter,
}: PropsWithChildren<{ forcePagesRouter?: boolean }>) {
  const isPagesRouter = useIsPagesRouter() || forcePagesRouter
  const context = useMemo<FrameworkContext>(
    () => ({
      ...(isPagesRouter ? pagesRouterContext : appRouterContext),
      ...nextContext,
    }),
    [isPagesRouter],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
