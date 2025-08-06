'use client'

import { type PropsWithChildren, useMemo } from 'react'
import { useIsPagesRouter } from '../../hooks/use-is-pages-router'

import { context as appRouterContext } from './app-router'
import { context as pagesRouterContext } from './pages-router'
import { FrameworkContext } from '../../../runtimes/react/components/framework-context'

export function FrameworkProvider({ children }: PropsWithChildren) {
  const isPagesRouter = useIsPagesRouter()
  const context = useMemo(
    () => (isPagesRouter ? pagesRouterContext : appRouterContext),
    [isPagesRouter],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
