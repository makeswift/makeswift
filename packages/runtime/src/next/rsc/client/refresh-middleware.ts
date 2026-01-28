import { type Middleware } from '@reduxjs/toolkit'
import { type useRouter } from 'next/navigation'

import { createRSCRefreshMiddleware as createBaseRSCRefreshMiddleware } from '../../../rsc/client/refresh-middleware'

/**
 * Creates a Redux middleware that triggers a Next.js router refresh when server components are added.
 * @param router - The Next.js router instance from useRouter()
 */
export function createRSCRefreshMiddleware(router?: ReturnType<typeof useRouter>): Middleware {
  return createBaseRSCRefreshMiddleware(() => router?.refresh())
}
