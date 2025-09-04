import { type Context, type MiddlewareHandler, type Next } from 'hono'

import {
  type ApiHandlerUserConfig,
  MAKESWIFT_SITE_VERSION_COOKIE,
  createApiHandler as createMakeswiftApiHandler,
} from '@makeswift/runtime/unstable-framework-support'

import { Makeswift as MakeswiftClient } from '../client'

const API_PATH_PREFIX = '/api/makeswift/'

type UserConfig = ApiHandlerUserConfig & {
  revalidationHandler?: (path?: string) => Promise<void>
}

export function createApiHandler(
  apiKey: string,
  { apiOrigin, runtime, revalidationHandler, ...userConfig }: UserConfig,
): MiddlewareHandler {
  const client = new MakeswiftClient(apiKey, { apiOrigin, runtime })

  return async function apiHandler(c: Context, next: Next): Promise<Response | void> {
    if (!c.req.path.startsWith(API_PATH_PREFIX)) {
      return next()
    }

    const route = `/${c.req.path.replace(API_PATH_PREFIX, '')}`

    const apiHandler = createMakeswiftApiHandler(apiKey, {
      ...userConfig,
      previewCookieNames: [MAKESWIFT_SITE_VERSION_COOKIE],
      revalidationHandler: revalidationHandler ?? (() => Promise.resolve()),
      runtime,
      client,
    })

    return await apiHandler(c.req.raw, route)
  }
}
