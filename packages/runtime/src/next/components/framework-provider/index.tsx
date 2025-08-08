'use client'

import { type PropsWithChildren, useMemo } from 'react'
import NextImage from 'next/image'

import { useIsPagesRouter } from '../../hooks/use-is-pages-router'

import { context as appRouterContext } from './app-router'
import { context as pagesRouterContext } from './pages-router'
import { FrameworkContext } from '../../../runtimes/react/components/framework-context'

export function FrameworkProvider({
  children,
  forcePagesRouter,
}: PropsWithChildren<{ forcePagesRouter?: boolean }>) {
  const isPagesRouter = useIsPagesRouter() || forcePagesRouter
  const context = useMemo(
    () => ({
      ...(isPagesRouter ? pagesRouterContext : appRouterContext),
      Image: NextImage,
    }),
    [isPagesRouter],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
