'use client'

import { type PropsWithChildren, useMemo } from 'react'
import NextImage from 'next/image'

import { useIsPagesRouter } from '../../hooks/use-is-pages-router'
import { FrameworkContext } from '../../../runtimes/react/components/framework-context'
import { MAKESWIFT_CACHE_TAG } from '../../cache'

import { context as appRouterContext } from './app-router'
import { context as pagesRouterContext } from './pages-router'
import { Link } from './link'

export function FrameworkProvider({
  children,
  forcePagesRouter,
}: PropsWithChildren<{ forcePagesRouter?: boolean }>) {
  const isPagesRouter = useIsPagesRouter() || forcePagesRouter
  const context = useMemo<FrameworkContext>(
    () => ({
      ...(isPagesRouter ? pagesRouterContext : appRouterContext),
      Image: NextImage,
      Link,
      fetch: (url, init) => fetch(url, { ...init, next: { tags: [MAKESWIFT_CACHE_TAG] } }),
    }),
    [isPagesRouter],
  )

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
